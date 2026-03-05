import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/Home/index";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <HomeScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
