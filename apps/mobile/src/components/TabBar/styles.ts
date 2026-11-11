import { colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    left: 16,
    right: 16,
  },

  bar: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.navigation,
    borderRadius: radius.pill,
    paddingVertical: space.md,
    minHeight: 80,

    shadowColor: colors.scrim,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 10,
  },

  activeIndicator: {
    position: "absolute",
    top: 7,
    left: 0,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  tab: {
    flex: 1,
    zIndex: 1,
  },

  tabInner: {
    height: 58,
    marginHorizontal: 2,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },

  tabContent: {
    width: 62,
    height: 62,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.xs,
    zIndex: 1,
  },

  tabOverlay: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    alignSelf: "center",
  },

  tabOverlayActive: {
    backgroundColor: colors.scrim,
  },

  tabOverlayInactive: {
    backgroundColor: colors.background,
  },

  label: {
    marginTop: space.xs,
    fontSize: 11,
    lineHeight: 14,
    color: colors.background,
    fontFamily: font.medium,
    textAlign: "center",
  },

  labelActive: {
    color: colors.text,
  },
});

export default styles;
