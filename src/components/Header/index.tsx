import React, { useEffect, useRef } from "react";
import { View, Text, Image, Pressable, Animated } from "react-native";
import styles from "./styles";

export default function Header() {
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(8)).current;

  const iconScale = useRef(new Animated.Value(1)).current;
  const iconOverlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslateY]);

  const animateIcon = (toScale: number, toOpacity: number) => {
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: toScale,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }),
      Animated.timing(iconOverlayOpacity, {
        toValue: toOpacity,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
        },
      ]}
    >
      <Text style={styles.logoText}>ReUse</Text>

      <Pressable
        onPressIn={() => animateIcon(0.94, 0.08)}
        onLongPress={() => animateIcon(0.9, 0.14)}
        onPressOut={() => animateIcon(1, 0)}
        delayLongPress={180}
        style={styles.iconButton}
      >
        <Animated.View
          style={[
            styles.iconWrap,
            {
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <Image
            source={require("../../../assets/images/icon.png")}
            style={styles.icon}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.iconOverlay,
              { opacity: iconOverlayOpacity },
            ]}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}