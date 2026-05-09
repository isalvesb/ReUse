import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

const defaultAvatar = require("../../../assets/images/profiles/default.png");

export function EditProfileScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");

  function handleSave() {
    console.log({
      name,
      email,
      location,
      about,
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
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
        {/*AVATAR*/}
        <View style={styles.avatarContainer}>
          <Image source={defaultAvatar} style={styles.avatar} />

          <Pressable style={styles.cameraButton}>
            <Ionicons name="camera-outline" size={20} color={"#fff"} />
          </Pressable>
        </View>

        {/*CARD*/}
        <View style={styles.card}>
          {/*NOME*/}
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

          {/*EMAIL*/}
          <Text style={styles.label}>E-mail</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholderTextColor={"#C6BDB5"}
            />

            <Ionicons name="pencil-outline" size={20} color={"#C6BDB5"} />
          </View>

          {/*LOCALIZAÇÃO*/}
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

          {/*SOBRE*/}
          <Text style={styles.label}>Sobre mim</Text>

          <TextInput
            placeholder="Fale um pouco sobre você..."
            value={about}
            onChangeText={setAbout}
            style={styles.aboutInput}
            placeholderTextColor={"#C6BDB5"}
          />
        </View>

        {/*BOTÕES*/}
        <View style={styles.actions}>
          <Pressable style={styles.cancelButton}>
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
