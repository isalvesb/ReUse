import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#342A2A",
  },

  navTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  feedbackText: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#5C4B4B",
    textAlign: "center",
  },

  emptyTitle: {
    fontSize: 22,
    fontFamily: "Syne_800ExtraBold",
    color: "#342A2A",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: "#5C4B4B",
    textAlign: "center",
    lineHeight: 22,
  },

  listContent: {
    paddingTop: 20,
    paddingBottom: 140,
    paddingHorizontal: 20,
    gap: 14,
  },

  card: {
    backgroundColor: "#FFF8EC",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8DCC6",
  },

  cardTitle: {
    fontSize: 20,
    fontFamily: "Syne_800ExtraBold",
    color: "#342A2A",
    marginBottom: 6,
  },

  cardMeta: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#6B5B5B",
    marginBottom: 10,
  },

  cardDescription: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#342A2A",
    lineHeight: 21,
    marginBottom: 10,
  },

  cardLocation: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#342A2A",
    marginBottom: 6,
  },

  cardUser: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#6B5B5B",
  },
});

export default styles;