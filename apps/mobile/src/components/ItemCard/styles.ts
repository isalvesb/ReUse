import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  imageWrap: {
    width: 170,
    height: 96,
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  info: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  title: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#342A2A",
  },

  caption: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#A0947A",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    borderRadius: 12,
  },
});

export default styles;