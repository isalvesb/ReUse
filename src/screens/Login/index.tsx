import { useRef, useState } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { salvarToken } from "../../Services/Auth";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";
import { LoadingAnimation } from "../../components/LoadingAnimation";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const overlayProgress = useRef(new Animated.Value(0)).current;

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Preencha os campos");
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
      await salvarToken("");

      setTimeout(() => {
        navigation.replace("HomeScreen");
      }, 1200);
    } catch (error) {
      Animated.timing(overlayProgress, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
      });

      alert("Não foi possível entrar agora. Tente novamente.");
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                    placeholder="••••••••"
                    placeholderTextColor="#342A2A"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!passwordVisible}
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
                    style={({ pressed }) => pressed && styles.textButtonPressed}
                  >
                    <Text
                      onPress={() => navigation.navigate("CreateAccount")}
                      style={styles.signUpText}
                    >
                      Criar conta
                    </Text>
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
