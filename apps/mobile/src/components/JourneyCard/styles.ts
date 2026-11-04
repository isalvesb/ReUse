import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  journeyCard: {
    backgroundColor: "#3A2E24",
    margin: space.lg,
    borderRadius: radius.card,
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
    fontSize: tokens.type.body,
    fontFamily: font.bold,
    color: colors.surface,
  },

  journeySubtitle: {
    fontSize: 13,
    fontFamily: font.regular,
    color: "#CFCAC4",
    marginTop: space.xs,
  },

  milestoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: space.xs,
    marginTop: space.xs,
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
    paddingVertical: space.sm,
  },

  milestoneIconDone: {
    backgroundColor: colors.background,
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

    fontFamily: font.regular,
  },

  milestoneLabelInside: {
    fontSize: tokens.type.caption,
    marginTop: space.md,
    textAlign: "center",
    fontFamily: font.regular,
    fontWeight: 400,
    height: 16,
  },

  milestoneLabelInsideDone: {
    color: colors.text,
    fontFamily: "Inter_600SemiBold",
  },

  milestoneLabelInsideLocked: {
    color: "#6E6A66",
  },
});

export default styles;
