import { StyleSheet } from "react-native";

const BG_CREAM      = "#EDE5D8";
const BLOCK_DARK    = "#2B2118";
const COUNTER_DOAC  = "#FFD1FF20";
const COUNTER_TROC  = "#E0C3FC20";
const COUNTER_VEND  = "#FFE4A120";
const RATING_BG     = "#3D2F1A";
const RATING_STAR   = "#F5C518";
const MUTED         = "#9A9186";
const PURPLE_AVATAR = "#C9A8D4";
const WHITE         = "#FFFFFF";

export default StyleSheet.create({

  screen: { flex: 1, backgroundColor: BG_CREAM },
  loadingScreen: {
    flex: 1,
    backgroundColor: BG_CREAM,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 120,
  },

  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: BLOCK_DARK,
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    color: WHITE,
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backButtonText: {
    color: WHITE,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  placeholder: { width: 60 },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: BLOCK_DARK,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 18,
  },
  userCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  userAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    borderColor: PURPLE_AVATAR,
    backgroundColor: "#6B5B7B",
  },
  userInfo: { gap: 4 },
  userName: {
    color: WHITE,
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  userLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userLocation: {
    color: MUTED,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: RATING_BG,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  ratingText: {
    color: RATING_STAR,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },

  countersRow: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: BLOCK_DARK,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 0,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    marginBottom: 16,
  },
  counterCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },

  counterCardDoacao: { 
    backgroundColor: COUNTER_DOAC,
    borderColor: "#FFD1FF30", 
  },

  counterCardTroca:  { 
    backgroundColor: COUNTER_TROC,
    borderColor: "#E0C3FC30",
  },

  counterCardVenda:  { 
    backgroundColor: COUNTER_VEND,
    borderColor: "#FFE4A130",
  },

  counterValue: {
    color: WHITE,
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  counterLabel: {
    color: "rgba(255,255,255,0.60)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },

  // ── Filter chips ──────────────────────────────────────────────────────────
  filtersScroll: { marginBottom: 4 },
  filtersContent: {
    gap: 8,
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: "#DDD5C8",
  },
  filterChipActive: {
    backgroundColor: "#1E1812",
    borderColor: "#1E1812",
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#555",
  },
  filterChipTextActive: { color: WHITE },

  // ── Contador de itens ─────────────────────────────────────────────────────
  itemCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: MUTED,
    marginTop: 14,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  gridCell: { width: "47%" },

  itemCard: {
    backgroundColor: WHITE,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  itemImageBox: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#E5DDD4",
    overflow: "hidden",
  },
  itemImagePlaceholder: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5DDD4",
  },
  itemImage: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  itemInfo: { padding: 12, gap: 2 },
  itemTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#1E1812",
    lineHeight: 21,
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
    marginBottom: 10,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#1E1812",
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#1E1812",
  },

  emptyState: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: MUTED,
  },
});