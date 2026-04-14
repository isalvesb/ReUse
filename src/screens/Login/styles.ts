import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#342A2A",
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  content: {
    width: "100%",
    maxWidth: 360,
  },

  logoText: {
    fontSize: 56,
    lineHeight: 80,
    textAlign: "center",
    color: "#EBBBEB",
    fontFamily: "Syne_800ExtraBold",
    marginBottom: 44,
    letterSpacing: -2,
  },

  socialContainer: {
    gap: 16,
    marginBottom: 30,
  },

  socialButton: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F7EFDE",
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },

  socialIconWrapper: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  socialButtonText: {
    color: "#F7EFDE",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },

  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#7E6F6F",
  },

  dividerText: {
    color: "#A79797",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginHorizontal: 14,
  },

  formContainer: {
    width: "100%",
  },

  inputLabel: {
    color: "#F7EFDE",
    marginBottom: 10,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },

  inputWrapper: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    color: "#342A2A",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  eyeIcon: {
    marginLeft: 10,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -2,
    marginBottom: 18,
    borderRadius: 12,
  },

  forgotPasswordText: {
    color: "#F7EFDE",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },

  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#EBBBEB",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  loginButtonText: {
    color: "#342A2A",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  footerText: {
    color: "#F7EFDE",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },

  signUpText: {
    color: "#EBBBEB",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  loginButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },

  textButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  iconPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },

  loadingLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },

  loadingBackdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#342A2A",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(247, 239, 222, 0.3)",
    zIndex: 20,
  },
});

export default styles;
