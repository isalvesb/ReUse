import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
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
  { name: "chats", icon: "chatbubble-outline", label: "Chats" },
] as const;

export type TabName = (typeof TABS)[number]["name"];

type TabBarProps = {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
};

const INDICATOR_SIZE = 58;

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const [barWidth, setBarWidth] = useState(0);

  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(0)).current;

  const scaleValues = useRef(
    TABS.map(() => new Animated.Value(1))
  ).current;

  const overlayValues = useRef(
    TABS.map(() => new Animated.Value(0))
  ).current;

  const activeIndex = TABS.findIndex((tab) => tab.name === activeTab);
  const tabWidth = barWidth > 0 ? barWidth / TABS.length : 0;

  useEffect(() => {
    if (!tabWidth || activeIndex < 0) return;

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

  function animateTab(index: number, toScale: number, toOpacity: number) {
    Animated.parallel([
      Animated.spring(scaleValues[index], {
        toValue: toScale,
        useNativeDriver: true,
        speed: 24,
        bounciness: 0,
      }),
      Animated.timing(overlayValues[index], {
        toValue: toOpacity,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handlePressIn(index: number) {
    animateTab(index, 0.94, 0.12);
  }

  function handleLongPress(index: number) {
    animateTab(index, 0.9, 0.2);
  }

  function handlePressOut(index: number) {
    animateTab(index, 1, 0);
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.floatingContainer,
        { bottom: Math.max(insets.bottom, 10) - 30 },
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

        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.name;

          return (
            <Pressable
              key={tab.name}
              style={styles.tab}
              onPress={() => onTabPress(tab.name)}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              onLongPress={() => handleLongPress(index)}
              delayLongPress={180}
            >
              <Animated.View
                style={[
                  styles.tabInner,
                  {
                    transform: [{ scale: scaleValues[index] }],
                  },
                ]}
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

                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.tabOverlay,
                    isActive
                      ? styles.tabOverlayActive
                      : styles.tabOverlayInactive,
                    { opacity: overlayValues[index] },
                  ]}
                />
              </Animated.View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}