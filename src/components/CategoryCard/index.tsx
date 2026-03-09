import { Image, ImageSourcePropType, Pressable } from "react-native";
import styles from "./styles";

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
