import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  sheet: {
    backgroundColor: "#F7EFDE",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    width: "100%",
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE5D4",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  illustrationBox: {
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },

  illustration: {
    width: "100%",
    height: "100%",
  },

  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#342A2A",
    textAlign: "center",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    color: "#342A2A",
    textAlign: "left",
    marginBottom: 16,
    alignSelf: "flex-start",
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
    alignSelf: "stretch",
  },

  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2D4A1E",
    alignItems: "center",
    justifyContent: "center",
  },

  levelEmoji: {
    fontSize: 20,
  },

  levelTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#342A2A",
    lineHeight: 20,
  },

  levelDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#6B5E52",
    lineHeight: 18,
    marginTop: 2,
  },

  ctaBtn: {
    marginTop: 12,
    alignSelf: "center",
  },

  ctaBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#342A2A",
    textDecorationLine: "underline",
  },
});

export default styles;