import { ScrollView, View, Text, StyleSheet } from "react-native";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import CtaCard from "../../components/CtaCard";
import { PromoCard } from "../../components/PromoCard";
import { CategoryCard } from "../../components/CategoryCard";
import { ItemCard } from "../../components/ItemCard";

const promoCards = [1, 2, 3, 4, 5];

export function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Header />

      <View style={styles.searchWrap}>
        <SearchBar />
      </View>

      <View style={styles.heroSection}>
        <CtaCard
          title={"Dê um novo\npropósito"}
          subtitle="ao que você não usa mais"
          imageSource={require("../../../assets/images/HeroBannerCTA.png")}
          buttonTitle="Publicar item"
          onPress={() => console.log("publique seu item!")}
          variant="hero"
        />
      </View>

      <View style={styles.promoSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promoRow}
        >
          {promoCards.map((card, index) => (
            <View key={card} style={styles.promoItem}>
              <PromoCard />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Descubra por categoria</Text>

        <View style={styles.grid}>
          <CategoryCard
            imageSource={require("../../../assets/images/categorias/roupas.jpg")}
          />
          <CategoryCard
            imageSource={require("../../../assets/images/categorias/oculos.jpg")}
          />
          <CategoryCard
            imageSource={require("../../../assets/images/categorias/luminaria.jpg")}
          />
          <CategoryCard
            imageSource={require("../../../assets/images/categorias/infantil.jpg")}
          />
        </View>
      </View>

      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>Perto de você</Text>
        <Text style={styles.caption}>Itens disponíveis na sua região</Text>

        <View style={styles.itemList}>
          <ItemCard
            title="Cadeira de madeira"
            condition="Usado"
            details="Bom estado"
            distance="1 km de você"
            transaction="Doação"
            imageSource={require("../../../assets/images/itens/cadeira.jpg")}
          />

          <ItemCard
            title="Jaqueta de couro"
            condition="Usado"
            details="Tam 40"
            distance="1,4 km de você"
            transaction="Troca"
            imageSource={require("../../../assets/images/itens/jaqueta.jpg")}
          />

          <ItemCard
            title="Teclado gamer"
            condition="Usado"
            details="Bom estado"
            distance="2 km de você"
            transaction="Venda"
            imageSource={require("../../../assets/images/itens/teclado.jpg")}
          />
        </View>
      </View>

      <CtaCard
        title="Impacto coletivo"
        subtitle="+ 1.240 itens ganharam um novo destino este mês. Tem algo parado em casa? Transforme em oportunidade."
        imageSource={require("../../../assets/images/ImpactoColetivo.png")}
        buttonTitle="Publicar item"
        onPress={() => console.log("publique seu item!")}
        variant="compact"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7EFDE",
  },

  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },

  searchWrap: {
    marginTop: 24,
    marginBottom: 24,
  },

  heroSection: {
    marginBottom: 48,
  },

  promoSection: {
    marginBottom: 48,
    marginRight: -24,
  },

  promoRow: {
    paddingRight: 0,
  },

  promoItem: {
    width: 280,
    marginRight: 24,
  },

  lastPromoItem: {
    marginRight: 0,
  },

  categorySection: {
    marginBottom: 48,
  },

  itemsSection: {
    marginBottom: 48,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#342A2A",
    marginBottom: 8,
  },

  caption: {
    fontSize: 16,
    color: "#584C4C",
    marginBottom: 16,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  itemList: {
    gap: 24,
  },
});
