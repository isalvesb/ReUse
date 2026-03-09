import { ScrollView, View, Text } from "react-native";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import CtaCard from "../../components/CtaCard";
import { PromoCard } from "../../components/PromoCard";
import { CategoryCard } from "../../components/CategoryCard";
import { ItemCard } from "../../components/ItemCard";
import styles from "./styles";

const promoCards = [
  {
    id: 1,
    title: "Eletrônicos",
    subtitle: "Usado sim, mas continuam tinindo",
    imageSource: require("../../../assets/images/promo/notebook.jpg"),
  },
  {
    id: 2,
    title: "Peças raras",
    subtitle: "Se apaixone por peças clássicas",
    imageSource: require("../../../assets/images/promo/fotografia.jpg"),
  },
  {
    id: 3,
    title: "Sapatos para todos os gostos",
    subtitle: "Encontre seu par perfeito",
    imageSource: require("../../../assets/images/promo/sapatos.jpg"),
  },
  {
    id: 4,
    title: "Livros para sua biblioteca",
    subtitle: "Aquele livro que falta para a sua coleção",
    imageSource: require("../../../assets/images/promo/livros.jpg"),
  },
  {
    id: 5,
    title: "Para sua casa",
    subtitle: "Decoração com estilo único para você inovar",
    imageSource: require("../../../assets/images/promo/sofa.jpg"),
  },
];

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
            <View
              key={card.id}
              style={[
                styles.promoItem,
                index === promoCards.length - 1 && styles.lastPromoItem,
              ]}
            >
              <PromoCard
                title={card.title}
                subtitle={card.subtitle}
                imageSource={card.imageSource}
                onPress={() => console.log(card.title)}
              />
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
        highlightText="+ 1.240 itens"
        subtitle="ganharam um novo destino este mês. Tem algo parado em casa? Transforme em oportunidade."
        imageSource={require("../../../assets/images/ImpactoColetivo.png")}
        buttonTitle="Publicar item"
        onPress={() => console.log("publique seu item!")}
        variant="compact"
      />
    </ScrollView>
  );
}
