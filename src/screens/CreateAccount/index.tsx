import { salvarToken } from "../../Services/Auth";
import { salvar, buscar } from "../../Services/Storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import app from "../../Services/firebaseConfig";
import styles from "./styles";
import * as AuthSession from "expo-auth-session";

console.log(AuthSession.makeRedirectUri({ useProxy: true }));

WebBrowser.maybeCompleteAuthSession();

const auth = getAuth(app);

type RootStackParamList = {
  HomeScreen: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function CreateAccount({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "214549799877-ggh6fl3piia4n7kg918eqqkg1hf04bbo.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert("Sucesso", "Login com Google realizado!");
          navigation.replace("HomeScreen");
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Erro", "Não foi possível logar com o Google");
        });
    }
  }, [response]);

  const handleCreateAccount = async () => {
    if (!name.trim()) return Alert.alert("Atenção", "Informe seu nome.");
    if (!email.trim()) return Alert.alert("Atenção", "Informe seu e-mail.");
    if (!location.trim())
      return Alert.alert("Atenção", "Informe sua localização.");
    if (password.length < 8)
      return Alert.alert("Atenção", "A senha deve ter no mínimo 8 caracteres.");
    if (password !== confirmPassword)
      return Alert.alert("Atenção", "As senhas não coincidem.");

    setLoading(true);
    try {
      const usuarioExistente = await buscar(`user:${email}`);
      if (usuarioExistente) {
        Alert.alert("Atenção", "Este e-mail já está cadastrado.");
        return;
      }

      const usuario = JSON.stringify({ name, email, location, password });
      await salvar(`user:${email}`, usuario);

      await salvarToken(email);

      navigation.replace("HomeScreen");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7EFDE" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#342A2A" />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/ReUse-logo-marrom.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Criar conta</Text>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => promptAsync()}
            >
              <GoogleIcon width={18} height={18} />
              <Text style={styles.socialButtonText}>Continuar com Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <FacebookIcon width={18} height={18} />
              <Text style={styles.socialButtonText}>
                Continuar com Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividirContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          {/* Form Fields */}

          {/* Nome */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={"#342A2A"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* E-mail */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={"#342A2A"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Localização */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="location-outline"
                size={20}
                color={"#342A2A"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Cidade, Estado"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={"#342A2A"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={"#342A2A"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={"#342A2A"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                secureTextEntry={!showConfirmPass}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPass(!showConfirmPass)}
              >
                <Ionicons
                  name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={"#342A2A"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Criar Conta */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.createButtonText}>Criar Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
