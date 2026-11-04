import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginTop: 64,
    marginHorizontal: space.xl,
    marginBottom: space.xl,

    fontFamily: font.bold,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  chatCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.control,
    padding: space.lg,
    marginBottom: 14,
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.md,
  },

  avatarText: {
    fontSize: tokens.type.subtitle,
    fontWeight: "700",
    color: colors.text,

    fontFamily: font.bold,
  },

  chatInfo: {
    flex: 1,
  },

  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  userName: {
    fontSize: tokens.type.body,
    fontWeight: "700",
    color: colors.text,

    fontFamily: font.bold,
  },

  chatTime: {
    fontSize: tokens.type.caption,
    color: colors.textMuted,

    fontFamily: font.regular,
  },

  productStatus: {
    fontSize: tokens.type.label,
    color: colors.text,
    marginTop: 2,

    fontFamily: font.regular,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginTop: 2,

    fontFamily: font.bold,
  },

  lastMessage: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,

    fontFamily: font.regular,
  },

  detailHeader: {
    paddingTop: 52,
    paddingHorizontal: space.xl,
    paddingBottom: 14,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backText: {
    fontSize: tokens.type.body,
    color: colors.text,
    marginLeft: 10,
    fontWeight: "500",

    fontFamily: font.regular,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailUserName: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,

    fontFamily: font.bold,
  },

  onlineText: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,

    fontFamily: font.regular,
  },

  productBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: space.xl,
    paddingVertical: 14,
  },

  productImage: {
    width: 48,
    height: 48,
    borderRadius: radius.small,
    backgroundColor: "#D8C5A5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: space.md,
  },

  messagesContent: {
    paddingHorizontal: space.xl,
    paddingTop: 18,
    paddingBottom: 20,
  },

  messageBubble: {
    maxWidth: "78%",
    borderRadius: 14,
    paddingHorizontal: space.lg,
    paddingTop: 14,
    paddingBottom: 10,
    marginBottom: space.lg,
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    borderBottomLeftRadius: 6,
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.surfaceMuted,
    borderBottomRightRadius: 6,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,

    fontFamily: font.regular,
  },

  otherMessageText: {
    color: colors.background,
  },

  myMessageText: {
    color: colors.text,
  },

  messageTime: {
    fontSize: 11,
    marginTop: 6,

    fontFamily: font.regular,
  },

  otherMessageTime: {
    color: colors.onDarkMuted,
  },

  myMessageTime: {
    color: colors.textMuted,
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.xl,
    paddingTop: 10,
    paddingBottom: space.xl,
    backgroundColor: colors.background,
  },

  input: {
    flex: 1,
    height: 48,
    borderRadius: radius.control,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "#DDD6C8",
    paddingHorizontal: 18,
    fontSize: 15,
    color: colors.text,

    fontFamily: font.regular,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: space.md,
  },
});

export default styles;
