import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: colors.text,
  },

  backButton: {
    fontSize: 18,
    color: colors.surface,
    gap: 7,

    fontFamily: font.regular,
  },

  backText: {
    fontSize: tokens.type.body,
    alignItems: "flex-start",
    color: colors.surface,
    marginLeft: 7,

    fontFamily: font.regular,
  },

  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    position: "relative",
  },

  avatarContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderColor: colors.surface,
    borderWidth: 3.54,
  },

  name: {
    fontSize: 24,
    color: colors.text,
    fontWeight: "bold",
    marginTop: 10,

    fontFamily: font.regular,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    marginTop: space.xs,
  },

  infoText: {
    fontSize: tokens.type.body,
    color: colors.text,
    gap: space.sm,

    fontFamily: font.regular,
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF66",
    padding: 20,
    borderRadius: 28,
    gap: space.md,
    marginTop: 20,
    borderColor: "#ffffff99",
    borderWidth: 1.35,
  },

  statCard: {
    backgroundColor: colors.accent,
    borderColor: "#ffffff99",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    width: 97,
  },

  statCard2: {
    backgroundColor: "#FBCFE8",
    borderColor: "#ffffff99",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    width: 97,
  },

  statCard3: {
    backgroundColor: "#F2D5AB",
    borderColor: "#ffffff99",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    width: 97,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: space.xs,

    fontFamily: font.regular,
  },

  statLabel: {
    fontSize: 10,
    color: colors.text,

    fontFamily: font.regular,
  },

  icon: {
    color: colors.text,
    backgroundColor: "#FFFFFF99",
    borderColor: colors.surface,
    padding: 10,
    borderRadius: 50,
  },

  aboutCard: {
    width: "90%",
    backgroundColor: colors.surfaceMuted,
    padding: space.lg,
    borderRadius: 14,
    marginTop: 20,
  },

  aboutTitle: {
    fontSize: tokens.type.body,
    color: colors.text,
    fontWeight: "bold",
    marginBottom: space.sm,

    fontFamily: font.regular,
  },

  aboutText: {
    fontSize: tokens.type.label,
    color: "#3A2D2D",
    lineHeight: 20,
    minHeight: 40,

    fontFamily: font.regular,
  },

  editButton: {
    backgroundColor: "#3A2D2D",
    padding: 14,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
  },

  editButtonText: {
    color: colors.surface,
    fontWeight: "medium",
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: "#3A2D2D",
    padding: 14,
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },

  logoutButtonText: {
    color: "#3A2D2D",
    fontWeight: "medium",
  },

  loadingContent: {
    alignItems: "center",
    marginTop: 40,
  },

  notificationButton: {
    position: "absolute",
    top: 28,
    right: 34,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -3,
    width: 15,
    height: 15,
    borderRadius: radius.small,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadgeText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: "700",

    fontFamily: font.bold,
  },
});
