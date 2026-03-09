import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import Button from "../Button/index";
import styles from "./styles";

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
