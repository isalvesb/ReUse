import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import React, { useState } from 'react';

const TABS = [
  { name: "label_1", icon: require("../../../assets/images/selected.png"), label: "Label" },
  { name: "label_2", icon: require("../../../assets/images/icon.png"), label: "Label" },
  { name: "label_3", icon: require("../../../assets/images/icon.png"), label: "Label" },
];

export default function TabBar() {
    const [active, setActive] = React.useState("label_1");

    return (
        <View style={styles.container}>
        {TABS.map((tab) => (
            <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => setActive(tab.name)}
            >
            <Image
                source={tab.icon}
                style={[styles.icon, active === tab.name && styles.activeIcon]}
            />
            <Text>{tab.label}</Text>
            </TouchableOpacity>
        ))}
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3EDF7",
    paddingVertical: 10,
    paddingBottom: 24,
    height: 68,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 11,
    color: "#888",
    fontWeight: "bold",
  },
  labelActive: {
    color: "#333",
    fontWeight: "700",
  },
icon: {
  width: 56,
  height: 36,
  opacity: 0.5,
},
activeIcon: {
  opacity: 1,
},
});