import * as SecureStore from "expo-secure-store";

const USER_TOKEN_KEY = "userToken";

export const salvarToken = async (token: string) => {
  await SecureStore.setItemAsync(USER_TOKEN_KEY, token);
};

export const buscarToken = async () => {
  return await SecureStore.getItemAsync(USER_TOKEN_KEY);
};

export const logout = async () => {
  await SecureStore.deleteItemAsync(USER_TOKEN_KEY);
};