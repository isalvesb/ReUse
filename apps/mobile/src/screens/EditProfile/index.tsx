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
import { readMyProfile, editMyProfile } from "../../lib/profileApi";

import styles from "./styles";

const defaultAvatar = require("../../../assets/images/profiles/default.png");

export function EditProfileScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const avatarUri = "";
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    readMyProfile().then(profile => {
      if (!active) return;
      setName(profile.name); setEmail(profile.email); setLocation(profile.location || ""); setAbout(profile.bio || "");
      setLoaded(true);
    }).catch(() => { if (active) setError("Não foi possível carregar o perfil. Verifique a conexão."); });
    return () => { active = false; };
  }, []);

  async function handleSave() {
    if (saving || !loaded) return;
    setSaving(true); setError("");
    try { await editMyProfile({ name, bio: about }); navigation.goBack(); }
    catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar as alterações.";
      setError(message); Alert.alert("Perfil", message);
    } finally { setSaving(false); }
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

          <Pressable accessibilityRole="button" accessibilityLabel="Alterar foto do perfil" style={styles.cameraButton} disabled accessibilityHint="Alteração de avatar indisponível nesta etapa">
            <Ionicons name="camera-outline" size={20} color={"#fff"} />
          </Pressable>
        </View>

        <Text>Avatar e localização preservados nesta etapa.</Text>
        {error ? <Text accessibilityRole="alert">{error}</Text> : null}
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>

          <View style={styles.inputContainer}>
            <TextInput
              accessibilityLabel="Nome"
              editable={loaded && !saving}
              maxLength={100}
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
              editable={false}
              style={styles.input}
              placeholderTextColor={"#C6BDB5"}
            />

            <Ionicons name="pencil-outline" size={20} color={"#C6BDB5"} />
          </View>

          <Text style={styles.label}>Sobre mim</Text>

          <TextInput
            accessibilityLabel="Sobre mim"
            editable={loaded && !saving}
            maxLength={1000}
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
            accessibilityRole="button"
            accessibilityLabel="Cancelar edição do perfil"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={"#342A2A"} />
          </Pressable>

          <Pressable accessibilityRole="button" accessibilityLabel="Salvar perfil" disabled={saving || !loaded} style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={24} color={"#EBBBEB"} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
