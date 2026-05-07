import { useEffect, useState } from "react";
import { View, FlatList, Text, Image, ImageStyle } from "react-native";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

export default function Notificationsr() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  async function fetchNotifications(id: string | null) {
    if (!id) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", id);

    if (!error && data) setNotifications(data);
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
          setNotifications((prev) => [payload.new, ...prev]);
        },
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
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Avatar */}
            <Image
              source={{
                uri: item.avatar_url || "https://i.pravatar.cc/100",
              }}
              style={styles.avatar as ImageStyle}
            />

            {/* Conteúdo */}
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{getTimeAgo(item.created_at)}</Text>
              </View>

              <Text style={styles.message}>{item.message}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
