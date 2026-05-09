import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  buscarUsuarioAtual,
  logoutFirebase,
} from "../../Services/firebaseAuth";
import { buscar } from "../../Services/Storage";
import { DEV_SKIP_AUTH } from "../../config/devAuth";
import { supabase } from "../../lib/supabase";
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

type ProfileScreenProps = {
  onLogoutComplete?: () => void;
};

export function ProfileScreen({ onLogoutComplete }: ProfileScreenProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [about, setAbout] = useState("");

  const [stats, setStats] = useState({
    trocas: 0,
    itens: 0,
    avaliacao: 4.8,
  });

  async function fetchStats(userEmail: string) {
    try {
      const { count: itens, error } = await supabase
        .from("items")
        .select("*", { count: "exact", head: true })
        .eq("user_email", userEmail);

      if (error) {
        throw error;
      }

      setStats({
        trocas: 0,
        itens: itens || 0,
        avaliacao: 4.8,
      });
    } catch (error) {
      console.error("Erro ao buscar stats:", error);

      setStats({
        trocas: 0,
        itens: 0,
        avaliacao: 4.8,
      });
    }
  }

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        const firebaseUser = buscarUsuarioAtual();

        const userId = DEV_SKIP_AUTH ? "dev@reuse.app" : firebaseUser?.uid;
        const emailAtual = DEV_SKIP_AUTH
          ? "dev@reuse.app"
          : firebaseUser?.email;
        const nomeAtual = DEV_SKIP_AUTH
          ? "Usuário Dev"
          : firebaseUser?.displayName;

        if (emailAtual) {
          await fetchStats(emailAtual);
        }

        if (!emailAtual) {
          setUser(null);
          return;
        }

        const userData = await buscar(`user:${emailAtual}`);

        if (!userData) {
          setUser({
            name: nomeAtual || "Usuário ReUse",
            email: emailAtual,
            location: "Localização não informada",
          });
          return;
        }

        const parsedUser = JSON.parse(userData);

        setUser({
          name: parsedUser.name || nomeAtual || "Usuário ReUse",
          email: parsedUser.email || emailAtual,
          location: parsedUser.location || "Localização não informada",
        });

        if (parsedUser.about) {
          setAbout(parsedUser.about);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    carregarTudo();
  }, []);

  const normalizedEmail = user?.email?.toLowerCase();

  const profileImageSource =
    normalizedEmail && profileImagesByEmail[normalizedEmail]
      ? profileImagesByEmail[normalizedEmail]
      : defaultProfileImage;

  const isLogoutDisabled = DEV_SKIP_AUTH || isLoggingOut;

  const notificationCount = 0;

  const handleLogout = async () => {
    if (DEV_SKIP_AUTH) {
      return;
    }

    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logoutFirebase();

      onLogoutComplete?.();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      {/* NAVBAR */}
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", padding: 8 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Pressable
          style={styles.notificationButton}
          onPress={() => navigation.navigate("Notifications")}
          hitSlop={12}
        >
          <Ionicons name="notifications-outline" size={22} color="#F7EFDE" />

          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {notificationCount}
              </Text>
            </View>
          )}
        </Pressable>
        {isLoadingUser ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#342A2A" />
            <Text>Carregando perfil...</Text>
          </View>
        ) : (
          <>
            <View style={styles.avatarContainer}>
              <Image source={profileImageSource} style={styles.avatar} />
            </View>

            <Text style={styles.name}>{user?.name}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} />
              <Text style={styles.infoText}>{user?.location}</Text>
            </View>

            {/* STATS */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="gift-outline" size={16} style={styles.icon} />
                <Text style={styles.statNumber}>{stats.trocas}</Text>
                <Text style={styles.statLabel}>Trocas</Text>
              </View>

              <View style={styles.statCard2}>
                <Ionicons name="cube-outline" size={16} style={styles.icon} />
                <Text style={styles.statNumber}>{stats.itens}</Text>
                <Text style={styles.statLabel}>Itens</Text>
              </View>

              <View style={styles.statCard3}>
                <Ionicons name="star-outline" size={16} style={styles.icon} />
                <Text style={styles.statNumber}>
                  {stats.avaliacao.toFixed(1)}
                </Text>
                <Text style={styles.statLabel}>Avaliação</Text>
              </View>
            </View>

            {/* SOBRE */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Sobre mim</Text>

              <Text style={styles.aboutText}>
                {about || "Nenhuma informação adicionada ainda."}
              </Text>
            </View>

            <Pressable
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              disabled={isLogoutDisabled}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutButtonText}>
                {isLoggingOut ? "Saindo..." : "Logout"}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
