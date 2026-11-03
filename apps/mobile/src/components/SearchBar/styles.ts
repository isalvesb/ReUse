import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scaleWrapper: {
    width: "100%",
  },

  container: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#342A2A",
    marginLeft: 8,
    paddingVertical: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  icon: {
    marginLeft: 12,
  },
});

export default styles;