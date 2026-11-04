import { mergeMessageWindow } from "../../lib/chatHistory";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  AppState,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  conversations,
  messages,
  sendMessage,
  readConversation,
  messageKey,
  Conversation,
  ChatMessage,
} from "../../lib/chatApi";
import { useActivePolling } from "../../lib/useActivePolling";
import styles from "./styles";
const time = (s: string) =>
  new Date(s).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
export default function Chats({ embedded = false, route }: any) {
  const insets = useSafeAreaInsets(),
    navigation = useNavigation<any>();
  const [rows, setRows] = useState<Conversation[]>([]),
    [cursor, setCursor] = useState<string | null>(null);
  const [selected, setSelected] = useState<Conversation | null>(null),
    [history, setHistory] = useState<ChatMessage[]>([]),
    [olderCursor, setOlderCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true),
    [sending, setSending] = useState(false),
    [paging, setPaging] = useState(false),
    [error, setError] = useState(""),
    [text, setText] = useState("");
  const requestKey = useRef<{
      text: string;
      key: string;
    } | null>(null),
    selection = useRef<string | null>(route?.params?.conversationId ?? null),
    list = useRef<FlatList<ChatMessage>>(null),
    seen = useRef(""),
    initialPage = useRef(false),
    listLoaded = useRef(false);
  const historyRef = useRef<ChatMessage[]>([]);
  function updateHistory(
    incoming: ChatMessage[],
    live = false,
    next: string | null = null,
  ) {
    const result = mergeMessageWindow(historyRef.current, incoming, live);
    historyRef.current = result.items;
    setHistory(result.items);
    if (result.reset) setOlderCursor(next);
  }
  async function refresh() {
    const id = selection.current;
    try {
      if (id) {
        const result = await messages(id);
        if (selection.current !== id) return;
        setSelected(result.conversation);
        updateHistory(result.items, true, result.nextCursor);
        if (!initialPage.current) {
          setOlderCursor(result.nextCursor);
          initialPage.current = true;
        }
        const last = result.items.at(-1)?.id;
        if (
          last &&
          seen.current !== last &&
          AppState.currentState === "active"
        ) {
          await readConversation(id, last);
          seen.current = last;
        }
      } else {
        const result = await conversations();
        if (selection.current) return;
        setRows((old) => [
          ...new Map(
            [
              ...result.items,
              ...old.filter((c) => !result.items.some((n) => n.id === c.id)),
            ].map((c) => [c.id, c]),
          ).values(),
        ]);
        if (!listLoaded.current) {
          setCursor(result.nextCursor);
          listLoaded.current = true;
        }
      }
      setError("");
    } catch {
      setError(
        "Não foi possível atualizar as conversas. Verifique a conexão ou entre novamente.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const id = route?.params?.conversationId;
    if (id && selection.current !== id) {
      selection.current = id;
      initialPage.current = false;
      seen.current = "";
      historyRef.current = [];
      setHistory([]);
      setSelected(null);
      setOlderCursor(null);
      setText("");
      requestKey.current = null;
      setLoading(true);
      void refresh();
    }
  }, [route?.params?.conversationId]);
  useActivePolling(refresh);
  async function open(row: Conversation) {
    selection.current = row.id;
    seen.current = "";
    initialPage.current = false;
    setSelected(row);
    historyRef.current = [];
    setHistory([]);
    setOlderCursor(null);
    setText("");
    requestKey.current = null;
    setError("");
    setLoading(true);
    await refresh();
  }
  async function back() {
    if (!embedded && route?.params?.conversationId) {
      navigation.goBack();
      return;
    }
    selection.current = null;
    setSelected(null);
    historyRef.current = [];
    setHistory([]);
    setText("");
    setError("");
    await refresh();
  }
  async function send() {
    const content = text.trim(),
      id = selection.current;
    if (!content || !id || sending) return;
    setSending(true);
    try {
      if (requestKey.current?.text !== content)
        requestKey.current = {
          text: content,
          key: (await messageKey(id)).clientKey,
        };
      const row = await sendMessage(id, content, requestKey.current.key);
      if (selection.current === id) {
        updateHistory([row]);
        setText("");
        requestKey.current = null;
        setError("");
      }
    } catch {
      setError(
        "Mensagem não confirmada. Toque em enviar para tentar novamente; o texto foi preservado.",
      );
    } finally {
      setSending(false);
    }
  }
  async function more() {
    setPaging(true);
    try {
      if (selection.current && olderCursor) {
        const id = selection.current,
          result = await messages(id, olderCursor);
        if (selection.current !== id) return;
        updateHistory(result.items);
        setOlderCursor(result.nextCursor);
      } else if (cursor) {
        const result = await conversations(cursor);
        setRows((old) => [
          ...new Map([...old, ...result.items].map((c) => [c.id, c])).values(),
        ]);
        setCursor(result.nextCursor);
      }
      setError("");
    } catch {
      setError("Não foi possível carregar a página. Tente novamente.");
    } finally {
      setPaging(false);
    }
  }
  const status = (
    <>
      {loading && <ActivityIndicator color="#342A2A" />}
      {error ? (
        <TouchableOpacity onPress={refresh} accessibilityRole="button">
          <Text
            accessibilityRole="alert"
            style={{ padding: 12, color: "#8b2424" }}
          >
            {error} Tentar novamente.
          </Text>
        </TouchableOpacity>
      ) : null}
    </>
  );
  const currentId = selection.current;
  if (!currentId)
    return (
      <View
        style={[
          styles.container,
          { paddingBottom: embedded ? insets.bottom + 110 : insets.bottom },
        ]}
      >
        <Text style={[styles.pageTitle, { marginTop: insets.top + 12 }]}>
          Conversas
        </Text>
        {status}
        <Text
          style={{ paddingHorizontal: 24, color: "#584C4C", marginBottom: 12 }}
        >
          Atualização periódica enquanto esta tela está aberta.
        </Text>
        <FlatList
          data={rows}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading && !error ? (
              <Text>
                Nenhuma conversa. Abra um anúncio para falar com o anunciante.
              </Text>
            ) : null
          }
          ListFooterComponent={
            cursor ? (
              <TouchableOpacity onPress={more} disabled={paging}>
                <Text style={{ padding: 16 }}>
                  {paging ? "Carregando..." : "Mais conversas"}
                </Text>
              </TouchableOpacity>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              onPress={() => open(item)}
              accessibilityRole="button"
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.participant.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.userName}>{item.participant.name}</Text>
                  <Text style={styles.chatTime}>{time(item.lastActivity)}</Text>
                </View>
                <Text style={styles.productName}>{item.itemTitle}</Text>
                <Text style={styles.lastMessage} numberOfLines={2}>
                  {item.preview || "Conversa sem mensagens"}
                </Text>
                {item.unreadCount > 0 && (
                  <Text>{item.unreadCount} não lidas</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: embedded ? insets.bottom + 106 : insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.detailHeader, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={back}
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#342A2A" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
          <View style={styles.userRow}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>
                {selected?.participant.name.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailUserName}>
                {selected?.participant.name || "Carregando conversa"}
              </Text>
              <Text style={styles.onlineText}>
                Atualização periódica · {selected?.role}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.productBar}>
          <Ionicons name="cube-outline" size={26} color="#342A2A" />
          <Text style={[styles.productName, { flex: 1, marginLeft: 12 }]}>
            {selected?.itemTitle}
          </Text>
        </View>
        {status}
        <FlatList
          ref={list}
          data={history}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => {
            if (!paging) list.current?.scrollToEnd({ animated: false });
          }}
          ListHeaderComponent={
            olderCursor ? (
              <TouchableOpacity onPress={more} disabled={paging}>
                <Text style={{ padding: 12 }}>
                  {paging ? "Carregando..." : "Mensagens anteriores"}
                </Text>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            !loading && !error ? (
              <Text>Esta conversa ainda não tem mensagens.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "me" ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === "me"
                    ? styles.myMessageText
                    : styles.otherMessageText,
                ]}
              >
                {item.content}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.sender === "me"
                    ? styles.myMessageTime
                    : styles.otherMessageTime,
                ]}
              >
                {new Date(item.createdAt).toLocaleDateString("pt-BR")} ·{" "}
                {time(item.createdAt)}
              </Text>
            </View>
          )}
        />
        <View style={styles.inputArea}>
          <TextInput
            secureTextEntry={false}
            textContentType="none"
            autoComplete="off"
            accessibilityLabel="Mensagem"
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#8F8A84"
            value={text}
            onChangeText={(value) => {
              setText(value);
              requestKey.current = null;
            }}
            editable={!sending}
            maxLength={1000}
            onSubmitEditing={send}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={send}
            disabled={sending || !text.trim()}
            accessibilityLabel="Enviar mensagem"
            accessibilityRole="button"
            accessibilityState={{ disabled: sending || !text.trim() }}
          >
            {sending ? (
              <ActivityIndicator color="#342A2A" />
            ) : (
              <Ionicons name="paper-plane-outline" size={22} color="#342A2A" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
