import { View } from "react-native";
import LottieView from "lottie-react-native";
import styles from "./styles";

type LoadingAnimationProps = {
  size?: number;
  loop?: boolean;
  speed?: number;
  onFinish?: () => void;
};

export function LoadingAnimation({
  size = 140,
  loop = false,
  speed = 1.5,
  onFinish,
}: LoadingAnimationProps) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../../assets/animations/loading.json")}
        autoPlay
        loop={loop}
        speed={speed}
        onAnimationFinish={onFinish}
        style={{
          width: size,
          height: size,
        }}
      />
    </View>
  );
}