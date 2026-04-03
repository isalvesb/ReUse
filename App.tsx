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

  // Aguarda fontes e verificação de login
  if (!fontsLoaded || carregandoLogin) return null;

  // Splash Screen
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
          {logado ? <HomeScreen /> : <Login />}
        </View>

        {logado && <TabBar />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
