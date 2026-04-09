import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import GoogleIcon from "../../../assets/images/google.svg";
import FacebookIcon from "../../../assets/images/facebook.svg";
import styles from "./styles";

export function CreateAccount() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [email, setEmail] = useState("");

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
          {/* Logo */}
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
            <TouchableOpacity style={styles.socialButton}>
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
              <TextInput style={styles.input} placeholder="Seu nome" />
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
              <TextInput style={styles.input} placeholder="Cidade, Estado" />
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
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Criar Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
