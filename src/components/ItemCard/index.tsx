import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  ImageSourcePropType,
} from "react-native";

import styles from "./styles";

type Props = {
  title: string;
  condition: string;
  details: string;
  distance: string;
  transaction: string;
  imageSource?: ImageSourcePropType;
  onPress?: () => void;
};

export function ItemCard({
  title,
  condition,
  details,
  distance,
  transaction,
  imageSource,
  onPress,
}: Props) {
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
        <View style={styles.imageWrap}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.caption}>
            {condition} • {details}
          </Text>
          <Text style={styles.caption}>{distance}</Text>
          <Text style={styles.caption}>{transaction}</Text>
        </View>

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