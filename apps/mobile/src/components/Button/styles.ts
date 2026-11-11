import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    minHeight: 48,
    paddingLeft: space.lg,
    paddingRight: space.lg,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.input,
    overflow: "hidden",
    position: "relative",
  },

  buttonPressed: {
    transform: [{ scale: 0.97 }],
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrim,
    opacity: 0,
  },

  overlayPressed: {
    opacity: 0.08,
  },

  overlayLongPress: {
    opacity: 0.18,
  },

  text: {
    fontSize: tokens.type.label,
    fontFamily: font.medium,
    color: colors.text,
    zIndex: 1,
  },
});

export default styles;
