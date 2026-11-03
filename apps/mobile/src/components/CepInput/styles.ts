import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  label: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#342A2A",
  },

  inputWrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#D8CEC0",
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFDF8",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#342A2A",
  },

  error: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#B3261E",
  },
});

export default styles;