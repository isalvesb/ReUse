import { View, TextInput } from "react-native";
import Button from "../../components/Button";
import { useState } from "react";
import { salvarToken } from "../../Services/Auth";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigation = useNavigation<any>();

  const handleLogin = async () => {
    // simulação de Login
    if (email && senha) {
      await salvarToken("");
      navigation.navigate("HomeScreen");
    } else {
      alert("Preencha os campos");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
