import { useState, useRef } from "react";
import {
  View,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  notifications,
  readNotification,
  readAllNotifications,
  Notice,
} from "../../lib/chatApi";
import { useActivePolling } from "../../lib/useActivePolling";
import styles from "./styles";
export default function Notifications() {
  const navigation = useNavigation<any>(),
    insets = useSafeAreaInsets();
  const [rows, setRows] = useState<Notice[]>([]),
    [count, setCount] = useState(0),
    [cursor, setCursor] = useState<string | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const loaded = useRef(false);
  async function refresh() {
    try {
      const result = await notifications();
      setRows((old) => [
        ...result.items,
        ...old.filter((n) => !result.items.some((x) => x.id === n.id)),
      ]);
      if (!loaded.current) {
        setCursor(result.nextCursor);
        loaded.current = true;
      }
      setCount(result.unreadCount);
      setError("");
    } catch {
      setError(
        "Não foi possível atualizar as notificações. Verifique a conexão ou entre novamente.",
      );
    } finally {
      setLoading(false);
    }
  }
  useActivePolling(refresh, 10000);
  async function open(n: Notice) {
    setBusy(true);
    try {
      await readNotification(n.id);
      if (n.conversationId)
        navigation.navigate("Chats", { conversationId: n.conversationId });
      else if (n.itemId) navigation.navigate("Product", { itemId: n.itemId });
      await refresh();
    } catch {
      setError("Não foi possível abrir a notificação. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  async function all() {
    setBusy(true);
    try {
      await readAllNotifications();
      setRows((old) => old.map((n) => ({ ...n, read: true })));
      await refresh();
    } catch {
      setError("Não foi possível confirmar a leitura.");
    } finally {
      setBusy(false);
    }
  }
  async function more() {
    if (!cursor) return;
    setBusy(true);
    try {
      const result = await notifications(cursor);
      setRows((old) => [
        ...new Map([...old, ...result.items].map((n) => [n.id, n])).values(),
      ]);
      setCursor(result.nextCursor);
      setCount(result.unreadCount);
    } catch {
      setError("Não foi possível carregar a página.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={styles.container}>
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Notificações · {count} não lidas</Text>
        {count > 0 && (
          <Pressable onPress={all} disabled={busy}>
            <Text
              style={{ paddingBottom: 16, textDecorationLine: "underline" }}
            >
              Marcar todas como lidas
            </Text>
          </Pressable>
        )}
        {loading ? <ActivityIndicator color="#342A2A" /> : null}
        {error ? (
          <Pressable onPress={refresh}>
            <Text accessibilityRole="alert">{error} Tentar novamente.</Text>
          </Pressable>
        ) : null}
        <FlatList
          data={rows}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading && !error ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-outline"
                  size={32}
                  color="#342A2A"
                />
                <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
                <Text style={styles.emptyText}>
                  Suas notificações internas aparecerão aqui.
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            cursor ? (
              <Pressable onPress={more} disabled={busy}>
                <Text style={{ padding: 16 }}>Mais notificações</Text>
              </Pressable>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.card,
                !item.read
                  ? { borderColor: "#cdb1d3", backgroundColor: "#ead5ed" }
                  : {},
              ]}
              onPress={() => open(item)}
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={`${item.read ? "Lida" : "Não lida"}: ${item.message}`}
            >
              <Ionicons
                name="notifications-outline"
                size={26}
                color="#342A2A"
                style={{ marginRight: 12 }}
              />
              <View style={styles.cardContent}>
                <Text style={styles.title}>
                  {item.read ? "Lida" : "Não lida"}
                </Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleString("pt-BR")}
                </Text>
                {item.conversationId ? (
                  <Text style={styles.message}>Abrir conversa</Text>
                ) : null}
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
