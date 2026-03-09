import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

const TABS = [
  { name: "home", icon: "home-outline", label: "Home" },
  { name: "publicar", icon: "cloud-upload-outline", label: "Publicar" },
  { name: "vitrine", icon: "storefront-outline", label: "Minha Vitrine" },
  { name: "mensagens", icon: "chatbubble-outline", label: "Mensagens" },
] as const;

export default function TabBar() {
  const [active, setActive] = useState("home");
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 10 }]}>
      {TABS.map((tab) => {
        const isActive = active === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            activeOpacity={0.8}
            onPress={() => setActive(tab.name)}
          >
            <View style={[styles.tabContent, isActive && styles.activeTab]}>
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
  );
}
