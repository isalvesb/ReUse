import { useState } from "react";
import { Text, View } from "react-native";
import Button from "../../components/Button";
import { LoadingAnimation } from "../../components/LoadingAnimation";
import styles from "./styles";

type ForgotPassProps = {
  navigation: {
    replace: (screen: "HomeScreen") => void;
  };
};

export function ForgotPass({ navigation }: ForgotPassProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigation.replace("HomeScreen");
    }, 1200);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingAnimation size={180} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueceu a senha</Text>

      <View style={styles.buttonsContainer}>
        <Button
          title="Fazer login"
          onPress={handleLogin}
          style={styles.fullButton}
        />
      </View>
    </View>
  );
}