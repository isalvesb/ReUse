import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 32,
    fontFamily: "Syne_800ExtraBold",
    color: "#342A2A",
    marginBottom: 32,
    textAlign: "center",
  },

  buttonsContainer: {
    width: "100%",
    gap: 12,
  },

  fullButton: {
    width: "100%",
  },
});

export default styles;