import React from "react";
import { useFonts } from "expo-font";
import { Syne_400Regular, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { HomeScreen } from "./src/screens/Home/index";
import TabBar from "./src/components/TabBar";

export default function App() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#F7EFDE" }}
        edges={["top", "left", "right"]}
      >
        <View style={{ flex: 1, backgroundColor: "#F7EFDE" }}>
          <HomeScreen />
        </View>

        <TabBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}