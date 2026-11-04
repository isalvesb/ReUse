import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: 96,
  },

  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
    paddingVertical: 14,
    backgroundColor: colors.text,
  },

  navTitle: {
    fontSize: tokens.type.body,
    fontFamily: font.bold,
    color: colors.surface,
  },

  incentiveCard: {
    backgroundColor: "#2C2416",
    margin: space.lg,
    marginTop: 0,
    borderRadius: radius.card,
    padding: 20,
    alignItems: "center",
  },

  incentiveTitle: {
    fontSize: 18,
    fontFamily: font.bold,
    lineHeight: 26,
    color: colors.surface,
    textAlign: "center",
    marginBottom: space.sm,
    marginTop: space.sm,
  },

  incentiveBody: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 24,
    color: colors.onDarkMuted,
    textAlign: "center",
    marginBottom: space.lg,
  },

  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space.md,
    width: "100%",
    gap: space.md,
  },

  rewardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4A6741",
    alignItems: "center",
    justifyContent: "center",
  },

  rewardText: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 24,
    color: "#DDDDDD",
    flex: 1,
  },

  card: {
    backgroundColor: colors.surface,
    margin: space.lg,
    marginTop: 0,
    borderRadius: radius.card,
    padding: space.lg,
  },

  cardTitle: {
    fontSize: tokens.type.body,
    fontFamily: font.bold,
    lineHeight: 22,
    color: colors.text,
    marginBottom: space.xs,
  },

  cardSubtitle: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 24,
    color: colors.textMuted,
    marginBottom: space.xs,
  },

  photoThumb: {
    width: 80,
    height: 80,
    marginRight: space.sm,
    borderRadius: radius.small,
    overflow: "hidden",
  },

  thumbImg: {
    width: "100%",
    height: "100%",
  },

  coverBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 2,
  },

  coverBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontFamily: font.regular,
    textAlign: "center",
  },

  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: radius.input,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: space.xs,
  },

  addPhotoText: {
    color: colors.textMuted,
    fontSize: tokens.type.caption,
    fontFamily: font.regular,
    lineHeight: 16,
  },

  label: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 38,
    color: colors.text,
    marginBottom: 6,
    marginTop: 14,
  },

  required: {
    color: "#C0392B",
  },

  input: {
    minHeight: tokens.size.control,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 20,
    color: colors.text,
    backgroundColor: colors.surface,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
  },

  inputRowField: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 20,
    color: colors.text,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  inputDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
  },

  inputDropdownField: {
    flex: 1,
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 24,
    color: colors.text,
  },

  inputDropdownIcon: {
    fontSize: tokens.type.body,
    color: colors.textMuted,

    fontFamily: font.regular,
  },

  charCount: {
    fontSize: tokens.type.caption,
    fontFamily: font.regular,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: space.xs,
    textAlign: "right",
  },

  conditionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },

  conditionBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.input,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: "47%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    minHeight: 56,
  },

  conditionBtnActive: {
    borderColor: "#4A6741",
    backgroundColor: "#EAF3DE",
  },

  conditionText: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 20,
    color: "#555555",
    textAlign: "center",
  },

  conditionTextActive: {
    color: "#3B6D11",
  },

  tipBox: {
    marginHorizontal: space.lg,
    marginBottom: space.lg,
    backgroundColor: "#FFFBEB",
    borderColor: "#FEE685",
    borderWidth: 2,
    borderRadius: 12,
    padding: space.md,
  },

  tip: {
    marginHorizontal: space.lg,
    marginBottom: space.lg,
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 24,
    color: "#7B3306",
  },

  tipBold: {
    fontFamily: font.bold,
    color: "#7B3306",
  },

  publishBtn: {
    backgroundColor: colors.text,
    margin: space.lg,
    marginTop: 0,
    borderRadius: 14,
    paddingVertical: space.lg,
    alignItems: "center",
  },

  publishBtnText: {
    color: colors.surface,
    fontFamily: font.bold,
    fontSize: tokens.type.body,
    lineHeight: 22,
  },

  terms: {
    textAlign: "center",
    fontSize: tokens.type.caption,
    fontFamily: font.regular,
    lineHeight: 18,
    color: colors.textMuted,
    marginBottom: space.sm,
  },

  termsLink: {
    color: "#4A6741",
    textDecorationLine: "underline",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: space.lg,
    paddingBottom: 40,
    maxHeight: "70%",
  },

  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: space.md,
    marginBottom: space.lg,
  },

  modalTitle: {
    fontSize: tokens.type.body,
    fontFamily: font.bold,
    lineHeight: 22,
    color: colors.text,
    marginBottom: space.sm,
  },

  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  modalItemActive: {
    backgroundColor: "#F5FBF0",
    marginHorizontal: -16,
    paddingHorizontal: space.lg,
  },

  modalItemText: {
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    lineHeight: 24,
    color: colors.text,
  },

  modalItemTextActive: {
    color: "#4A6741",
    fontFamily: font.bold,
  },

  cameraControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  camBtn: {
    padding: space.md,
  },

  camBtnText: {
    color: colors.surface,
    fontSize: tokens.type.body,
    fontFamily: font.bold,
    lineHeight: 22,
  },

  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },

  title: {
    fontSize: 36,
    fontFamily: font.bold,
    lineHeight: 48,
    color: colors.text,
    textAlign: "center",
  },

  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
  },

  sideBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  controls: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: space.xxl,
  },

pricePrefix: {
  fontSize: tokens.type.label,
  fontFamily: font.regular,
  color: colors.text,
  marginRight: space.xs,
  paddingVertical: space.md,
},

priceInput: {
  flex: 1,
  height: 48,
  fontSize: tokens.type.label,
  fontFamily: font.regular,
  color: colors.text,
  paddingVertical: 0,
  textAlignVertical: "center",
  includeFontPadding: false,
},

typeModalItem: {
  flexDirection: "row",
  alignItems: "center",
  gap: space.md,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#F0F0F0",
},

typeModalItemActive: {
  backgroundColor: "#F5FBF0",
  marginHorizontal: -16,
  paddingHorizontal: space.lg,
},

typeModalBadge: {
  width: 44,
  height: 44,
  borderRadius: 22,
  alignItems: "center",
  justifyContent: "center",
},

typeModalLabel: {
  fontSize: tokens.type.label,
  fontFamily: font.bold,
  lineHeight: 20,
  color: colors.text,
},

typeModalLabelActive: {
  color: "#4A6741",
},

typeModalDesc: {
  fontSize: tokens.type.caption,
  fontFamily: font.regular,
  lineHeight: 18,
  color: colors.textMuted,
  marginTop: 2,
},

});

export default styles;
