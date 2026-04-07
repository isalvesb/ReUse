import { useRef, useEffect } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import styles from "./styles";

type SplashScreenProps = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const alreadyFinished = useRef(false);

  const finishSplash = () => {
    if (alreadyFinished.current) return;
    alreadyFinished.current = true;
    onFinish();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      finishSplash();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animation}>
        <LottieView
          source={require("../../../assets/animations/splash.json")}
          autoPlay
          loop={false}
          resizeMode="contain"
          style={styles.animation}
          onAnimationFinish={() => {
            setTimeout(() => {
              finishSplash();
            }, 300);
          }}
        />
      </View>
    </View>
  );
}