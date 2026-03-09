import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },

  image: {},

  title: {
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#EADDFF",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  buttonText: {
    color: "#342A2A",
    fontSize: 16,
    fontWeight: "600",
  },

  heroCard: {
    backgroundColor: "#342A2A",
    minHeight: 360,
    padding: 20,
    position: "relative",
  },

  heroContent: {
    maxWidth: "60%",
    left: 15,
  },

  heroTitle: {
    fontSize: 32,
    lineHeight: 40,
    color: "#F7EFDE",
    marginBottom: 2,
    marginTop: 16,
  },

  heroSubtitle: {
    color: "#F7EFDE",
  },

  heroImage: {
    width: 140,
    height: 140,
    position: "absolute",
    right: 40,
    bottom: 90,
  },

  heroButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
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
  },

  compactSubtitle: {
    color: "#342A2A",
  },

  highlightText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#342A2A",
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
