import { tokens, colors, font, space, radius } from "../../design/tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: space.lg,
    backgroundColor: colors.text,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  backText: {
    fontSize: tokens.type.body,
    alignItems: "flex-start",
    color: colors.surface,
    marginLeft: 7,

    fontFamily: font.regular,
  },

  headerTitle: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: "medium",
    paddingHorizontal: 35,

    fontFamily: font.regular,
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
    borderRadius: radius.pill,
    borderColor: colors.surface,
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
    borderRadius: radius.pill,
    backgroundColor: colors.text,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  card: {
    backgroundColor: colors.surface,
    padding: 25,
    gap: space.xl,
    borderRadius: 14,
    borderColor: colors.border,
    borderWidth: 1.18,
    marginBottom: space.lg,
  },

  label: {
    fontSize: tokens.type.label,
    color: colors.textMuted,
    marginTop: space.md,

    fontFamily: font.regular,
  },

  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderRadius: radius.input,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: space.xs,
    paddingLeft: space.md,
    paddingRight: space.md,
  },

  input: {
    flex: 1,
    fontSize: tokens.type.body,
    color: colors.text,

    fontFamily: font.regular,
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
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.input,
    fontSize: tokens.type.body,
    paddingVertical: space.sm,
    paddingLeft: space.md,
    paddingRight: 40,
    textAlignVertical: "top",

    fontFamily: font.regular,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 49,
  },

  cancelButton: {
    width: 50,
    height: 48,
    marginRight: space.sm,
    borderRadius: radius.input,
    borderColor: colors.text,
    borderWidth: 1,
    paddingHorizontal: space.md,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButton: {
    width: 50,
    height: 48,
    borderRadius: radius.input,
    backgroundColor: colors.text,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default styles;
