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
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";

// CORREÇÃO: Importar a instância configurada do seu serviço
import { auth } from "../../Services/firebaseConfig";
import styles from "./styles";

WebBrowser.maybeCompleteAuthSession();

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
    redirectUri: AuthSession.makeRedirectUri({
      scheme: "com.anonymous.reuse",
    }),
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      // CORREÇÃO: No Android nativo, o token costuma vir aqui:
      const idToken =
        response.params.id_token || response.authentication?.idToken;

      if (!idToken) {
        Alert.alert("Erro", "Token não encontrado.");
        return;
      }

      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.replace("HomeScreen");
        })
        .catch((error) => {
          console.error(error);
          Alert.alert("Erro no Firebase", error.message);
        });
    }
  }, [response]);

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "1650966322512425",
  });

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { access_token } = fbResponse.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential)
        .then(() => {
          navigation.replace("HomeScreen");
        })
        .catch((error) => {
          Alert.alert("Erro no Facebook", error.message);
        });
    }
  }, [fbResponse]);

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
        setLoading(false);
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
          scrollEnabled={!loading}
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

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => promptAsync()}
              disabled={loading || !request}
            >
              <GoogleIcon width={18} height={18} />
              <Text style={styles.socialButtonText}>Continuar com Google</Text>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => fbPromptAsync()}
                disabled={loading || !request}
              >
                <FacebookIcon width={18} height={18} />
                <Text style={styles.socialButtonText}>
                  Continuar com Facebook
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dividirContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

          {/* Campos do Formulário */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#342A2A"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#342A2A"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localização</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#342A2A"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Cidade, Estado"
                value={location}
                onChangeText={setLocation}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#342A2A"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Ionicons
                  name={showPass ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#342A2A"
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
                color="#342A2A"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                secureTextEntry={!showConfirmPass}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPass(!showConfirmPass)}
              >
                <Ionicons
                  name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#342A2A"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && { opacity: 0.7 }]}
            onPress={handleCreateAccount}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? "Criando..." : "Criar Conta"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
