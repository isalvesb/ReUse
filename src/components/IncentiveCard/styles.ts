import { StyleSheet } from "react-native";

const styles = StyleSheet.create ({
incentiveCard: {
    backgroundColor: "#2C2416",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
sparkleCircle: {
  width: 47,
  height: 47,
  borderRadius: 32,
  backgroundColor: "#F7EFDE",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 8,
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
    color: "#FFFFFF",
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
    width: 32,
    height: 32,
    borderRadius: 64,
    backgroundColor: "#FFFFFF",
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
 
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#2C2416",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  closeBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#3D3020",
    borderRadius: 20,
    padding: 6,
    marginBottom: 12,
  },
  publishBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBBBEB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
  publishBtnText: {
    color: "#342A2A",
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    lineHeight: 22,
  },
  skipText: {
    marginTop: 14,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#888780",
    textDecorationLine: "underline",
  },
}
)

export default styles;
