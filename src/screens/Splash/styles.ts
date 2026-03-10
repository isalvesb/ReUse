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
    width: 280,
    height: 40,
    marginBottom: 4,
  },

  slogan: {
    fontFamily: "Syne_400Regular",
    fontSize: 18,
    lineHeight: 18,
    color: "#F7EFDE",
    textAlign: "center",
  },
});

export default styles;