import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { buscar, salvarObjeto } from "../../Services/Storage";
import { buscarUsuarioAtual } from "../../Services/firebaseAuth";
import { DEV_SKIP_AUTH } from "../../config/devAuth";

import styles from "./styles";

const defaultAvatar = require("../../../assets/images/profiles/default.png");

type ProfileData = {
  name: string;
  email: string;
  location: string;
  about: string;
  avatarUri?: string;
};

export function EditProfileScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [avatarUri, setAvatarUri] = useState("");

  useEffect(() => {
    async function loadProfileData() {
      try {
        const firebaseUser = buscarUsuarioAtual();

        const currentEmail = DEV_SKIP_AUTH
          ? "dev@reuse.app"
          : firebaseUser?.email;

        const currentName = DEV_SKIP_AUTH
          ? "Usuário Dev"
          : firebaseUser?.displayName;

        if (!currentEmail) {
          return;
        }

        setEmail(currentEmail);

        const savedUser = await buscar(`user:${currentEmail}`);

        if (!savedUser) {
          setName(currentName || "Usuário ReUse");
          setLocation("");
          setAbout("");
          return;
        }

        const parsedUser: ProfileData = JSON.parse(savedUser);

        setName(parsedUser.name || currentName || "Usuário ReUse");
        setLocation(parsedUser.location || "");
        setAbout(parsedUser.about || "");
        setAvatarUri(parsedUser.avatarUri || "");
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      }
    }

    loadProfileData();
  }, []);

  async function handlePickImage() {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          "Para alterar a foto de perfil, permita o acesso à galeria.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      setAvatarUri(result.assets[0].uri);
    } catch (error) {
      console.error("Erro ao abrir galeria:", error);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  }

  async function handleSave() {
    try {
      if (!email) {
        Alert.alert("Erro", "Não foi possível identificar o usuário.");
        return;
      }

      const profileData: ProfileData = {
        name: name.trim() || "Usuário ReUse",
        email,
        location: location.trim() || "Localização não informada",
        about: about.trim(),
        avatarUri,
      };

      await salvarObjeto(`user:${email}`, profileData);

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>
            <Ionicons name="arrow-back" size={20} color={"#fff"} />
            Voltar
          </Text>
        </Pressable>

        <Text style={styles.headerTitle}>Perfil</Text>

        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={avatarUri ? { uri: avatarUri } : defaultAvatar}
            style={styles.avatar}
          />

          <Pressable style={styles.cameraButton} onPress={handlePickImage}>
            <Ionicons name="camera-outline" size={20} color={"#fff"} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholderTextColor={"#C6BDB5"}
            />

            <Ionicons name="pencil-outline" size={20} color={"#C6BDB5"} />
          </View>

          <Text style={styles.label}>E-mail</Text>

          <View style={[styles.inputContainer, styles.disabledInputContainer]}>
            <TextInput
              placeholder="E-mail do usuário"
              value={email}
              editable={false}
              selectTextOnFocus={false}
              style={[styles.input, styles.disabledInput]}
              placeholderTextColor={"#C6BDB5"}
            />

            <Ionicons name="lock-closed-outline" size={20} color={"#C6BDB5"} />
          </View>

          <Text style={styles.label}>Localização</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Digite sua localização"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              placeholderTextColor={"#C6BDB5"}
            />

            <Ionicons name="pencil-outline" size={20} color={"#C6BDB5"} />
          </View>

          <Text style={styles.label}>Sobre mim</Text>

          <TextInput
            placeholder="Fale um pouco sobre você..."
            value={about}
            onChangeText={setAbout}
            style={styles.aboutInput}
            placeholderTextColor={"#C6BDB5"}
            multiline
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={"#342A2A"} />
          </Pressable>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={24} color={"#EBBBEB"} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
