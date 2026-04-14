import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
    padding: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "medium",
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
    color: "#342A2A",
  },

  subtitle: {
    fontSize: 16,
    color: "#342A2A",
    marginBottom: 36,
    lineHeight: 28,
  },

  image: {
    width: "100%",
    height: 273,
    resizeMode: "contain",
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#342A2A",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F5",
    borderColor: "#D1D5DC",
    borderWidth: 1.18,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: "#99A1AF",
  },

  button: {
    backgroundColor: "#EBBBEB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#342A2A",
    fontSize: 16,
    fontWeight: "medium",
  },

  backWrap: {
    marginBottom: 16,
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.18,
    borderColor: "#342A2A",
    borderRadius: 14,
    backgroundColor: "#F7EFDE",
  },

  back: {
    fontSize: 16,
    color: "#342A2A",
    fontFamily: "Inter_500Medium",
  },
});
export default styles;
