import AsyncStorage from "@react-native-async-storage/async-storage";

export const salvar = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const buscar = async (key: string) => {
  return await AsyncStorage.getItem(key);
};
