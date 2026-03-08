import { View, Text, Image, StyleSheet, Pressable } from "react-native";

const placeholder = require("../../../assets/images/placeholder2.png");
type Props = {
    title: string;
    condition: string;
    details: string;
    distance: string;
}

export function ItemCard({title, condition, details, distance}: Props) {
    return (
        <Pressable style={styles.card}>
        <View style={styles.imageWrap}>
        <Image source={placeholder} style={styles.image} resizeMode="cover" />
        </View>
            <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.caption}>{condition} • {details}</Text>
            <Text style={styles.caption}>{distance}</Text>
            </View>
        </Pressable>
    )
}
const styles = StyleSheet.create({
     card: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        gap: 12,
    },
    imageWrap: {
        width: 170,
        height: 96,
        borderRadius: 10,
        overflow: "hidden",
    },
    image: { width: "100%", height: "100%" },
    info: { flex: 1, justifyContent: "center", gap: 4 },
    title: { fontSize: 16, fontWeight: "bold", color: "#342A2A" },
    caption: { fontSize: 14, color: "#584C4C" },
})