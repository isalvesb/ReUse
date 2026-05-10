import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#342A2A",
    marginTop: 64,
    marginHorizontal: 24,
    marginBottom: 24,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  chatCard: {
    flexDirection: "row",
    backgroundColor: "#FFF7E8",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EADDFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarLarge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EADDFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#342A2A",
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
    fontSize: 16,
    fontWeight: "700",
    color: "#342A2A",
  },

  chatTime: {
    fontSize: 12,
    color: "#7D766F",
  },

  productStatus: {
    fontSize: 14,
    color: "#342A2A",
    marginTop: 2,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#342A2A",
    marginTop: 2,
  },

  lastMessage: {
    fontSize: 13,
    color: "#7D766F",
    marginTop: 6,
  },

  detailHeader: {
    paddingTop: 52,
    paddingHorizontal: 24,
    paddingBottom: 14,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backText: {
    fontSize: 16,
    color: "#342A2A",
    marginLeft: 10,
    fontWeight: "500",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailUserName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#342A2A",
  },

  onlineText: {
    fontSize: 13,
    color: "#342A2A",
    marginTop: 2,
  },

  productBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFE3CC",
    paddingHorizontal: 24,
    paddingVertical: 14,
  },

  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#D8C5A5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  messagesContent: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
  },

  messageBubble: {
    maxWidth: "78%",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    marginBottom: 16,
  },

  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#342A2A",
    borderBottomLeftRadius: 6,
  },

  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#F2E6CF",
    borderBottomRightRadius: 6,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },

  otherMessageText: {
    color: "#F7EFDE",
  },

  myMessageText: {
    color: "#342A2A",
  },

  messageTime: {
    fontSize: 11,
    marginTop: 6,
  },

  otherMessageTime: {
    color: "#D8CFC2",
  },

  myMessageTime: {
    color: "#6F675F",
  },

  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: "#F7EFDE",
  },

  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD6C8",
    paddingHorizontal: 18,
    fontSize: 15,
    color: "#342A2A",
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EADDFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});

export default styles;