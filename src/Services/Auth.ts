import * as SecureStore from "expo-secure-store";

export const salvarToken = async (token: string) => {
  await SecureStore.setItem("userToken", token);
};

export const buscarToken = async () => {
  return await SecureStore.getItemAsync("userToken");
};

export const logout = async () => {
  await SecureStore.deleteItemAsync("userToken");
};
