import { StyleSheet } from "react-native";

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

export default styles;
