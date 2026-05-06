import { StyleSheet } from "react-native";

const DARK = "#342A2A";
const CREAM = "#F7EFDE";
const DARK2 = "#2C2416";
const MUTED = "#888780";
const PURPLE = "#C9A8D4";

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREAM },
  loadingScreen: {
    flex: 1,
    backgroundColor: CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  // Header
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: DARK,
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  placeholder: { width: 60 },

  // Card do usuário
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: DARK2,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    marginBottom: 10,
  },
  userCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: PURPLE,
  },
  userInfo: { gap: 3 },
  userName: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  userLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  userLocation: {
    color: MUTED,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#3D3020",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ratingText: {
    color: "#F5C842",
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },

  // Contadores
  countersRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  counterCard: {
    flex: 1,
    backgroundColor: DARK2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 3,
  },
  counterValue: {
    color: "#FFF",
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  counterLabel: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  // Filtros
  filtersScroll: { marginBottom: 10 },
  filtersContent: { gap: 8, paddingRight: 4 },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0D8D0",
  },
  filterChipActive: {
    backgroundColor: DARK,
    borderColor: DARK,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#555",
  },
  filterChipTextActive: { color: "#FFF" },

  itemCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: MUTED,
    marginBottom: 12,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  gridCell: { width: "47.5%" },
  itemCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemImageBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  itemImagePlaceholder: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEE",
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  itemInfo: { padding: 10, gap: 2 },
  itemTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: DARK,
    lineHeight: 19,
  },
  itemSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: MUTED,
  },
  itemDistance: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: MUTED,
    marginBottom: 6,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: DARK,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: DARK,
  },

  // Empty
  emptyState: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: MUTED,
  },
});