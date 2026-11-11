import { useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";

import styles from "./styles";
import { auth } from "../../Services/firebaseConfig";

type RouteParams = {
  email?: string;
};

export function ResetEmailSent() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { email } = (route.params as RouteParams) || {};

  const [loading, setLoading] = useState(false);

  async function handleResendEmail() {
    if (!email) {
      Alert.alert(
        "E-mail não encontrado",
        "Volte para a tela anterior e digite seu e-mail novamente."
      );
      return;
    }

    try {
      setLoading(true);

      await sendPasswordResetEmail(auth, email.trim().toLowerCase());

      Alert.alert(
        "E-mail reenviado",
        "Enviamos novamente o link de recuperação. Verifique sua caixa de entrada e o spam."
      );
    } catch (error: any) {

      Alert.alert(
        "Erro",
        "Não foi possível reenviar o e-mail de recuperação. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="checkmark-circle-outline"
            size={40}
            color="#342A2A"
          />
        </View>

        <Text style={styles.title}>E-mail enviado!</Text>

        <Text style={styles.subtitle}>
          Enviamos um link de recuperação para{" "}
          <Text style={styles.bold}>{email || "seu e-mail"}</Text>
        </Text>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            <Text style={styles.bold}>Dica:</Text> Não encontrou o e-mail?
            Verifique sua caixa de spam ou lixo eletrônico.
          </Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={handleResendEmail}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#F7EFDE" />
          ) : (
            <Text style={styles.buttonText}>Reenviar e-mail</Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-outline" size={16} />
          <Text style={styles.backText}>Voltar para o login</Text>
        </Pressable>
      </View>
    </View>
  );
}