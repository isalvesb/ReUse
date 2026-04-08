import React, { useState } from "react";
import { View, Text, TextInput, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export function ForgotPass() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (!email) {
      alert("Digite seu e-mail");
      return;
    }

    alert("Link enviado para redefinir senha!");
  };

  return (
    <View style={styles.container}>
      {/* Voltar */}
      <View style={{ paddingTop: insets.top + 20 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </Pressable>
      </View>

      {/* Título */}
      <View style={styles.content}>
        <Text style={styles.title}>Esqueceu a senha?</Text>

        {/* Descrição */}
        <Text style={styles.subtitle}>
          Não se preocupe! Digite seu e-mail e enviaremos um link para redefinir
          sua senha.
        </Text>

        {/* Ilustração */}
        <Image
          source={require("../../../assets/images/cta/security-shield.png")}
          style={styles.image}
        />

        {/* Label */}
        <Text style={styles.label}>E-mail</Text>

        {/* Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={"#999"} />
          <TextInput
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        {/* Botão */}
        <Pressable style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>
            Enviar link para redefinir senha
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
