import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    overflow: "hidden",
  },

  image: {},

  title: {
    fontFamily: font.bold,
  },

  subtitle: {
    fontSize: tokens.type.body,
    lineHeight: 24,
    fontFamily: font.regular,
  },

  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 14,
    overflow: "hidden",
    position: "relative",
  },

  buttonText: {
    color: colors.text,
    fontSize: tokens.type.body,
    fontFamily: font.bold,
  },

  buttonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrim,
    borderRadius: radius.pill,
  },

  heroCard: {
    backgroundColor: colors.text,
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
    fontSize: tokens.type.hero,
    lineHeight: 40,
    color: colors.background,
    marginBottom: 2,
    marginTop: space.lg,
    fontFamily: font.bold,
  },

  heroSubtitle: {
    color: colors.background,
    fontFamily: font.regular,
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
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingVertical: 20,
    gap: space.lg,
  },

  compactContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  compactTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: colors.text,
    marginBottom: space.md,
    fontFamily: font.bold,
  },

  compactSubtitle: {
    color: colors.text,
    fontFamily: font.regular,
  },

  highlightText: {
    fontSize: 18,
    color: colors.text,
    fontFamily: font.bold,
  },

  compactImage: {
    width: 150,
    height: 150,
  },

  compactButton: {
    alignSelf: "flex-end",
    marginTop: space.xl,
  },
});

export default styles;
