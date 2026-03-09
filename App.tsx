import React from "react";
import { useFonts } from "expo-font";
import { Syne_400Regular, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/Home/index";
import { View, StyleSheet } from "react-native";
import TabBar from "./src/components/TabBar";

export default function App() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <HomeScreen />
        </View>
        <TabBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },
});