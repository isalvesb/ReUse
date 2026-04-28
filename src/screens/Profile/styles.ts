import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "#342A2A",
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 36,
    lineHeight: 38,
    fontFamily: "Inter_500Medium",
    color: "#FFFFFF",
  },

  navTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },

  placeholder: {
    width: 40,
    height: 40,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  card: {
    backgroundColor: "#FFF8EC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8DCC6",
  },

  cardTitle: {
    fontSize: 22,
    fontFamily: "Syne_800ExtraBold",
    color: "#342A2A",
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#342A2A",
    lineHeight: 21,
    marginBottom: 20,
  },

  logoutButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#342A2A",
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },

  logoutButtonDisabled: {
    opacity: 0.7,
  },

  logoutButtonText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },

  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#5C4B4B",
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 22,
    fontFamily: "Syne_800ExtraBold",
    color: "#342A2A",
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#6B5B5B",
  },

  infoBox: {
    backgroundColor: "#F7EFDE",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8DCC6",
    marginBottom: 20,
  },

  infoLabel: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#6B5B5B",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  infoValue: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: "#342A2A",
  },
});

export default styles;
