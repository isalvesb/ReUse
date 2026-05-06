import { StyleSheet } from "react-native";

const DARK = "#342A2A";
const CREAM = "#F7EFDE";
const MUTED = "#888780";

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CREAM },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  // Header
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: DARK,
  },
  backButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  backButtonText: { color: "#FFF", fontSize: 15, fontFamily: "Inter_400Regular" },
  placeholder: { width: 32 },

  // Imagem principal
  mainImageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#EEE",
    position: "relative",
  },
  mainImage: { width: "100%", height: "100%" },
  mainImagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEE",
  },
  editBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // Thumbnails
  thumbsScroll: { marginTop: 10 },
  thumbsContent: { paddingHorizontal: 16, gap: 8 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: { borderColor: DARK },
  thumbImage: { width: "100%", height: "100%" },

  // Informações
  infoSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: DARK,
    marginBottom: 4,
  },
  condition: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: MUTED,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: MUTED,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: DARK,
  },
  price: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: DARK,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    color: "#444",
    marginBottom: 24,
  },

  // Card do vendedor
  ownerCard: {
    marginHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#C9A8D4",
  },
  ownerText: { flex: 1 },
  ownerName: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: DARK,
    marginBottom: 2,
  },
  ownerMeta: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: MUTED,
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DARK,
    borderRadius: 12,
    paddingVertical: 14,
  },
  chatBtnText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },

});

export default s;
