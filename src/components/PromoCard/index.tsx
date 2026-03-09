import {
  Text,
  Image,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

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

const styles = StyleSheet.create({
  card: {
    width: 308,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#342A2A",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "400",
    color: "#584C4C",
    lineHeight: 20,
  },

  image: {
    width: "100%",
    height: 156,
    marginTop: 12,
    borderRadius: 12,
  },
});