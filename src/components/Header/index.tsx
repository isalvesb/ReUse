import { View, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
     <View style={{ width: 20 }} />

    <Image source={require('../../../assets/images/ReUse.png')} style={styles.logo} />

    <Image source={require('../../../assets/images/icon.png')} style={styles.icon} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 25,
  },

  logo: {
    height: 36,
    width: 161,
    resizeMode: 'contain',
  },

  icon: {
    width: 36,
    height: 36,
  },

});