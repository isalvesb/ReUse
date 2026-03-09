import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import Button from "../Button/index";

type CtaCardProps = {
  title: string;
  subtitle: string;
  highlightText?: string;
  imageSource: ImageSourcePropType;
  buttonTitle: string;
  onPress: () => void;
  variant?: "hero" | "compact";
};

export default function CtaCard({
  title,
  subtitle,
  highlightText,
  imageSource,
  buttonTitle,
  onPress,
  variant = "hero",
}: CtaCardProps) {
  const isHero = variant === "hero";

  if (isHero) {
    return (
      <View style={[styles.card, styles.heroCard]}>
        <View style={styles.heroContent}>
          <Text style={[styles.title, styles.heroTitle]}>{title}</Text>
          <Text style={[styles.subtitle, styles.heroSubtitle]}>{subtitle}</Text>
        </View>

        <Image
          source={imageSource}
          style={[styles.image, styles.heroImage]}
          resizeMode="contain"
        />

        <Button
          title={buttonTitle}
          onPress={onPress}
          style={[styles.button, styles.heroButton]}
          textStyle={styles.buttonText}
        />
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.compactCard]}>
      <Image
        source={imageSource}
        style={[styles.image, styles.compactImage]}
        resizeMode="contain"
      />

      <View style={styles.compactContent}>
        <View>
          <Text style={[styles.title, styles.compactTitle]}>{title}</Text>

          <Text style={[styles.subtitle, styles.compactSubtitle]}>
            {highlightText ? (
              <>
                <Text style={styles.highlightText}>{highlightText}</Text>{" "}
                {subtitle}
              </>
            ) : (
              subtitle
            )}
          </Text>
        </View>

        <Button
          title={buttonTitle}
          onPress={onPress}
          style={[styles.button, styles.compactButton]}
          textStyle={styles.buttonText}
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

  image: {},

  title: {
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#EADDFF",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  buttonText: {
    color: "#342A2A",
    fontSize: 16,
    fontWeight: "600",
  },

  heroCard: {
    backgroundColor: "#342A2A",
    minHeight: 360,
    padding: 20,
    position: "relative",
  },

  heroContent: {
    maxWidth: "60%",
    left: 15,
  },

  heroTitle: {
    fontSize: 32,
    lineHeight: 40,
    color: "#F7EFDE",
    marginBottom: 2,
    marginTop: 16,
  },

  heroSubtitle: {
    color: "#F7EFDE",
  },

  heroImage: {
    width: 140,
    height: 140,
    position: "absolute",
    right: 40,
    bottom: 90,
  },

  heroButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },

  compactCard: {
    backgroundColor: "#F7EFDE",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingVertical: 20,
    gap: 16,
  },

  compactContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  compactTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: "#342A2A",
    marginBottom: 12,
  },

  compactSubtitle: {
    color: "#342A2A",
  },

  highlightText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#342A2A",
  },

  compactImage: {
    width: 150,
    height: 150,
  },

  compactButton: {
    alignSelf: "flex-end",
    marginTop: 24,
  },
});