import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

import { auth } from "../../Services/firebaseConfig";
import { salvarToken } from "../../Services/Auth";
import { buscar, salvar } from "../../Services/Storage";
import { LoadingAnimation } from "../../components/LoadingAnimation";

import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";

import styles from "./styles";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "com.guicunhasou.reuse",
});

export function Login() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const overlayProgress = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [googleRequest, googleResponse, promptGoogleAsync] =
    Google.useAuthRequest({
      redirectUri: GOOGLE_REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

  const [facebookRequest, facebookResponse, promptFacebookAsync] =
    Facebook.useAuthRequest({
      clientId: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID,
      scopes: ["public_profile", "email"],
    });

  useEffect(() => {
    async function handleGoogleLogin() {
      if (googleResponse?.type !== "success") return;

      try {
        setIsLoading(true);
        showLoadingOverlay();

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

        setTimeout(() => {
          navigation.replace("HomeScreen");
        }, 1200);
      } catch (error: any) {
        hideLoadingOverlay();

        Alert.alert(
          "Erro no login com Google",
          error.message || "Não foi possível entrar com Google.",
        );
      }
    }

    handleGoogleLogin();
  }, [googleResponse]);

  useEffect(() => {
    async function handleFacebookLogin() {
      if (facebookResponse?.type !== "success") return;

      try {
        setIsLoading(true);
        showLoadingOverlay();

        const accessToken =
          facebookResponse.authentication?.accessToken ||
          facebookResponse.params.access_token ||
          null;

        if (!accessToken) {
          throw new Error("Token do Facebook não encontrado.");
        }

        const credential = FacebookAuthProvider.credential(accessToken);
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
                provider: "facebook",
              }),
            );
          }
        }

        await salvarToken(userKey);

        setTimeout(() => {
          navigation.replace("HomeScreen");
        }, 1200);
      } catch (error: any) {
        hideLoadingOverlay();

        Alert.alert(
          "Erro no login com Facebook",
          error.message || "Não foi possível entrar com Facebook.",
        );
      }
    }

    handleFacebookLogin();
  }, [facebookResponse]);

  function showLoadingOverlay() {
    Animated.timing(overlayProgress, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }

  function hideLoadingOverlay() {
    Animated.timing(overlayProgress, {
      toValue: 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(false);
    });
  }

  async function handleLogin() {
    const formattedEmail = email.trim().toLowerCase();

    if (!formattedEmail || !password.trim()) {
      Alert.alert("Atenção", "Preencha os campos.");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    showLoadingOverlay();

    try {
      const usuarioRaw = await buscar(`user:${formattedEmail}`);

      if (!usuarioRaw) {
        throw new Error("Usuário não encontrado.");
      }

      const usuario = JSON.parse(usuarioRaw);

      if (usuario.password !== password) {
        throw new Error("Senha incorreta.");
      }

      await salvarToken(formattedEmail);

      setTimeout(() => {
        navigation.replace("HomeScreen");
      }, 1200);
    } catch (error: any) {
      hideLoadingOverlay();

      Alert.alert("Erro ao entrar", error.message || "Tente novamente.");
    }
  }

  function handleFacebookLater() {
    Alert.alert(
      "Facebook",
      "Vamos configurar o login com Facebook depois que o Google estiver funcionando.",
    );
  }

  const contentOpacity = overlayProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.28],
  });

  const contentScale = overlayProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.985],
  });

  const overlayOpacity = overlayProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#342A2A" />

      <Animated.View
        style={{
          flex: 1,
          opacity: contentOpacity,
          transform: [{ scale: contentScale }],
        }}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingTop: insets.top + 24,
                paddingBottom: insets.bottom + 24,
              },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={!isLoading}
          >
            <View style={styles.content}>
              <Text style={styles.logoText}>ReUse</Text>

              <View style={styles.socialContainer}>
                <Pressable
                  disabled={isLoading || !googleRequest}
                  onPress={() => promptGoogleAsync()}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                    (isLoading || !googleRequest) && { opacity: 0.6 },
                  ]}
                >
                  <View style={styles.socialIconWrapper}>
                    <GoogleIcon width={18} height={18} />
                  </View>

                  <Text style={styles.socialButtonText}>
                    Continuar com Google
                  </Text>
                </Pressable>

                <Pressable
                  disabled={isLoading || !facebookRequest}
                  onPress={() => promptFacebookAsync()}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                    (isLoading || !facebookRequest) && { opacity: 0.6 },
                  ]}
                >
                  <View style={styles.socialIconWrapper}>
                    <FacebookIcon width={18} height={18} />
                  </View>

                  <Text style={styles.socialButtonText}>
                    Continuar com Facebook
                  </Text>
                </Pressable>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>E-mail</Text>

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
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                <Text style={styles.inputLabel}>Senha</Text>

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
                    secureTextEntry={!passwordVisible}
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                  />

                  <Pressable
                    disabled={isLoading}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={({ pressed }) => [
                      styles.eyeIcon,
                      pressed && styles.iconPressed,
                    ]}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#342A2A"
                    />
                  </Pressable>
                </View>

                <Pressable
                  disabled={isLoading}
                  onPress={() => navigation.navigate("ForgotPass")}
                  style={({ pressed }) => [
                    styles.forgotPassword,
                    pressed && styles.textButtonPressed,
                  ]}
                >
                  <Text style={styles.forgotPasswordText}>
                    Esqueceu a senha?
                  </Text>
                </Pressable>

                <Pressable
                  disabled={isLoading}
                  onPress={handleLogin}
                  style={({ pressed }) => [
                    styles.loginButton,
                    pressed && styles.loginButtonPressed,
                    isLoading && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.loginButtonText}>Entrar</Text>
                </Pressable>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Não tem uma conta?</Text>

                  <Pressable
                    disabled={isLoading}
                    onPress={() => navigation.navigate("CreateAccount")}
                    style={({ pressed }) => pressed && styles.textButtonPressed}
                  >
                    <Text style={styles.signUpText}>Criar conta</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>

      {isLoading && (
        <Animated.View
          pointerEvents="auto"
          style={[styles.loadingOverlay, { opacity: overlayOpacity }]}
        >
          <LoadingAnimation size={120} loop={false} speed={1.4} />
        </Animated.View>
      )}
    </View>
  );
}
