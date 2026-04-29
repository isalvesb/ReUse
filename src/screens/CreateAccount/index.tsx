import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

import { auth } from "../../Services/firebaseConfig";
import { salvarToken } from "../../Services/Auth";
import { salvar, buscar } from "../../Services/Storage";

import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";

import styles from "./styles";

WebBrowser.maybeCompleteAuthSession();

type RootStackParamList = {
  HomeScreen: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "com.guicunhasou.reuse",
});

export function CreateAccount({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [googleRequest, googleResponse, promptGoogleAsync] =
    Google.useAuthRequest({
      redirectUri: GOOGLE_REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

  useEffect(() => {
    async function handleGoogleCreateAccount() {
      if (googleResponse?.type !== "success") return;

      try {
        setLoading(true);

        const idToken =
          googleResponse.authentication?.idToken ||
          googleResponse.params.id_token ||
          null;

        const accessToken =
          googleResponse.authentication?.accessToken ||
          googleResponse.params.access_token ||
          null;

        if (!idToken && !accessToken) {
          throw new Error("Token do Google não encontrado.");
        }

        const credential = GoogleAuthProvider.credential(idToken, accessToken);

        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        const userKey = user.email ?? user.uid;

        if (user.email) {
          const existingUser = await buscar(`user:${user.email}`);

          if (!existingUser) {
            await salvar(
              `user:${user.email}`,
              JSON.stringify({
                name: user.displayName ?? "Usuário ReUse",
                email: user.email,
                location: "",
                password: "",
                photo: user.photoURL ?? "",
                provider: "google",
              }),
            );
          }
        }

        await salvarToken(userKey);

        navigation.replace("HomeScreen");
      } catch (error: any) {
        Alert.alert(
          "Erro no cadastro com Google",
          error.message || "Não foi possível criar a conta com Google.",
        );
      } finally {
        setLoading(false);
      }
    }

    handleGoogleCreateAccount();
  }, [googleResponse]);

  async function handleCreateAccount() {
    const formattedName = name.trim();
    const formattedEmail = email.trim().toLowerCase();
    const formattedLocation = location.trim();

    if (!formattedName) {
      Alert.alert("Atenção", "Informe seu nome.");
      return;
    }

    if (!formattedEmail) {
      Alert.alert("Atenção", "Informe seu e-mail.");
      return;
    }

    if (!formattedLocation) {
      Alert.alert("Atenção", "Informe sua localização.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Atenção", "A senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Atenção", "As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const existingUser = await buscar(`user:${formattedEmail}`);

      if (existingUser) {
        Alert.alert("Atenção", "Este e-mail já está cadastrado.");
        return;
      }

      await salvar(
        `user:${formattedEmail}`,
        JSON.stringify({
          name: formattedName,
          email: formattedEmail,
          location: formattedLocation,
          password,
          photo: "",
          provider: "local",
        }),
      );

      await salvarToken(formattedEmail);

      navigation.replace("HomeScreen");
    } catch {
      Alert.alert("Erro", "Não foi possível criar a conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleFacebookLater() {
    Alert.alert(
      "Facebook",
      "Vamos configurar o login com Facebook depois que o Google estiver funcionando.",
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7EFDE" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!loading}
        >
          <Pressable
            disabled={loading}
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
              style={[
                styles.socialButton,
                (loading || !googleRequest) && { opacity: 0.6 },
              ]}
              onPress={() => promptGoogleAsync()}
              disabled={loading || !googleRequest}
            >
              <GoogleIcon width={18} height={18} />
              <Text style={styles.socialButtonText}>Continuar com Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { opacity: 0.65 }]}
              onPress={handleFacebookLater}
              disabled={loading}
            >
              <FacebookIcon width={18} height={18} />
              <Text style={styles.socialButtonText}>
                Continuar com Facebook
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividirContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.line} />
          </View>

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
                placeholderTextColor="#9B9B9B"
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
                placeholderTextColor="#9B9B9B"
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
                placeholderTextColor="#9B9B9B"
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
                placeholderTextColor="#9B9B9B"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />

              <TouchableOpacity
                disabled={loading}
                onPress={() => setShowPass(!showPass)}
              >
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
                placeholderTextColor="#9B9B9B"
                secureTextEntry={!showConfirmPass}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />

              <TouchableOpacity
                disabled={loading}
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
