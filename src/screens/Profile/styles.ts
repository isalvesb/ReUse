import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#342A2A",
  },

  backButton: {
    fontSize: 18,
    color: "#fff",
    gap: 7,
  },

  backText: {
    fontSize: 16,
    alignItems: "flex-start",
    color: "#fff",
    marginLeft: 7,
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
    borderColor: "#FFF",
    borderWidth: 3.54,
  },

  name: {
    fontSize: 24,
    color: "#342A2A",
    fontWeight: "bold",
    marginTop: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },

  infoText: {
    fontSize: 16,
    color: "#342A2A",
    gap: 8,
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF66",
    padding: 20,
    borderRadius: 28,
    gap: 12,
    marginTop: 20,
    borderColor: "#ffffff99",
    borderWidth: 1.35,
  },

  statCard: {
    backgroundColor: "#EBBBEB",
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
    marginTop: 4,
  },

  statLabel: {
    fontSize: 10,
    color: "#342A2A",
  },

  icon: {
    color: "#342A2A",
    backgroundColor: "#FFFFFF99",
    borderColor: "#fff",
    padding: 10,
    borderRadius: 50,
  },

  aboutCard: {
    width: "90%",
    backgroundColor: "#F3E8D2",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
  },

  aboutTitle: {
    fontSize: 16,
    color: "#342A2A",
    fontWeight: "bold",
    marginBottom: 8,
  },

  aboutInput: {
    fontSize: 14,
    color: "#3A2D2D",
    minHeight: 80,
    textAlignVertical: "top",
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
    color: "#fff",
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
    backgroundColor: "#342A2A",
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
    borderRadius: 8,
    backgroundColor: "#EBBBEB",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationBadgeText: {
    fontSize: 10,
    color: "#342A2A",
    fontWeight: "700",
  },
});
