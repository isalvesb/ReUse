import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7EFDE",
    padding: 24,
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 87,
    marginBottom: 70,
  },

  logoImage: {
    width: 263,
    height: 36,
  },

  title: {
    fontSize: 24,
    fontFamily: "Inter_500Medium",
    color: "#342A2A",
    textAlign: "center",
    marginBottom: 24,
  },

  socialContainer: {
    gap: 12,
    marginBottom: 48,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.18,
    borderColor: "#342A2A",
    borderRadius: 14,
    paddingVertical: 12,
  },

  socialButtonText: {
    color: "#342A2A",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    marginLeft: 12,
  },

  dividirContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 48,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#342A2A",
  },

  dividerText: {
    color: "#342A2A",
    paddingHorizontal: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    color: "#342A2A",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F5",
    borderRadius: 14,
    borderWidth: 1.18,
    borderColor: "#342A2A",
    paddingHorizontal: 15,
    height: 48,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    color: "#342A2A",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    gap: 18,
  },

  createButton: {
    backgroundColor: "#342A2A",
    borderRadius: 20,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 60,
  },

  createButtonText: {
    color: "#FFF",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
});

export default styles;
