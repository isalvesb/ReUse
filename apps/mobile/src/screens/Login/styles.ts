import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
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
    color: colors.accent,
    fontFamily: "Syne_800ExtraBold",
    marginBottom: 44,
    letterSpacing: -2,
  },

  socialContainer: {
    gap: space.lg,
    marginBottom: 30,
  },

  socialButton: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.input,
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
    color: colors.background,
    fontSize: tokens.type.body,
    fontFamily: font.medium,
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
    color: colors.onDarkMuted,
    fontSize: tokens.type.label,
    fontFamily: font.regular,
    marginHorizontal: 14,
  },

  formContainer: {
    width: "100%",
  },

  inputLabel: {
    color: colors.background,
    marginBottom: 10,
    fontSize: tokens.type.label,
    fontFamily: font.medium,
  },

  inputWrapper: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    paddingHorizontal: space.lg,
    marginBottom: 18,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    color: colors.text,
    fontSize: tokens.type.body,
    fontFamily: font.regular,
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
    color: colors.background,
    fontSize: tokens.type.label,
    fontFamily: font.regular,
  },

  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: colors.accent,
    borderRadius: radius.input,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  loginButtonText: {
    color: colors.text,
    fontSize: tokens.type.body,
    fontFamily: font.medium,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  footerText: {
    color: colors.background,
    fontSize: tokens.type.body,
    fontFamily: font.regular,
  },

  signUpText: {
    color: colors.accent,
    fontSize: tokens.type.body,
    fontFamily: font.medium,
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
    backgroundColor: colors.text,
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
