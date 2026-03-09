import { StyleSheet, Image, ImageSourcePropType, Pressable } from "react-native";

type CategoryCardProps = {
  imageSource: ImageSourcePropType;
  onPress?: () => void;
};

export function CategoryCard({ imageSource, onPress }: CategoryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 18,
  },
});