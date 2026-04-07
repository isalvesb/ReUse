import { useRef, useEffect } from "react";
import { Animated, View } from "react-native";
import LottieView from "lottie-react-native";
import styles from "./styles";

type SplashScreenProps = {
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const alreadyFinished = useRef(false);

  const handleAnimationFinish = () => {
    if (alreadyFinished.current) return;
    alreadyFinished.current = true;

    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleAnimationFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={styles.animation}>
        <LottieView
          source={require("../../../assets/animations/splash.json")}
          autoPlay
          loop={false}
          resizeMode="contain"
          style={styles.animation}
          onAnimationFinish={handleAnimationFinish}
        />
      </View>
    </Animated.View>
  );
}