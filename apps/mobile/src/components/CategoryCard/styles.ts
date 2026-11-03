import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: "100%",
  },

  imageWrapper: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 120,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
});

export default styles;