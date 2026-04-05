import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: 308,
  },

  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#342A2A",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#A0947A",
    lineHeight: 20,
  },

  imageWrapper: {
    width: "100%",
    height: 156,
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    borderRadius: 12,
  },
});

export default styles;