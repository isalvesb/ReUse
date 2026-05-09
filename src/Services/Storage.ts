import AsyncStorage from "@react-native-async-storage/async-storage";

export const salvar = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const buscar = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const remover = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const salvarObjeto = async <T>(key: string, value: T) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const buscarObjeto = async <T>(key: string): Promise<T | null> => {
  const value = await AsyncStorage.getItem(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as T;
};

export const limparCache = async (keys: string[]) => {
  await AsyncStorage.multiRemove(keys);
};