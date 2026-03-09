import {
  Text,
  Image,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

import styles from "./styles";

type PromoCardProps = {
  title: string;
  subtitle: string;
  imageSource: ImageSourcePropType;
  onPress?: () => void;
};

export function PromoCard({
  title,
  subtitle,
  imageSource,
  onPress,
}: PromoCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <Image source={imageSource} style={styles.image} resizeMode="cover" />
    </Pressable>
  );
}
