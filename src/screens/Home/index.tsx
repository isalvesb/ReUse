import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import { PromoCard } from "../../components/PromoCard";
import { CategoryCard } from "../../components/CategoryCard";
import Button from "../../components/Button/Button";
import { ItemCard } from "../../components/ItemCard";

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
            style={styles.button}
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

      <View>
      <Text style={styles.subtitle}>
        Perto de você
      </Text>
      <Text style={styles.caption}>Itens disponíveis na sua região</Text>
      </View>

      <View style={styles.itemCard}>
        <ItemCard title="Cadeira de madeira" condition="Usado" details="Bom estado" distance="1 km de você" />
        <ItemCard title="Jaqueta de couro" condition="Usado" details="Tam 40" distance="1,4km de você" />
        <ItemCard title="Teclado gamer" condition="Usado" details="Bom estado" distance="2 km de você" />
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
    borderRadius: 16,
    position: "relative",
  },

  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  itemCard: { marginBottom: 16, fontSize: 14, color: "#584C4C", gap:12},
  caption: {fontSize: 16, color: "#584C4C", fontWeight: "medium" },
  button: { position: "absolute", bottom: 20, right: 20 },
});
