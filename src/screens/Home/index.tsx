import { ScrollView, View, Text, StyleSheet } from "react-native";
import { CategoryCard } from "../../components/CategoryCard";

export function HomeScreen() {
  const categories = ["c1", "c2", "c3", "c4"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Descubra por categoria</Text>

      <View style={styles.grid}>
        {categories.map((id) => (
          <CategoryCard key={id} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});