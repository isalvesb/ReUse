import React, { useRef, useState } from "react";
import { Animated, Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

export default function SearchBar() {
  const [search, setSearch] = useState("");

  const inputRef = useRef<TextInput>(null);
  const scale = useRef(new Animated.Value(1)).current;
  const backgroundProgress = useRef(new Animated.Value(0)).current;

  const animateScale = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 24,
      bounciness: 0,
    }).start();
  };

  const animateBackground = (toValue: number) => {
    Animated.timing(backgroundProgress, {
      toValue,
      duration: 120,
      useNativeDriver: false,
    }).start();
  };

  const handlePressIn = () => {
    animateScale(0.985);
    animateBackground(1);
  };

  const handleLongPress = () => {
    animateScale(0.975);
    animateBackground(2);
  };

  const handlePressOut = () => {
    animateScale(1);
    animateBackground(0);
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
          styles.scaleWrapper,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: animatedBackgroundColor,
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

          <View pointerEvents="none">
            <Ionicons
              name="search"
              size={24}
              color="#342A2A"
              style={styles.icon}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}