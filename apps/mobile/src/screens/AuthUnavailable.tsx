import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
export function AuthUnavailable() {
  const navigation = useNavigation();
  return <View style={{ flex: 1, backgroundColor: "#342A2A", padding: 28, justifyContent: "center" }}>
    <Text style={{ color: "#EBBBEB", fontSize: 36, marginBottom: 24 }}>ReUse</Text>
    <Text style={{ color: "#F7EFDE", fontSize: 18 }}>Utilize uma das duas contas fictícias do laboratório. Cadastro, login social e recuperação por e-mail estão indisponíveis nesta etapa. Nenhuma mensagem será enviada.</Text>
    <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={{ padding: 20 }}><Text style={{ color: "#EBBBEB" }}>Voltar ao login</Text></Pressable>
  </View>;
}
