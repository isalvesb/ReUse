import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { buscarToken, logout } from "../../Services/Auth";
import { buscar } from "../../Services/Storage";
import styles from "./styles";

type UserData = {
  name: string;
  email: string;
  location: string;
};

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

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
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
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
                  source={require("../../../assets/images/icon.png")}
                  style={styles.profileImage}
                />

                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {user?.name || "Usuário ReUse"}
                  </Text>

                  <Text style={styles.profileEmail}>
                    {user?.email || "E-mail não encontrado"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Localização</Text>
                <Text style={styles.infoValue}>
                  {user?.location || "Localização não informada"}
                </Text>
              </View>

              <Pressable
                onPress={handleLogout}
                disabled={isLoggingOut}
                style={({ pressed }) => [
                  styles.logoutButton,
                  pressed && !isLoggingOut && styles.logoutButtonPressed,
                  isLoggingOut && styles.logoutButtonDisabled,
                ]}
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.logoutButtonText}>Logout</Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
    </View>
  );
}