import { useRef, useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { salvarToken } from "../../Services/Auth";
import { buscar } from "../../Services/Storage";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";
import { LoadingAnimation } from "../../components/LoadingAnimation";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

// IMPORTANTE: Importe o auth da sua config, não do firebase/auth diretamente
import { auth } from "../../Services/firebaseConfig";
import * as AuthSession from "expo-auth-session";
import * as Facebook from "expo-auth-session/providers/facebook";
import { FacebookAuthProvider } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "214549799877-pi6pn2k22gk2hg6c5f98j4pn2ekn3c9n.apps.googleusercontent.com",
    webClientId:
      "214549799877-1ru8afm8ll7r60q5k686ucf8sbhkara8.apps.googleusercontent.com",

    redirectUri: AuthSession.makeRedirectUri({
      scheme: "com.anonymous.reuse",
    }),
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

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const overlayProgress = useRef(new Animated.Value(0)).current;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha os campos");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    Animated.timing(overlayProgress, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    try {
      const usuarioRaw = await buscar(`user:${email}`);
      if (!usuarioRaw) throw new Error("Usuário não encontrado.");

      const usuario = JSON.parse(usuarioRaw);
      if (usuario.password !== password) throw new Error("Senha incorreta.");

      await salvarToken(email);
      setTimeout(() => {
        navigation.replace("HomeScreen");
      }, 1200);
    } catch (error: any) {
      Animated.timing(overlayProgress, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
      });
      Alert.alert("Erro ao entrar", error.message || "Tente novamente.");
    }
  };

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
                  disabled={isLoading || !request}
                  onPress={() => promptAsync()}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
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
                  disabled={isLoading || !fbRequest}
                  onPress={() => fbPromptAsync()}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
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
