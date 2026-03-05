import { Pressable, Image, StyleSheet, ImageSourcePropType } from "react-native";

const placeholder = require("../../../assets/images/placeholder2.png");

type Props = {
  image?: ImageSourcePropType;
  onPress?: () => void;
};

export function CategoryCard({ image = placeholder, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={image} style={styles.image} resizeMode="cover" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", height: 90, borderRadius: 10, overflow: "hidden", marginBottom: 14 },
  image: { width: "100%", height: "100%" },
});