import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  navBar: {
    backgroundColor: colors.text,
    paddingHorizontal: space.md,
    paddingBottom: 18,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: space.sm,
  },

  backText: {
    color: colors.surface,
    fontSize: tokens.type.body,
    marginLeft: space.sm,
    fontFamily: font.medium,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 26,
  },

  screenTitle: {
    fontSize: tokens.type.title,
    color: colors.text,
    fontFamily: font.bold,
    marginBottom: 20,
  },

  listContent: {
    paddingBottom: space.xxl,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: radius.control,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(52, 42, 42, 0.12)",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: space.md,
  },

  cardContent: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: space.xs,
    gap: space.sm,
  },

  title: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontFamily: font.bold,
  },

  time: {
    color: "rgba(52, 42, 42, 0.65)",
    fontSize: 13,
    fontFamily: font.regular,
  },

  message: {
    color: colors.text,
    fontSize: tokens.type.label,
    lineHeight: 20,
    fontFamily: font.regular,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.xl,
    paddingTop: 120,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontFamily: font.bold,
    marginTop: space.md,
    marginBottom: 6,
  },

  emptyText: {
    color: "rgba(52, 42, 42, 0.7)",
    fontSize: tokens.type.label,
    lineHeight: 20,
    textAlign: "center",
    fontFamily: font.regular,
  },
});

export default styles;
