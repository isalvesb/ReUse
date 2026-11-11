import { useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import styles from "./styles";

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
  const [isLongPress, setIsLongPress] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsLongPress(false)}
      onLongPress={() => setIsLongPress(true)}
      onPressOut={() => setIsLongPress(false)}
      delayLongPress={250}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          <View
            pointerEvents="none"
            style={[
              styles.overlay,
              pressed && styles.overlayPressed,
              isLongPress && styles.overlayLongPress,
            ]}
          />

          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}