import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Image,
  ImageStyle,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

type NotificationItem = {
  id: string | number;
  title: string;
  message: string;
  created_at: string;
  avatar_url?: string | null;
};

export default function Notifications() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  async function fetchNotifications(id: string | null) {
    if (!id) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }
  }

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      const id = data.user?.id ?? null;

      setUserId(id);
    }

    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications(userId);

    const channel = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [
            payload.new as NotificationItem,
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  function getTimeAgo(date: string) {
    const diff = (Date.now() - new Date(date).getTime()) / 1000;

    if (diff < 60) return "agora";
    if (diff < 3600) return `há ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;

    return `há ${Math.floor(diff / 86400)}d`;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.screenTitle}>Notificações</Text>

        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-outline"
                size={32}
                color="#342A2A"
              />
              <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
              <Text style={styles.emptyText}>
                Suas notificações aparecerão aqui quando houver novidades.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{
                  uri: item.avatar_url || "https://i.pravatar.cc/100",
                }}
                style={styles.avatar as ImageStyle}
              />

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.time}>{getTimeAgo(item.created_at)}</Text>
                </View>

                <Text style={styles.message}>{item.message}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}