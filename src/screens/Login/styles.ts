import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#342A2A",
    width: "100%",
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 65,
  },

  logoImage: {
    width: 300,
    height: 40,
    marginBottom: 64,
  },

  socialContainer: {
    gap: 15,
  },

  socialButton: {
    width: 350,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F7EFDE",
    borderRadius: 20,
    paddingVertical: 14,
  },

  socialIcon: {
    color: "#1877f2",
    marginRight: 10,
  },

  socialButtonText: {
    color: "#F7EFDE",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter_600SemiBold",
    margin: 8,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 35,
  },

  line: {
    flex: 1,
    height: 1,
    color: "#F7EFDE",
    marginBottom: 32,
  },

  dividerText: {
    color: "#F7EFDE",
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },

  formContainer: {
    // width: "100%",
  },

  inputLabel: {
    color: "#F7EFDE",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
    marginLeft: 10,
  },

  inputWrapper: {
    width: 350,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3f3f5",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginLeft: 10,
    marginBottom: 25,
  },

  inputIcon: {
    marginRight: 12,
    color: "#342a2a",
  },

  input: {
    flex: 1,
    color: "#342a2a",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },

  eyeIcon: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },

  forgotPasswordText: {
    color: "#F7EFDE",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter_400Regular",
  },

  loginButton: {
    width: 350,
    backgroundColor: "#EBBBEB",
    borderRadius: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  loginButtonText: {
    color: "#342a2a",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  footerText: {
    color: "#F7EFDE",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },

  signUpText: {
    color: "#EBBBEB",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
    marginLeft: 5,
  },
});

export default styles;
