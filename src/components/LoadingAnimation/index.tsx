import { View } from "react-native";
import LottieView from "lottie-react-native";
import styles from "./styles";

type LoadingAnimationProps = {
  size?: number;
};

export function LoadingAnimation({
  size = 140,
}: LoadingAnimationProps) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../../assets/animations/loading.json")}
        autoPlay
        loop
        style={{
          width: size,
          height: size,
        }}
      />
    </View>
  );
}