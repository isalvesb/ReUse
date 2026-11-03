import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

const chats = [
  {
    id: "1",
    userName: "Maria Silva",
    status: "Demonstração local",
    productStatus: "Negociando troca",
    productName: "cadeira de madeira",
    lastMessage: "Ah, sem problemas, vou pensar um pouco mais e te retorno",
    time: "10:36",
  },
  {
    id: "2",
    userName: "João Pedro",
    status: "Demonstração local",
    productStatus: "Interessado no item",
    productName: "luminária usada",
    lastMessage: "Ainda está disponível?",
    time: "09:48",
  },
];

const messages = [
  {
    id: "1",
    text: "Olá! Vi seu anúncio da cadeira de madeira. Tenho interesse!",
    time: "10:32",
    fromMe: false,
  },
  {
    id: "2",
    text: "Olá, tudo certo? A cadeira está em excelente estado",
    time: "10:33",
    fromMe: true,
  },
  {
    id: "3",
    text: "Você aceita trocar por uma cômoda?",
    time: "10:33",
    fromMe: false,
  },
  {
    id: "4",
    text: "Não, somente venda",
    time: "10:35",
    fromMe: true,
  },
  {
    id: "5",
    text: "Ah, sem problemas, vou pensar um pouco mais e te retorno",
    time: "10:36",
    fromMe: false,
  },
];

export default function Chats({embedded = false}: {embedded?: boolean}) {
  const insets = useSafeAreaInsets();
  const messageList = useRef<FlatList>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [threadMessages, setThreadMessages] = useState<Record<string, typeof messages>>({});
  const initialMessages = (id: string) => id === "1" ? messages : [{id:"initial-2",text:"Ainda está disponível?",time:"09:48",fromMe:true}];
  const sendLocalMessage = () => {
    const text = message.trim();
    if (!text || !selectedChat) return;
    const entry = {id:`local-${Date.now()}`,text,time:new Intl.DateTimeFormat("pt-BR",{hour:"2-digit",minute:"2-digit"}).format(new Date()),fromMe:true};
    setThreadMessages(current => ({...current,[selectedChat.id]:[...(current[selectedChat.id] || initialMessages(selectedChat.id)),entry]}));
    setMessage("");
    Keyboard.dismiss();
  };

  function renderChatList() {
    return (
      <View style={styles.container}>
        <Text style={[styles.pageTitle,{marginTop:insets.top+12}]}>Conversas</Text>
        <Text style={{color:"#584C4C",paddingHorizontal:24}}>Demonstração local. Mensagens temporárias, sem envio a outro usuário.</Text>

        <FlatList
          data={chats}
          extraData={threadMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              activeOpacity={0.8}
              onPress={() => { setSelectedChat(item); setMessage(""); }}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.userName.charAt(0)}
                </Text>
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={styles.chatTime}>{threadMessages[item.id]?.slice(-1)[0]?.time || item.time}</Text>
                </View>

                <Text style={styles.productStatus}>{item.productStatus}</Text>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {threadMessages[item.id]?.slice(-1)[0]?.text || item.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  function renderChatDetail() {
    return (
      <KeyboardAvoidingView
        style={[styles.container,{marginBottom:embedded ? insets.bottom+112 : insets.bottom}]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.detailHeader,{paddingTop:insets.top+12}]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedChat(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#342A2A" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.userRow}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>
                {selectedChat.userName.charAt(0)}
              </Text>
            </View>

            <View>
              <Text style={styles.detailUserName}>{selectedChat.userName}</Text>
              <Text style={styles.onlineText}>{selectedChat.status} · sem envio externo</Text>
            </View>
          </View>
        </View>

        <View style={styles.productBar}>
          <View style={styles.productImage}>
            <Ionicons name="cube-outline" size={26} color="#342A2A" />
          </View>

          <View>
            <Text style={styles.productStatus}>{selectedChat.productStatus}</Text>
            <Text style={styles.productName}>{selectedChat.productName}</Text>
          </View>
        </View>

        <FlatList
          ref={messageList}
          onContentSizeChange={() => messageList.current?.scrollToEnd({animated:true})}
          data={threadMessages[selectedChat.id] || initialMessages(selectedChat.id)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.fromMe ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.fromMe ? styles.myMessageText : styles.otherMessageText,
                ]}
              >
                {item.text}
              </Text>

              <Text
                style={[
                  styles.messageTime,
                  item.fromMe ? styles.myMessageTime : styles.otherMessageTime,
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#8F8A84"
            value={message}
            onChangeText={setMessage}
            accessibilityLabel="Mensagem demonstrativa"
            maxLength={1000}
            onSubmitEditing={sendLocalMessage}
          />

          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8} onPress={sendLocalMessage} disabled={!message.trim()} accessibilityRole="button" accessibilityLabel="Enviar mensagem demonstrativa" accessibilityState={{disabled:!message.trim()}}>
            <Ionicons name="paper-plane-outline" size={22} color="#342A2A" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return selectedChat ? renderChatDetail() : renderChatList();
}