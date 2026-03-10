import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#342A2A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 260,
    height: 260,
    marginBottom: 16,
  },

  slogan: {
    fontFamily: "Syne_400Regular",
    fontSize: 32,
    lineHeight: 80,
    color: "#F7EFDE",
    textAlign: "center",
  },
});

export default styles;