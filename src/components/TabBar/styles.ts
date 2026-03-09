import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#342A2A",
    paddingTop: 10,
    paddingHorizontal: 12,
  },

  tab: {
    flex: 1,
    alignItems: "center",
  },

  tabContent: {
    minWidth: 76,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
  },

  activeTab: {
    backgroundColor: "#EADDFF",
  },

  label: {
    marginTop: 4,
    fontSize: 10,
    color: "#F7EFDE",
    fontWeight: "500",
  },

  labelActive: {
    color: "#342A2A",
    fontWeight: "600",
  },
});

export default styles;
