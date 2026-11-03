import "react-native-url-polyfill/auto";
import { fetchWithTimeout } from "./fetchWithTimeout";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { AppState, Platform } from "react-native";
import { createSecureSessionStorage } from "./secureSessionStorage";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (url !== "https://mqvlgrxwuirgjutqltpv.supabase.co" || !key?.startsWith("sb_publishable_")) {
  throw new Error("Configure exclusivamente o projeto Supabase novo do laboratório.");
}
const memory = new Map<string, string>();
const nativeStorage = createSecureSessionStorage({
  getItemAsync: k => SecureStore.getItemAsync(k),
  setItemAsync: (k, v) => SecureStore.setItemAsync(k, v, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
  deleteItemAsync: k => SecureStore.deleteItemAsync(k),
});
// Web preview is intentionally in memory; native installations use SecureStore.
const sessionStorage = Platform.OS === "web" ? {
  getItem: async (k: string) => memory.get(k) ?? null,
  setItem: async (k: string, v: string) => { memory.set(k, v); },
  removeItem: async (k: string) => { memory.delete(k); },
} : nativeStorage;
const sessionKey = "sb-mqvlgrxwuirgjutqltpv-auth-token";
export const supabase = createClient(url, key, { auth: {
  storage: sessionStorage, storageKey: sessionKey,
  persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
}, global: { fetch: fetchWithTimeout } });
const localSignOutListeners = new Set<() => void>();
export function onLocalSignOut(callback: () => void) {
  localSignOutListeners.add(callback);
  return () => { localSignOutListeners.delete(callback); };
}
export async function signOutLocally() {
  supabase.auth.stopAutoRefresh();
  try { await supabase.auth.signOut({ scope: "local" }); }
  finally {
    // Also clear durable storage when the provider is unreachable.
    for (const key of [sessionKey, `${sessionKey}-user`, `${sessionKey}-code-verifier`]) await sessionStorage.removeItem(key);
    for (const listener of localSignOutListeners) listener();
  }
}
if (Platform.OS !== "web") {
  if (AppState.currentState === "active") supabase.auth.startAutoRefresh();
  AppState.addEventListener("change", state => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
// Catalog/statistics have not been integrated in Work 1.3.
export async function fetchStats(_userId: string) { return { trocas: 0, itens: 0, avaliacao: 0 }; }
