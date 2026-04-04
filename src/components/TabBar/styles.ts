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
    backgroundColor: "#342A2A",
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
    backgroundColor: "#EADDFF",
  },

  tab: {
    flex: 1,
    zIndex: 1,
  },

  tabContent: {
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
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