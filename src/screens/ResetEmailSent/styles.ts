import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
    padding: 20,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 110,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#EBBBEB50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: "medium",
    marginBottom: 12,
    color: "#342A2A",
  },

  subtitle: {
    textAlign: "center",
    color: "#342A2A",
    marginBottom: 24,
    fontSize: 16,
  },

  bold: {
    fontWeight: "700",
    fontSize: 16,
  },

  tipBox: {
    backgroundColor: "#584C4C80",
    padding: 16,
    borderRadius: 18,
    marginBottom: 24,
  },

  tipText: {
    color: "#F7EFDE",
    fontSize: 14,
  },

  button: {
    width: "100%",
    backgroundColor: "#EBBBEB",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },

  buttonText: {
    color: "#342A2A",
    fontWeight: "medium",
    fontSize: 16,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  backText: {
    color: "#342A2A",
    fontSize: 16,
  },
});

export default styles;
