import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/logotipo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.slogan}>Reutilizar é transformar</Text>
      </View>
    </View>
  );
}