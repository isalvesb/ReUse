import { View, Text, Image, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 25,
    minHeight: 36,
  },

  logoText: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "Syne_800ExtraBold",
    fontSize: 30,
    color: "#342A2A",
  },

  icon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
});