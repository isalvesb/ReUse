import React, { useRef } from "react";
import {
  Text,
  Image,
  Pressable,
  Animated,
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
  const scale = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const animateFeedback = (toScale: number, toOpacity: number) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: toScale,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }),
      Animated.timing(overlayOpacity, {
        toValue: toOpacity,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    animateFeedback(0.985, 0.05);
  };

  const handleLongPress = () => {
    animateFeedback(0.97, 0.1);
  };

  const handlePressOut = () => {
    animateFeedback(1, 0);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      delayLongPress={180}
    >
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <ViewWithOverlay
          imageSource={imageSource}
          overlayOpacity={overlayOpacity}
        />
      </Animated.View>
    </Pressable>
  );
}

type ViewWithOverlayProps = {
  imageSource: ImageSourcePropType;
  overlayOpacity: Animated.Value;
};

function ViewWithOverlay({
  imageSource,
  overlayOpacity,
}: ViewWithOverlayProps) {
  return (
    <Animated.View style={styles.imageWrapper}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      />
    </Animated.View>
  );
}