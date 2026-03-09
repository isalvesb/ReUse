import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 12,
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
    fontWeight: "bold",
    color: "#342A2A",
  },

  caption: {
    fontSize: 14,
    color: "#584C4C",
  },
});

export default styles;
