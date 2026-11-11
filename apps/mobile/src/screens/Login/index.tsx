import { Text } from "../../design/Text";
import { useRef, useState } from "react";
import {
  View,
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
import { loginComEmailSenha } from "../../Services/authSession";
import { LoadingAnimation } from "../../components/LoadingAnimation";
import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";

import styles from "./styles";

export function Login() {
  const insets = useSafeAreaInsets();

  const overlayProgress = useRef(new Animated.Value(0)).current;

  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    if (!email.trim() || !password || isLoading) return;
    setLoginError("");
    setIsLoading(true);
    showLoadingOverlay();
    try { await loginComEmailSenha(email, password); }
    catch { const message = "Não foi possível entrar. Confira as credenciais e a conexão."; setLoginError(message); Alert.alert("Erro ao entrar", message); }
    finally { hideLoadingOverlay(); }
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
                  disabled
                  accessibilityHint="Indisponível nesta etapa"
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                    { opacity: 0.65 },
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
                  disabled
                  accessibilityHint="Indisponível nesta etapa"
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.buttonPressed,
                    { opacity: 0.65 },
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
                <Text style={styles.footerText}>Laboratório: utilize uma das duas contas de teste. Login social indisponível.</Text>
                {loginError ? <Text accessibilityRole="alert" style={styles.footerText}>{loginError}</Text> : null}
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
                    accessibilityLabel="E-mail"
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
                    accessibilityLabel="Senha"
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
                  onPress={() => Alert.alert("Laboratório", "Recuperação por e-mail indisponível nesta etapa. Nenhuma mensagem foi enviada.")}
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
                    onPress={() => Alert.alert("Laboratório", "Utilize uma das duas contas fictícias já provisionadas.")}
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
