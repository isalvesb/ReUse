import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  animation: {
    width: width * 2.5,
    height: width * 2.5,
  },
});

export default styles;
