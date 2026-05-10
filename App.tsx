import React, { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { Syne_400Regular, Syne_800ExtraBold } from "@expo-google-fonts/syne";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { SplashScreen } from "./src/screens/Splash";
import { Login } from "./src/screens/Login";
import { ForgotPass } from "./src/screens/ForgotPass";
import { ResetEmailSent } from "./src/screens/ResetEmailSent";
import { CreateAccount } from "./src/screens/CreateAccount";
import { HomeScreen } from "./src/screens/Home";
import Chats from "./src/screens/Chats";
import { ShowcaseScreen } from "./src/screens/Showcase";
import { PublishScreen } from "./src/screens/Publish";
import TabBar from "./src/components/TabBar";
import { observarUsuarioLogado } from "./src/Services/firebaseAuth";
import { ProfileScreen } from "./src/screens/Profile";
import { ProductScreen } from "./src/screens/Product";
import { DEV_SKIP_AUTH } from "./src/config/devAuth";
import Notifications from "./src/screens/Notifications";
import { EditProfileScreen } from "./src/screens/EditProfile";

type TabName = "home" | "publicar" | "vitrine" | "chats";

type RootStackParamList = {
  Login: undefined;
  ForgotPass: undefined;
  CreateAccount: undefined;
  ResetEmailSent: undefined;

  HomeScreen:
    | {
        screen?: TabName;
        params?: {
          mode?: "edit";
          itemId?: number;
          returnTo?: TabName;
        };
      }
    | undefined;

  Profile: undefined;
  EditProfile: undefined;
  Notifications: undefined;

  Product: {
    itemId: number;
    returnTo?: TabName;
  };

  Chats: { recipientEmail?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


function MainScreen({ route }: any) {
  const [activeTab, setActiveTab] = useState<TabName>("home");
  const [publishParams, setPublishParams] = useState<any>(undefined);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const screen = route?.params?.screen as TabName | undefined;
    const params = route?.params?.params;

    if (!screen) return;

    if (screen === "publicar") {
      setPublishParams(params);
      setActiveTab("publicar");
      return;
    }

    setPublishParams(undefined);
    setActiveTab(screen);
  }, [route?.params]);

  const handleTabPress = (tab: TabName) => {
    setPublishParams(undefined);
    setActiveTab(tab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "publicar":
        return (
          <PublishScreen
            navigation={navigation}
            route={{ params: publishParams }}
          />
        );

      case "vitrine":
        return <ShowcaseScreen />;

      case "chats":
        return <Chats />;

      case "home":
      default:
        return (
          <HomeScreen
            onNavigateToPublish={() => {
              setPublishParams(undefined);
              setActiveTab("publicar");
            }}
            onNavigateToProfile={() => navigation.navigate("Profile")}
            onNavigateToProduct={(itemId) =>
              navigation.navigate("Product", {
                itemId,
                returnTo: "home",
              })
            }
          />
        );
    }
  };

  return (
    <View style={styles.mainScreen}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

function AppNavigator() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(DEV_SKIP_AUTH);

  useEffect(() => {
    if (DEV_SKIP_AUTH) {
      setIsAuthenticated(true);
      setIsCheckingSession(false);
      return;
    }

    const unsubscribe = observarUsuarioLogado((user) => {
      setIsAuthenticated(!!user);
      setIsCheckingSession(false);
    });

    return unsubscribe;
  }, []);

  if (isCheckingSession) {
    return (
      <View style={styles.bootScreen}>
        <ActivityIndicator size="large" color="#342A2A" />
      </View>
    );
  }

  const RenderProfileScreen = () => (
    <ProfileScreen onLogoutComplete={() => setIsAuthenticated(false)} />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <React.Fragment>
            <Stack.Screen name="HomeScreen" component={MainScreen} />
            <Stack.Screen name="Profile" component={RenderProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Product" component={ProductScreen} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Chats" component={Chats} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="ForgotPass" component={ForgotPass} />
            <Stack.Screen name="CreateAccount" component={CreateAccount} />
            <Stack.Screen name="ResetEmailSent" component={ResetEmailSent} />
          </React.Fragment>
        )}
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

  bootScreen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
    alignItems: "center",
    justifyContent: "center",
  },

  mainScreen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },
});
