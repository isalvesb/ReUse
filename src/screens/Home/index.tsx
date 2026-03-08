import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { PromoCard } from "../../components/PromoCard";
import { CategoryCard } from "../../components/CategoryCard";
import Button from "../../components/Button/Button";

export function HomeScreen() {
  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <View style={styles.searchWrap}>
          <SearchBar />
        </View>

        <View style={styles.hero}>
          <Image
            source={require("../../../assets/images/HeroBannerCTA.png")}
            style={styles.heroImage}
          />

          <Button
            title="Publicar item"
            onPress={() => console.log("publique seu item!")}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          <View style={styles.promoItem}>
            <PromoCard />
          </View>
          <View style={styles.promoItem}>
            <PromoCard />
          </View>
          <View style={styles.promoItem}>
            <PromoCard />
          </View>
          <View style={styles.promoItem}>
            <PromoCard />
          </View>
          <View style={styles.promoItem}>
            <PromoCard />
          </View>
        </ScrollView>

        <Text style={[styles.subtitle, { marginTop: 24 }]}>
          Descubra por categoria
        </Text>

        <View style={styles.grid}>
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },

  title: { fontSize: 32, fontWeight: "700", textAlign: "center" },

  subtitle: { fontSize: 20, fontWeight: "700" },

  row: { paddingVertical: 6 },

  promoItem: { width: 280, marginRight: 12 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  searchWrap: { marginVertical: 16 },

  hero: {
    width: "100%",
    height: 350,
    overflow: "hidden",
    borderRadius: 16,
    position: "relative",
  },

  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },

  button: { position: "absolute", bottom: 20, left: 20 },
});
