import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Syne_400Regular, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { HomeScreen } from "./src/screens/Home/index";
import { SplashScreen } from "./src/screens/Splash/index";
import TabBar from "./src/components/TabBar";
import { buscarToken } from "./src/Services/Auth";
import { Login } from "./src/screens/Login";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function MainScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F7EFDE" }}>
      <HomeScreen />
      <TabBar />
    </View>
  );
}

function Routes({ initialRoute }: { initialRoute: "Login" | "HomeScreen" }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
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
  const [logado, setLogado] = useState(false);
  const [carregandoLogin, setCarregandoLogin] = useState(true);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const iniciarApp = async () => {
      try {
        const token = await buscarToken();

        if (token) {
          setLogado(true);
        }
      } catch (error) {
        console.log("Erro ao buscar token:", error);
      } finally {
        timeoutId = setTimeout(() => {
          setShowSplash(false);
          setCarregandoLogin(false);
        }, 3000);
      }
    };

    iniciarApp();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!fontsLoaded || carregandoLogin) return null;

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7EFDE" }}>
        <Routes initialRoute={logado ? "HomeScreen" : "Login"} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}