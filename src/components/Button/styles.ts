import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#342A2A",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    opacity: 0,
  },

  overlayPressed: {
    opacity: 0.08,
  },

  overlayLongPress: {
    opacity: 0.18,
  },

  text: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#FFFFFF",
    zIndex: 1,
  },
});

export default styles;