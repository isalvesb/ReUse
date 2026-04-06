import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import Button from "../../components/Button";
import { salvarToken } from "../../Services/Auth";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"light-content"} />

      {/* Logo */}
      <Image
        source={require("../../../assets/images/logotipoLogin.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* Botões Sociais */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={20} style={styles.socialIconG} />
          <Text style={styles.socialButtonText}>Continuar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={20} style={styles.socialIconFb} />
          <Text style={styles.socialButtonText}>Continuar com Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Divisor 'ou' */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.line} />
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>E-mail</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.inputLabel}>Senha</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="........"
            placeholderTextColor={"#666"}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye-outline" : "eye-off-outline"}
              style={styles.inputIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity>
            <Text style={styles.signUpText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
