import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

const TABS = [
  { name: "home", icon: "home-outline", label: "Home" },
  { name: "publicar", icon: "cloud-upload-outline", label: "Publicar" },
  { name: "vitrine", icon: "storefront-outline", label: "Vitrine" },
  { name: "mensagens", icon: "chatbubble-outline", label: "Chats" },
] as const;

type TabName = (typeof TABS)[number]["name"];

const INDICATOR_SIZE = 58;

export default function TabBar() {
  const [active, setActive] = useState<TabName>("home");
  const [barWidth, setBarWidth] = useState(0);

  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(0)).current;

  const activeIndex = TABS.findIndex((tab) => tab.name === active);
  const tabWidth = barWidth > 0 ? barWidth / TABS.length : 0;

  useEffect(() => {
    if (!tabWidth) return;

    const toValue =
      activeIndex * tabWidth + (tabWidth - INDICATOR_SIZE) / 2;

    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      damping: 16,
      stiffness: 180,
      mass: 0.8,
    }).start();
  }, [activeIndex, tabWidth, translateX]);

  function handleBarLayout(event: LayoutChangeEvent) {
    setBarWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.floatingContainer,
        { bottom: Math.max(insets.bottom, 10) + -30 }
      ]}
    >
      <View style={styles.bar} onLayout={handleBarLayout}>
        {barWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activeIndicator,
              {
                width: INDICATOR_SIZE,
                height: INDICATOR_SIZE,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {TABS.map((tab) => {
          const isActive = active === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              activeOpacity={0.85}
              onPress={() => setActive(tab.name)}
            >
              <View style={styles.tabContent}>
                <Ionicons
                  name={tab.icon}
                  size={22}
                  color={isActive ? "#342A2A" : "#F7EFDE"}
                />

                <Text
                  numberOfLines={1}
                  style={[styles.label, isActive && styles.labelActive]}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}