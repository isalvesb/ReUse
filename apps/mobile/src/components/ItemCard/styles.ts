import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    backgroundColor: colors.surface,
    marginBottom: space.md,
    borderRadius: radius.card,
    overflow: "hidden",
    position: "relative",
  },

  imageWrap: {
    width: 112,
    height: 112,
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  info: {
    flex: 1,
    justifyContent: "center",
    gap: space.xs,
  },

  title: {
    fontSize: tokens.type.body,
    fontFamily: font.bold,
    color: colors.text,
  },

  caption: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    color: colors.textMuted,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrim,
    borderRadius: radius.card,
  },
});

export default styles;
