import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TABS = [
  { name: "home", icon: "home-outline", label: "Home" },
  { name: "publicar", icon: "cloud-upload-outline", label: "Publicar" },
  { name: "vitrine", icon: "storefront-outline", label: "Minha Vitrine" },
  { name: "mensagens", icon: "chatbubble-outline", label: "Mensagens" },
];

export default function TabBar() {
  const [active, setActive] = useState("home");

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = active === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => setActive(tab.name)}
          >
            <View style={[styles.tabContent, isActive && styles.activeTab]}>
              <Ionicons
                name={tab.icon}
                size={22}
                color={isActive ? "#342A2A" : "#EADDFF"}
              />

              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#342A2A",
    paddingVertical: 10,
    paddingHorizontal: 24,
    height: 68,
  },

  tab: {
    flex: 1,
    alignItems: "center",
  },

  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeTab: {
    backgroundColor: "#EADDFF",

    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },

    elevation: 4, // Android
  },

  label: {
    fontSize: 11,
    color: "#F7EFED",
    fontWeight: "medium",
  },

  labelActive: {
    color: "#342A2A",
    fontWeight: "medium",
  },
});
