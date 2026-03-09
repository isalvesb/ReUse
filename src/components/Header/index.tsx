import { View, Text, Image } from "react-native";
import styles from "./styles";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>ReUse</Text>

      <Image
        source={require("../../../assets/images/icon.png")}
        style={styles.icon}
      />
    </View>
  );
}
