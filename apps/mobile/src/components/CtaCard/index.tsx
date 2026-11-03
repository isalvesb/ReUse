import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  Animated,
  Pressable,
} from "react-native";
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

  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOverlayOpacity = useRef(new Animated.Value(0)).current;

  const animateButton = (toScale: number, toOpacity: number) => {
    Animated.parallel([
      Animated.spring(buttonScale, {
        toValue: toScale,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }),
      Animated.timing(buttonOverlayOpacity, {
        toValue: toOpacity,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderButton = (buttonStyle: object) => (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateButton(0.97, 0.08)}
      onLongPress={() => animateButton(0.94, 0.16)}
      onPressOut={() => animateButton(1, 0)}
      delayLongPress={180}
      style={buttonStyle}
    >
      <Animated.View
        style={[
          styles.button,
          {
            transform: [{ scale: buttonScale }],
          },
        ]}
      >
        <Text style={styles.buttonText}>{buttonTitle}</Text>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.buttonOverlay,
            {
              opacity: buttonOverlayOpacity,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );

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

        {renderButton(styles.heroButton)}
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

        {renderButton(styles.compactButton)}
      </View>
    </View>
  );
}