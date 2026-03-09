import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import Button from "../Button";

type CtaCardProps = {
  title: string;
  subtitle: string;
  imageSource: ImageSourcePropType;
  buttonTitle: string;
  onPress: () => void;
  variant?: "hero" | "compact";
};

export default function CtaCard({
  title,
  subtitle,
  imageSource,
  buttonTitle,
  onPress,
  variant = "hero",
}: CtaCardProps) {
  const isHero = variant === "hero";

  return (
    <View style={[styles.card, isHero ? styles.heroCard : styles.compactCard]}>
      <Image
        source={imageSource}
        style={[styles.image, isHero ? styles.heroImage : styles.compactImage]}
        resizeMode="contain"
      />

      <View style={[styles.content, isHero ? styles.heroContent : styles.compactContent]}>
        <Text style={[styles.title, isHero ? styles.heroTitle : styles.compactTitle]}>
          {title}
        </Text>

        <Text style={styles.subtitle}>{subtitle}</Text>

        <Button
          title={buttonTitle}
          onPress={onPress}
          style={[styles.button, !isHero && styles.compactButton]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },

  heroCard: {
    backgroundColor: "#342A2A",
    minHeight: 320,
    padding: 20,
    position: "relative",
  },

  compactCard: {
    backgroundColor: "#F7EFDE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 8,
    gap: 16,
  },

  content: {
    flexShrink: 1,
  },

  heroContent: {
    maxWidth: "60%",
  },

  compactContent: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontWeight: "700",
  },

  heroTitle: {
    fontSize: 26,
    lineHeight: 34,
    color: "#F7EFDE",
    marginBottom: 8,
  },

  compactTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#342A2A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#342A2A",
  },

  image: {},

  heroImage: {
    width: 170,
    height: 170,
    position: "absolute",
    right: 18,
    bottom: 58,
  },

  compactImage: {
    width: 120,
    height: 120,
  },

  button: {
    marginTop: 20,
    alignSelf: "flex-start",
  },

  compactButton: {
    alignSelf: "flex-end",
  },
});