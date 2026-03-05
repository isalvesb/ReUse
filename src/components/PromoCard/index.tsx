import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const placeholder = require("../../../assets/images/placeholder1.png");

export function PromoCard() {
  return (
    <Pressable style={styles.card}>
      <Text style={styles.title}>Título</Text>
      <Text style={styles.subtitle}>Texto do subtítulo</Text>

      <View style={styles.imageWrap}>
        <Image source={placeholder} style={styles.image} resizeMode="cover" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { marginTop: 2, fontSize: 14, fontWeight: "600" },
  imageWrap: { marginTop: 10, borderRadius: 10, overflow: "hidden", height: 180 },
  image: { width: "100%", height: "100%" },
});