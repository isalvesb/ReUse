import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";

export function ResetEmailSent() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.content}>
        {/* Ícone */}
        <View style={styles.iconCircle}>
          <Ionicons
            name="checkmark-circle-outline"
            size={40}
            color={"#342A2A"}
          />
        </View>

        {/* Texto */}
        <Text style={styles.title}>E-mail enviado!</Text>

        <Text style={styles.subtitle}>
          Enviamos um link de recuperação para{" "}
          <Text style={styles.bold}>seuemail@email.com</Text>
        </Text>

        {/* Dica */}
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            <Text style={styles.bold}>Dica:</Text> Não encontrou o e-mail?
            Verifique sua caixa de spam ou lixo eletrônico.
          </Text>
        </View>

        {/* Botão */}
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Reenviar e-mail</Text>
        </Pressable>

        {/* Voltar */}
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
