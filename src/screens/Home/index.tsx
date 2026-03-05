import { ScrollView, View, Text, StyleSheet } from "react-native";
import { PromoCard } from "../../components/PromoCard";
import { CategoryCard } from "../../components/CategoryCard";

export function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <View style={styles.promoItem}><PromoCard /></View>
        <View style={styles.promoItem}><PromoCard /></View>
        <View style={styles.promoItem}><PromoCard /></View>
        <View style={styles.promoItem}><PromoCard /></View>
      </ScrollView>

      <Text style={[styles.title, { marginTop:24 }]}>Descubra por categoria</Text>

      <View style={styles.grid}>
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
        <CategoryCard />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  row: { paddingVertical: 6 },
  promoItem: { width: 280, marginRight: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});