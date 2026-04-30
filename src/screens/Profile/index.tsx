import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { buscarToken, logout } from "../../Services/Auth";
import { buscar } from "../../Services/Storage";
import { DEV_SKIP_AUTH } from "../../config/devAuth";

import styles from "./styles";

type UserData = {
  name: string;
  email: string;
  location: string;
};

const defaultProfileImage = require("../../../assets/images/profiles/default.png");

const profileImagesByEmail: Record<string, any> = {
  "gui@email.com": require("../../../assets/images/profiles/gui.png"),
  "isa@email.com": require("../../../assets/images/profiles/isa.png"),
  "kau@email.com": require("../../../assets/images/profiles/kau.png"),
  "mir@email.com": require("../../../assets/images/profiles/mir.png"),
};

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const normalizedEmail = user?.email?.toLowerCase();

  const profileImageSource =
    normalizedEmail && profileImagesByEmail[normalizedEmail]
      ? profileImagesByEmail[normalizedEmail]
      : defaultProfileImage;

  const isLogoutDisabled = DEV_SKIP_AUTH || isLoggingOut;

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const emailAtual = await buscarToken();

        if (!emailAtual) {
          setUser(null);
          return;
        }

        const userData = await buscar(`user:${emailAtual}`);

        if (!userData) {
          setUser({
            name: "Usuário ReUse",
            email: emailAtual,
            location: "Localização não informada",
          });
          return;
        }

        const parsedUser = JSON.parse(userData);

        setUser({
          name: parsedUser.name,
          email: parsedUser.email,
          location: parsedUser.location,
        });
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    carregarUsuario();
  }, []);

  const handleLogout = async () => {
    if (DEV_SKIP_AUTH) {
      console.log("Logout desativado temporariamente no modo desenvolvimento.");
      return;
    }

    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.navBar,
          {
            paddingTop: insets.top + 14,
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        <Text style={styles.navTitle}>Perfil</Text>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          {isLoadingUser ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#342A2A" />
              <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
          ) : (
            <>
              <View style={styles.profileHeader}>
                <Image
                  source={profileImageSource}
                  style={styles.profileImage}
                />

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {user?.name || "Usuário"}
                  </Text>

                  <Text style={styles.profileNote}>
                    {user?.email || "E-mail não encontrado"}
                  </Text>

                  <Text style={styles.profileNote}>
                    {user?.location || "Localização não informada"}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleLogout}
                disabled={isLogoutDisabled}
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && !isLogoutDisabled && styles.logoutButtonPressed,
                  isLogoutDisabled && styles.logoutButtonDisabled,
                ]}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.logoutButtonText}>
                    {DEV_SKIP_AUTH ? "Logout desativado" : "Logout"}
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}