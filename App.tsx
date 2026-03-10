import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Syne_400Regular, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { HomeScreen } from "./src/screens/Home/index";
import { SplashScreen } from "./src/screens/Splash/index";
import TabBar from "./src/components/TabBar";

export default function App() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_800ExtraBold,
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#342A2A" }}>
          <SplashScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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