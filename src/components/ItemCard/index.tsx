import {
  View,
  Text,
  Image,
  Pressable,
  ImageSourcePropType,
} from "react-native";

import styles from "./styles";

type Props = {
  title: string;
  condition: string;
  details: string;
  distance: string;
  transaction: string;
  imageSource?: ImageSourcePropType;
};

export function ItemCard({
  title,
  condition,
  details,
  distance,
  transaction,
  imageSource,
}: Props) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.imageWrap}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.caption}>
          {condition} • {details}
        </Text>
        <Text style={styles.caption}>{distance}</Text>
        <Text style={styles.caption}>{transaction}</Text>
      </View>
    </Pressable>
  );
}
