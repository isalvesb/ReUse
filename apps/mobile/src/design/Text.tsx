import { Text as NativeText, StyleSheet, TextProps } from "react-native";
import { colors, font, tokens } from "./tokens";
/** Native typography baseline. Screen-specific scale and line height still take precedence. */
export function Text({ style, ...props }: TextProps) {
  return (
    <NativeText
      {...props}
      style={[
        {
          fontFamily: font.regular,
          fontSize: tokens.type.body,
          lineHeight: Math.ceil(
            (StyleSheet.flatten(style)?.fontSize ?? tokens.type.body) * 1.5,
          ),
          color:
            (props.accessibilityRole === "alert" || props.role === "alert") ? colors.error : colors.text,
        },
        style,
      ]}
    />
  );
}
