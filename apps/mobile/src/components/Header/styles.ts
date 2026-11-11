import { colors, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 36,
    justifyContent: "center",
    position: "relative",
  },

  logoText: {
    textAlign: "center",
    fontFamily: "Syne_800ExtraBold",
    fontSize: 30,
    color: colors.text,
  },

  iconButton: {
    position: "absolute",
    right: 0,
  },

  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },

  iconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.scrim,
    borderRadius: radius.pill,
  },
});

export default styles;
