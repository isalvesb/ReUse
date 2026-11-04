import { Text } from "../../design/Text";
import { notifications } from "../../lib/chatApi";
import { useActivePolling } from "../../lib/useActivePolling";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { logoutCompartilhado } from "../../Services/authSession";
import {
  readMyProfile,
  readMyItemStatistics,
  ItemStatistics,
  ProfileApiError,
} from "../../lib/profileApi";
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

  const [stats, setStats] = useState<ItemStatistics | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");
  const [statsAttempt, setStatsAttempt] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let statsRequest = 0;
      const loadStats = async () => {
        const request = ++statsRequest;
        setStats(null);
        setStatsLoading(true);
        setStatsError("");
        try {
          const next = await readMyItemStatistics();
          if (active && request === statsRequest) setStats(next);
        } catch {
          if (active && request === statsRequest)
            setStatsError("Estatísticas indisponíveis. Tente novamente.");
        } finally {
          if (active && request === statsRequest) setStatsLoading(false);
        }
      };
      void loadStats();
      const appState = AppState.addEventListener("change", (state) => {
        if (state === "active") void loadStats();
      });
      setIsLoadingUser(true);
      setError("");
      readMyProfile()
        .then((profile) => {
          if (!active) return;
          setUser({
            name: profile.name,
            email: profile.email,
            location: profile.location || "Localização não informada",
          });
          setAbout(profile.bio || "");
        })
        .catch((error) => {
          if (active) {
            setUser(null);
            setAbout("");
            setError(
              error instanceof ProfileApiError
                ? error.message
                : "Não foi possível carregar o perfil. Verifique a conexão e tente novamente.",
            );
          }
        })
        .finally(() => {
          if (active) setIsLoadingUser(false);
        });
      return () => {
        active = false;
        statsRequest++;
        appState.remove();
      };
    }, [statsAttempt]),
  );
  const profileImageSource = defaultProfileImage;
  const isLogoutDisabled = isLoggingOut;

  const [notificationCount, setNotificationCount] = useState(0);
  useActivePolling(async () => {
    try {
      setNotificationCount((await notifications()).unreadCount);
    } catch {
      /* Keep last count while offline. */
    }
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

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
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
        {error ? (
          <Text accessibilityRole="alert" style={styles.statusMessage}>
            {error}
          </Text>
        ) : null}
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
                <Ionicons name="cube-outline" size={16} style={styles.icon} />
                <Text style={styles.statNumber}>
                  {statsLoading ? "…" : (stats?.totalItems ?? "—")}
                </Text>
                <Text style={styles.statLabel}>Anúncios</Text>
              </View>

              <View style={styles.statCard2}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  style={styles.icon}
                />
                <Text style={styles.statNumber}>
                  {statsLoading ? "…" : (stats?.activeItems ?? "—")}
                </Text>
                <Text style={styles.statLabel}>Ativos</Text>
              </View>

              <View style={styles.statCard3}>
                <Ionicons
                  name="pause-circle-outline"
                  size={16}
                  style={styles.icon}
                />
                <Text style={styles.statNumber}>
                  {statsLoading ? "…" : (stats?.pausedItems ?? "—")}
                </Text>
                <Text style={styles.statLabel}>Pausados</Text>
              </View>
            </View>
            {statsLoading ? (
              <Text accessibilityLiveRegion="polite">
                Carregando estatísticas...
              </Text>
            ) : null}
            {statsError ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Tentar novamente as estatísticas"
                onPress={() => setStatsAttempt((value) => value + 1)}
                style={styles.statsRetry}
              >
                <Text accessibilityRole="alert">{statsError}</Text>
              </Pressable>
            ) : null}
            {stats?.totalItems === 0 ? (
              <Text>Você ainda não publicou anúncios.</Text>
            ) : null}

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
      </ScrollView>
    </View>
  );
}
