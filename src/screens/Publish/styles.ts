import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
 screen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 96,
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


  journeyCard: {
    backgroundColor: "#2C2416",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },

  journeyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  journeyTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
    color: "#FFFFFF",
  },

  journeySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#888780",
    marginTop: 2,
  },


  milestoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  milestoneItem: {
    alignItems: "center",
    gap: 6,
  },

  milestoneIcon: {
    width: 63,
    height: 94,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  milestoneIconDone: {
    backgroundColor: "#4A6741",
  },

  milestoneIconLocked: {
    backgroundColor: "#3D3020",
    borderWidth: 1.18,
    borderColor: "#FFFFFF20",
    borderStyle: "solid",
  },

  milestoneLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
    color: "#888780",
  },

  milestoneLabelDone: {
    color: "#A8C89A",
  },


  incentiveCard: {
    backgroundColor: "#2C2416",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  incentiveTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    lineHeight: 26,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 8,
  },

  incentiveBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#888780",
    textAlign: "center",
    marginBottom: 16,
  },

  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    gap: 12,
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
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#DDDDDD",
    flex: 1,
  },

 
  card: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
    color: "#342A2A",
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#888780",
    marginBottom: 4,
  },


  photoThumb: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
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
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },

  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 4,
  },

  addPhotoText: {
    color: "#888780",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },


  label: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 38,
    color: "#342A2A",
    marginBottom: 6,
    marginTop: 14,
  },

  required: {
    color: "#C0392B",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#342A2A",
    backgroundColor: "#FAFAFA",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
  },

  inputRowField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#342A2A",
  },

  inputDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  inputDropdownField: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#342A2A",
  },

  inputDropdownIcon: {
    fontSize: 16,
    color: "#888780",
  },

  charCount: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    color: "#888780",
    marginTop: 4,
    textAlign: "right",
  },

  conditionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  conditionBtn: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: "47%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    minHeight: 56
  },

  conditionBtnActive: {
    borderColor: "#4A6741",
    backgroundColor: "#EAF3DE",
  },

  conditionText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    color: "#555555",
    textAlign: "center",
  },

  conditionTextActive: {
    color: "#3B6D11",
  },



  tipBox: {
  marginHorizontal: 16,
  marginBottom: 16,
  backgroundColor: "#FFFBEB",
  borderColor: "#FEE685",
  borderWidth: 2,
  borderRadius: 12,
  padding: 12,
  },

  tip: {
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#7B3306",
  },

  tipBold: {
    fontFamily: "Inter_700Bold",
    color: "#7B3306",
  },

  publishBtn: {
    backgroundColor: "#342A2A",
    margin: 16,
    marginTop: 0,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },

  publishBtnText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    lineHeight: 22,
  },

  terms: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    color: "#888780",
    marginBottom: 8,
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
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
    maxHeight: "70%",
  },

  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
    color: "#342A2A",
    marginBottom: 8,
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
    paddingHorizontal: 16,
  },

  modalItemText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    color: "#342A2A",
  },

  modalItemTextActive: {
    color: "#4A6741",
    fontFamily: "Inter_700Bold",
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
    padding: 12,
  },

  camBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    lineHeight: 22,
  },

  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },

  title: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    lineHeight: 48,
    color: "#342A2A",
    textAlign: "center",
  },

shutterInner: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: "#fff",
},

sideBtn: {
  width: 48,
  height: 48,
  borderRadius: 24,
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
  paddingHorizontal: 32,
},
  
});

export default styles;