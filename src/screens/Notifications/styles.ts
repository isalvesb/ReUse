import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  navBar: {
    backgroundColor: "#342A2A",
    paddingHorizontal: 12,
    paddingBottom: 18,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 8,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
    fontFamily: "Inter_500Medium",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 26,
  },

  screenTitle: {
    fontSize: 26,
    color: "#342A2A",
    fontFamily: "Inter_700Bold",
    marginBottom: 20,
  },

  listContent: {
    paddingBottom: 32,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF9EC",
    padding: 14,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(52, 42, 42, 0.12)",
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 8,
  },

  title: {
    flex: 1,
    color: "#342A2A",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },

  time: {
    color: "rgba(52, 42, 42, 0.65)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  message: {
    color: "#342A2A",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 120,
  },

  emptyTitle: {
    color: "#342A2A",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginTop: 12,
    marginBottom: 6,
  },

  emptyText: {
    color: "rgba(52, 42, 42, 0.7)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
});

export default styles;