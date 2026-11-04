import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const DARK = colors.text;
const CREAM = colors.background;
const MUTED = colors.textMuted;

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
  backButtonText: { color: colors.surface, fontSize: 15, fontFamily: font.regular },
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
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.scrim,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },

  // Thumbnails
  thumbsScroll: { marginTop: 10 },
  thumbsContent: { paddingHorizontal: space.lg, gap: space.sm },
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
  infoSection: { paddingHorizontal: space.lg, paddingTop: space.lg, paddingBottom: space.sm },
  title: {
    fontSize: 22,
    fontFamily: font.bold,
    color: DARK,
    marginBottom: space.xs,
  },
  condition: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    color: MUTED,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    marginBottom: space.md,
  },
  locationText: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    color: MUTED,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.lg,
  },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.input,
  },
  typeBadgeText: {
    fontSize: 13,
    fontFamily: font.bold,
    color: DARK,
  },
  price: {
    fontSize: 18,
    fontFamily: font.bold,
    color: DARK,
  },
  description: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: space.xl,
  },

  // Card do vendedor
  ownerCard: {
    marginHorizontal: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: space.lg,
    shadowColor: colors.scrim,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: space.lg,
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    marginBottom: 14,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  ownerText: { flex: 1 },
  ownerName: {
    fontSize: tokens.type.body,
    fontFamily: font.bold,
    color: DARK,
    marginBottom: 2,
  },
  ownerMeta: {
    fontSize: 13,
    fontFamily: font.regular,
    color: MUTED,
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    minHeight: tokens.size.control,
    borderRadius: radius.control,
    paddingVertical: space.md,
  },
  chatBtnText: {
    color: colors.text,
    fontSize: 15,
    fontFamily: font.bold,
  },

});

export default s;
