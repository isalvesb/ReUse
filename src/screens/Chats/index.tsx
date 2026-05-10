import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const chats = [
  {
    id: "1",
    userName: "Maria Silva",
    status: "Online",
    productStatus: "Negociando troca",
    productName: "cadeira de madeira",
    lastMessage: "Ah, sem problemas, vou pensar um pouco mais e te retorno",
    time: "10:36",
  },
  {
    id: "2",
    userName: "João Pedro",
    status: "Online",
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

export default function Chats() {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState("");

  function renderChatList() {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Conversas</Text>

        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatCard}
              activeOpacity={0.8}
              onPress={() => setSelectedChat(item)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.userName.charAt(0)}
                </Text>
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={styles.chatTime}>{item.time}</Text>
                </View>

                <Text style={styles.productStatus}>{item.productStatus}</Text>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {item.lastMessage}
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
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.detailHeader}>
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
              <Text style={styles.onlineText}>{selectedChat.status}</Text>
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
          data={messages}
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
          />

          <TouchableOpacity style={styles.sendButton} activeOpacity={0.8}>
            <Ionicons name="paper-plane-outline" size={22} color="#342A2A" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return selectedChat ? renderChatDetail() : renderChatList();
}