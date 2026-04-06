import React, { useState } from "react";
import { useFonts } from "expo-font";
import { Syne_400Regular, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SplashScreen } from "./src/screens/Splash";
import { Login } from "./src/screens/Login";
import { ForgotPass } from "./src/screens/ForgotPass";
import { CreateAccount } from "./src/screens/CreateAccount";
import { HomeScreen } from "./src/screens/Home";
import { ChatsScreen } from "./src/screens/Chats";
import { ShowcaseScreen } from "./src/screens/Showcase";
import { PublishScreen } from "./src/screens/Publish";
import TabBar from "./src/components/TabBar";

type RootStackParamList = {
  Login: undefined;
  ForgotPass: undefined;
  CreateAccount: undefined;
  HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type TabName = "home" | "publicar" | "vitrine" | "chats";

function MainScreen() {
  const [activeTab, setActiveTab] = useState<TabName>("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "publicar":
        return <PublishScreen />;
      case "vitrine":
        return <ShowcaseScreen />;
      case "chats":
        return <ChatsScreen />;
      case "home":
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.mainScreen}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="HomeScreen" component={MainScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const [showSplash, setShowSplash] = useState(true);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <AppNavigator />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  mainScreen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },
});
