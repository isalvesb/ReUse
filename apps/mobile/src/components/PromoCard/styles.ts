import { tokens, colors, font, space } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: 308,
  },

  title: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.text,
  },

  subtitle: {
    marginTop: space.xs,
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    color: colors.textMuted,
    lineHeight: 20,
  },

  imageWrapper: {
    width: "100%",
    height: 156,
    marginTop: space.md,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrim,
    borderRadius: 12,
  },
});

export default styles;
