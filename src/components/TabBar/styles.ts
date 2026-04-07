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
    backgroundColor: "hsla(0, 11%, 18%, 0.9)",
    borderRadius: 999,
    paddingVertical: 12,
    minHeight: 80,

    shadowColor: "#000",
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
    top: 10,
    left: 0,
    borderRadius: 999,
    backgroundColor: "hsla(263, 100%, 93%, 0.9)",
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
    width: 58,
    height: 58,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    zIndex: 1,
  },

  tabOverlay: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 999,
    alignSelf: "center",
  },

  tabOverlayActive: {
    backgroundColor: "#000",
  },

  tabOverlayInactive: {
    backgroundColor: "#F7EFDE",
  },

  label: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    color: "#F7EFDE",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },

  labelActive: {
    color: "#342A2A",
  },
});

export default styles;