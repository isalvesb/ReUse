import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  TextInput,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const inputRef = useRef<TextInput>(null);
  const scale = useRef(new Animated.Value(1)).current;
  const backgroundProgress = useRef(new Animated.Value(0)).current;

  const animateFeedback = (toScale: number, toBackground: number) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: toScale,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }),
      Animated.timing(backgroundProgress, {
        toValue: toBackground,
        duration: 120,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    animateFeedback(0.985, 1);
  };

  const handleLongPress = () => {
    animateFeedback(0.975, 2);
  };

  const handlePressOut = () => {
    animateFeedback(1, 0);
    inputRef.current?.focus();
  };

  const animatedBackgroundColor = backgroundProgress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["#F3E8D2", "#EBDDCA", "#E1D1BA"],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      delayLongPress={180}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: animatedBackgroundColor,
            transform: [{ scale }],
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Buscar móveis, roupas, eletrônicos..."
          placeholderTextColor="#A0947A"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        <Ionicons name="search" size={24} color="#342A2A" style={styles.icon} />
      </Animated.View>
    </Pressable>
  );
}