import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen } from "./src/screens/Home/index";
import { View } from "react-native";
import TabBar from "./src/components/TabBar";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <HomeScreen />
        </View>
        <TabBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
