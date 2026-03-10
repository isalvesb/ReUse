import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 36,
    justifyContent: "center",
    position: "relative",
  },

  logoText: {
    textAlign: "center",
    fontFamily: "Syne_800ExtraBold",
    fontSize: 30,
    color: "#342A2A",
  },

  icon: {
    position: "absolute",
    right: 0,
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
});

export default styles;