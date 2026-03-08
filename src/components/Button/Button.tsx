import { Pressable, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  style: object;
};

export default function Button({ title, onPress,style }: Props) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#342A2A",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderRadius: 20,
  },

  text: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Roboto",
    justifyContent: "center",
    color: "#fff",
  },
});
