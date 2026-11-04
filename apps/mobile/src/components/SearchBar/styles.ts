import { tokens, colors, font, space } from "../../design/tokens";
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
    fontSize: tokens.type.body,
    fontFamily: font.regular,
    color: colors.text,
    marginLeft: space.sm,
    paddingVertical: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  icon: {
    marginLeft: space.md,
  },
});

export default styles;
