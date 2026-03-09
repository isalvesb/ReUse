import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function Button({
  title,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#EADDFF",
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: "#342A2A",
    fontSize: 16,
    fontWeight: "600",
  },
});