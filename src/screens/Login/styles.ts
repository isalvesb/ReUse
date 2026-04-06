import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#342A2A",
    width: "100%",
    paddingHorizontal: 64,
    justifyContent: "center",
  },

  logoImage: {
    width: 300,
    height: 40,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },

  socialContainer: {
    gap: 15,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F7EFDE",
    borderRadius: 20,
    paddingVertical: 12,
  },

  socialIconG: {
    color: "#ea4335",
    marginRight: 8,
  },

  socialIconFb: {
    color: "#1877f2",
    marginRight: 8,
  },

  socialButtonText: {
    color: "#F7EFDE",
    fontSize: 16,
    fontWeight: "medium",
    fontFamily: "Inter",
    paddingHorizontal: 23,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#F7EFDE",
  },

  dividerText: {
    color: "#F7EFDE",
    paddingHorizontal: 10,
    fontSize: 14,
  },

  formContainer: {
    width: "100%",
  },

  inputLabel: {
    color: "#F7EFDE",
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "medium",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7EFDE",
    borderRadius: 20,
    paddingHorizontal: 4,
    height: 55,
    marginBottom: 20,
  },

  inputIcon: {
    marginRight: 10,
    color: "#342a2a",
  },

  input: {
    flex: 1,
    color: "#342a2a",
    fontSize: 16,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },

  forgotPasswordText: {
    color: "#F7EFDE",
    fontSize: 14,
    fontWeight: "medium",
  },

  loginButton: {
    backgroundColor: "#EBBBEB",
    borderRadius: 20,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  loginButtonText: {
    color: "#342a2a",
    fontSize: 16,
    fontWeight: "medium",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },

  footerText: {
    color: "#F7EFDE",
    fontSize: 16,
  },

  signUpText: {
    color: "",
    fontSize: 16,
    fontWeight: "medium",
  },
});

export default styles;
