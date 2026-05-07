import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "",
    padding: 12,
    borderRadius: 24,
    marginBottom: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 24,
    marginRight: 12,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  time: {
    color: "#000",
    fontSize: 14,
  },

  message: {
    color: "#000",
    fontSize: 14,
  },
});

export default styles;
