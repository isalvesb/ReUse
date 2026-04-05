import React, { useRef } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
} from "react-native";
import styles from "./styles";

type CategoryCardProps = {
  imageSource: ImageSourcePropType;
  onPress?: () => void;
};

export function CategoryCard({ imageSource, onPress }: CategoryCardProps) {
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
    animateFeedback(0.97, 0.08);
  };

  const handleLongPress = () => {
    animateFeedback(0.95, 0.16);
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
      style={styles.card}
    >
      <Animated.View
        style={[
          styles.imageWrapper,
          {
            transform: [{ scale }],
          },
        ]}
      >
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
    </Pressable>
  );
}