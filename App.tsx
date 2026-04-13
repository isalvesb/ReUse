import React, { useRef, useState } from "react";
import { useFonts } from "expo-font";
import { Syne_400Regular, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SplashScreen } from "./src/screens/Splash";
import { Login } from "./src/screens/Login";
import { ForgotPass } from "./src/screens/ForgotPass";
import { ResetEmailSent } from "./src/screens/ResetEmailSent";
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
  ResetEmailSent: undefined;
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
        return <HomeScreen onNavigateToPublish={() => setActiveTab("publicar")} />
    }
  }


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
        <Stack.Screen name="ResetEmailSent" component={ResetEmailSent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  Ionicons.loadFont();

  const [fontsLoaded] = useFonts({
    Syne_400Regular,
    Syne_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const [showSplash, setShowSplash] = useState(true);

  const splashOpacity = useRef(new Animated.Value(1)).current;
  const appOpacity = useRef(new Animated.Value(0)).current;

  const handleSplashFinish = () => {
    Animated.parallel([
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(appOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowSplash(false);
      }
    });
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <View style={styles.root}>
        <Animated.View style={[styles.appLayer, { opacity: appOpacity }]}>
          <AppNavigator />
        </Animated.View>

        {showSplash && (
          <Animated.View
            pointerEvents="auto"
            style={[styles.splashLayer, { opacity: splashOpacity }]}
          >
            <SplashScreen onFinish={handleSplashFinish} />
          </Animated.View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  root: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  appLayer: {
    flex: 1,
  },

  splashLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
  },

  mainScreen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },
});
