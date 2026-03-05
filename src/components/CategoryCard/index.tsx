import { Pressable, Image, StyleSheet } from "react-native";

const placeholder = require("../../../assets/images/placeholder2.png");

export function CategoryCard() {
  return (
    <Pressable style={styles.card}>
      <Image source={placeholder} style={styles.image} resizeMode="cover" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", height: 90, borderRadius: 10, overflow: "hidden", marginBottom: 14 },
  image: { width: "100%", height: "100%" },
});