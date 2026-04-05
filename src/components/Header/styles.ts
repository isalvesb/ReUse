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

  iconButton: {
    position: "absolute",
    right: 0,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },

  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    borderRadius: 999,
  },
});

export default styles;