import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  journeyCard: {
    backgroundColor: "#3A2E24",
    margin: 16,
    borderRadius: 16,
    padding: 14,
    height: 230,
  },

  journeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  journeyTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },

  journeySubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#CFCAC4",
    marginTop: 4,
  },

  milestoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 4,
    marginTop: 4,
  },

  milestoneItem: {
    alignItems: "center",
    width: 70,
  },

  milestoneIcon: {
    width: 64,
    height: "85%",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },

  milestoneIconDone: {
    backgroundColor: "#F7EFDE",
    borderWidth: 2,
    borderColor: "#FFFFFF20",
  },

  milestoneIconLocked: {
    backgroundColor: "#2F2620",
    borderWidth: 2,
    borderColor: "#FFFFFF20",
  },

  milestoneEmoji: {
    fontSize: 22,
  },

  milestoneLabelInside: {
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontWeight: 400,
    height: 16,
  },

  milestoneLabelInsideDone: {
    color: "#342A2A",
    fontFamily: "Inter_600SemiBold",
  },

  milestoneLabelInsideLocked: {
    color: "#6E6A66",
  },
});

export default styles;