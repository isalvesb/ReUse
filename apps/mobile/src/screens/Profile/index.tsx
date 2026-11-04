import { Text } from "../../design/Text";
import { notifications } from "../../lib/chatApi";
import { useActivePolling } from "../../lib/useActivePolling";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { logoutCompartilhado } from "../../Services/authSession";
import { readMyProfile } from "../../lib/profileApi";
import styles from "./styles";

type UserData = {
  name: string;
  email: string;
  location: string;
};

const defaultProfileImage = require("../../../assets/images/profiles/default.png");

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
  const [error, setError] = useState("");

  const [stats] = useState({
    trocas: 0,
    itens: 0,
    avaliacao: null as number | null,
  });

  useFocusEffect(useCallback(() => {
    let active = true;
    setIsLoadingUser(true);
    setError("");
    readMyProfile().then(profile => {
      if (!active) return;
      setUser({ name: profile.name, email: profile.email, location: profile.location || "Localização não informada" });
      setAbout(profile.bio || "");
    }).catch((error) => { if (active) { setUser(null); setAbout(""); setError(error instanceof Error ? error.message : "Não foi possível carregar o perfil. Verifique a conexão e tente novamente."); } })
      .finally(() => { if (active) setIsLoadingUser(false); });
    return () => { active = false; };
  }, []));
  const profileImageSource = defaultProfileImage;
  const isLogoutDisabled = isLoggingOut;

  const [notificationCount, setNotificationCount] = useState(0);
  useActivePolling(async () => {
    try { setNotificationCount((await notifications()).unreadCount); }
    catch { /* Keep last count while offline. */ }
  }, 10000);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logoutCompartilhado();

      onLogoutComplete?.();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      {error ? <Text accessibilityRole="alert">{error}</Text> : null}
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
          accessibilityRole="button"
          accessibilityLabel="Abrir notificações"
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
                  {stats.avaliacao?.toFixed(1) ?? "—"}
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
