import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYrj_aLL_JWPmIIPNTY4CemrdoECeWd64",
  authDomain: "reuse-5630.firebaseapp.com",
  projectId: "reuse-5630",
  storageBucket: "reuse-5630.firebasestorage.app",
  messagingSenderId: "214549799877",
  appId: "1:214549799877:web:291ca3596c16a2af36a1ac",
  measurementId: "G-W83HS2EGDX"
};

const app = initializeApp(firebaseConfig);

// Inicialização com persistência para evitar erros no emulador
// @ts-ignore
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
