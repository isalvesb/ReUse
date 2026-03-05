import { useState } from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar móveis, roupas, eletrônicos..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      <Ionicons name="search" size={24} color="#79747E" style={styles.icon} />
    </View>
  );
}