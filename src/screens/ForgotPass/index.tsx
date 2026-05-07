import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sendPasswordResetEmail } from "firebase/auth";

import styles from "./styles";
import { auth } from "../../Services/firebaseConfig";

type RootStackParamList = {
  ResetEmailSent: { email: string };
};

export function ForgotPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const insets = useSafeAreaInsets();

  async function handleSend() {
    const emailTratado = email.trim().toLowerCase();

    if (!emailTratado) {
      Alert.alert("Atenção", "Digite seu e-mail.");
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, emailTratado);

      navigation.navigate("ResetEmailSent", {
        email: emailTratado,
      });
    } catch (error: any) {
      console.log("Erro ao enviar recuperação de senha:", error.code, error.message);

      Alert.alert(
        "Erro",
        "Não foi possível enviar o e-mail de recuperação. Verifique o e-mail digitado e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.backWrap, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#342A2A" />
          <Text style={styles.back}>Voltar</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Esqueceu a senha?</Text>

        <Text style={styles.subtitle}>
          Não se preocupe! Digite seu e-mail e enviaremos um link para redefinir
          sua senha.
        </Text>

        <Image
          source={require("../../../assets/images/cta/security-shield.png")}
          style={styles.image}
        />

        <Text style={styles.label}>E-mail</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#999" />

          <TextInput
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <Pressable
          style={styles.button}
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#F7EFDE" />
          ) : (
            <Text style={styles.buttonText}>
              Enviar link para redefinir senha
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}