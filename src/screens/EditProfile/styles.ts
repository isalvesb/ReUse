import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  header: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#342A2A",
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  backText: {
    fontSize: 16,
    alignItems: "flex-start",
    color: "#fff",
    marginLeft: 7,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "medium",
    paddingHorizontal: 35,
  },

  content: {
    padding: 25,
    paddingBottom: 40,
  },

  avatarContainer: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  avatar: {
    width: 127,
    height: 127,
    borderRadius: 999,
    borderColor: "#fff",
    borderWidth: 3.54,
    shadowColor: "#0000001A",
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
    elevation: 2,
  },

  cameraButton: {
    width: 35,
    height: 35,
    borderRadius: 999,
    backgroundColor: "#342A2A",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 25,
    gap: 24,
    borderRadius: 14,
    borderColor: "#E5E7EB",
    borderWidth: 1.18,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: "#4A5565",
    marginTop: 12,
  },

  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#F3F3F5",
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#0A0A0A",
  },

  disabledInput: {
    color: "#8C8585",
    opacity: 0.65,
  },

  disabledInputContainer: {
    opacity: 0.7,
  },

  aboutInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F3F5",
    borderRadius: 10,
    fontSize: 16,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 40,
    textAlignVertical: "top",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 49,
  },

  cancelButton: {
    width: 50,
    height: 48,
    marginRight: 8,
    borderRadius: 10,
    borderColor: "#342A2A",
    borderWidth: 1,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    width: 50,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#342A2A",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
