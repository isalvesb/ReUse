import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },

  image: {},

  title: {
    fontFamily: "Inter_700Bold",
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
  },

  button: {
    backgroundColor: "#EBBBEB",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    overflow: "hidden",
    position: "relative",
  },

  buttonText: {
    color: "#342A2A",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },

  buttonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    borderRadius: 999,
  },

  heroCard: {
    backgroundColor: "#342A2A",
    minHeight: 360,
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },

  heroContent: {
    width: "54%",
    marginLeft: 15,
    zIndex: 2,
  },

  heroTitle: {
    fontSize: 32,
    lineHeight: 40,
    color: "#F7EFDE",
    marginBottom: 2,
    marginTop: 16,
    fontFamily: "Inter_700Bold",
  },

  heroSubtitle: {
    color: "#F7EFDE",
    fontFamily: "Inter_400Regular",
  },

  heroImage: {
    width: 120,
    height: 120,
    position: "absolute",
    right: 25,
    bottom: 100,
    zIndex: 1,
  },

  heroButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 3,
  },

  compactCard: {
    backgroundColor: "#F7EFDE",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingVertical: 20,
    gap: 16,
  },

  compactContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  compactTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: "#342A2A",
    marginBottom: 12,
    fontFamily: "Inter_700Bold",
  },

  compactSubtitle: {
    color: "#342A2A",
    fontFamily: "Inter_400Regular",
  },

  highlightText: {
    fontSize: 18,
    color: "#342A2A",
    fontFamily: "Inter_700Bold",
  },

  compactImage: {
    width: 150,
    height: 150,
  },

  compactButton: {
    alignSelf: "flex-end",
    marginTop: 24,
  },
});

export default styles;
