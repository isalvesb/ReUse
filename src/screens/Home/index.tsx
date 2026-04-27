import React, { useEffect, useRef, useState, useCallback } from "react";
import { Animated, Dimensions, ScrollView, View, Text } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import CtaCard from "../../components/CtaCard";
import { PromoCard } from "../../components/PromoCard";
import { CategoryCard } from "../../components/CategoryCard";
import { ItemCard } from "../../components/ItemCard";
import { IncentiveModal } from "../../components/IncentiveCard";
import { salvar, buscar } from "../../Services/Storage";
import { buscarToken } from "../../Services/Auth";
import styles from "./styles";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const SCREEN_HEIGHT = Dimensions.get("window").height;

type RevealOnScrollProps = {
  children: React.ReactNode;
  scrollY: Animated.Value;
  delay?: number;
  offset?: number;
  animateOnMount?: boolean;
};

function RevealOnScroll({
  children,
  scrollY,
  delay = 0,
  offset = 280,
  animateOnMount = false,
}: RevealOnScrollProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(70)).current;
  const scale = useRef(new Animated.Value(0.94)).current;

  const hasAnimated = useRef(false);
  const layoutY = useRef(0);

  const startAnimation = () => {
    if (hasAnimated.current) return;

    hasAnimated.current = true;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 520,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const maybeAnimate = (scrollValue: number) => {
    const triggerPoint = scrollValue + SCREEN_HEIGHT - offset;

    if (triggerPoint >= layoutY.current) {
      startAnimation();
    }
  };

  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      maybeAnimate(value);
    });

    return () => {
      scrollY.removeListener(id);
    };
  }, [scrollY]);

  useEffect(() => {
    if (!animateOnMount) return;

    const timer = setTimeout(() => {
      startAnimation();
    }, delay);

    return () => clearTimeout(timer);
  }, [animateOnMount, delay]);

  return (
    <Animated.View
      onLayout={(event) => {
        layoutY.current = event.nativeEvent.layout.y;

        if (!animateOnMount) {
          maybeAnimate(0);
        }
      }}
      style={{
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    >
      {children}
    </Animated.View>
  );
}

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

interface HomeScreenProps {
  onNavigateToPublish?: () => void;
  onNavigateToProfile?: () => void;
}

export function HomeScreen({
  onNavigateToPublish,
  onNavigateToProfile,
}: HomeScreenProps) {
  const [showIncentive, setShowIncentive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let timer: ReturnType<typeof setTimeout>;

      const verificar = async () => {
        const emailUsuario = await buscarToken();
        if (!emailUsuario) return;

        const jaViu = await buscar(`incentive_seen:${emailUsuario}`);
        if (jaViu !== "true") {
          timer = setTimeout(() => setShowIncentive(true), 2000);
        }
      };

      verificar();

      return () => clearTimeout(timer);
    }, []),
  );

  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [categoriesSectionY, setCategoriesSectionY] = useState(0);

  const categoryAnim1 = useRef(new Animated.Value(0)).current;
  const categoryAnim2 = useRef(new Animated.Value(0)).current;
  const categoryAnim3 = useRef(new Animated.Value(0)).current;
  const categoryAnim4 = useRef(new Animated.Value(0)).current;

  const [itemsVisible, setItemsVisible] = useState(false);
  const [itemsSectionY, setItemsSectionY] = useState(0);

  const itemAnim1 = useRef(new Animated.Value(0)).current;
  const itemAnim2 = useRef(new Animated.Value(0)).current;
  const itemAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      if (itemsVisible || !itemsSectionY) return;

      const triggerPoint = value + SCREEN_HEIGHT - 140;

      if (triggerPoint >= itemsSectionY) {
        setItemsVisible(true);
      }
    });

    return () => {
      scrollY.removeListener(id);
    };
  }, [scrollY, itemsSectionY, itemsVisible]);

  useEffect(() => {
    if (!itemsVisible) return;

    Animated.stagger(180, [
      Animated.timing(itemAnim1, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(itemAnim2, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
      Animated.timing(itemAnim3, {
        toValue: 1,
        duration: 520,
        useNativeDriver: true,
      }),
    ]).start();
  }, [itemsVisible]);

  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      if (categoriesVisible || !categoriesSectionY) return;

      const triggerPoint = value + SCREEN_HEIGHT - 140;

      if (triggerPoint >= categoriesSectionY) {
        setCategoriesVisible(true);
      }
    });

    return () => {
      scrollY.removeListener(id);
    };
  }, [scrollY, categoriesSectionY, categoriesVisible]);

  useEffect(() => {
    if (!categoriesVisible) return;

    Animated.stagger(140, [
      Animated.timing(categoryAnim1, {
        toValue: 1,
        duration: 460,
        useNativeDriver: true,
      }),
      Animated.timing(categoryAnim2, {
        toValue: 1,
        duration: 460,
        useNativeDriver: true,
      }),
      Animated.timing(categoryAnim3, {
        toValue: 1,
        duration: 460,
        useNativeDriver: true,
      }),
      Animated.timing(categoryAnim4, {
        toValue: 1,
        duration: 460,
        useNativeDriver: true,
      }),
    ]).start();
  }, [categoriesVisible]);

  const getItemAnimatedStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [90, 0],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.92, 1],
        }),
      },
    ],
  });

  const getCategoryAnimatedStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [70, 0],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1],
        }),
      },
    ],
  });

  return (
    <>
      <AnimatedScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <Header onProfilePress={onNavigateToProfile} />
        <RevealOnScroll scrollY={scrollY}>
          <View style={styles.searchWrap}>
            <SearchBar />
          </View>
        </RevealOnScroll>

        <RevealOnScroll scrollY={scrollY} delay={40}>
          <View style={styles.heroSection}>
            <CtaCard
              title={"Dê um novo\npropósito"}
              subtitle="ao que você não usa mais"
              imageSource={require("../../../assets/images/cta/HeroBannerCTA.png")}
              buttonTitle="Publicar item"
              onPress={() => onNavigateToPublish?.()}
              variant="hero"
            />
          </View>
        </RevealOnScroll>

        <RevealOnScroll scrollY={scrollY} delay={120} animateOnMount>
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
        </RevealOnScroll>

        <View
          style={styles.categorySection}
          onLayout={(event) => {
            setCategoriesSectionY(event.nativeEvent.layout.y);
          }}
        >
          <RevealOnScroll scrollY={scrollY} offset={120}>
            <Text style={styles.sectionTitle}>Descubra por categoria</Text>
          </RevealOnScroll>

          <View style={styles.grid}>
            <Animated.View
              style={[
                styles.categoryAnimatedItem,
                getCategoryAnimatedStyle(categoryAnim1),
              ]}
            >
              <CategoryCard
                imageSource={require("../../../assets/images/categorias/roupas.jpg")}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.categoryAnimatedItem,
                getCategoryAnimatedStyle(categoryAnim2),
              ]}
            >
              <CategoryCard
                imageSource={require("../../../assets/images/categorias/oculos.jpg")}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.categoryAnimatedItem,
                getCategoryAnimatedStyle(categoryAnim3),
              ]}
            >
              <CategoryCard
                imageSource={require("../../../assets/images/categorias/luminaria.jpg")}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.categoryAnimatedItem,
                getCategoryAnimatedStyle(categoryAnim4),
              ]}
            >
              <CategoryCard
                imageSource={require("../../../assets/images/categorias/infantil.jpg")}
              />
            </Animated.View>
          </View>
        </View>

        <View
          style={styles.itemsSection}
          onLayout={(event) => {
            setItemsSectionY(event.nativeEvent.layout.y);
          }}
        >
          <RevealOnScroll scrollY={scrollY} offset={120}>
            <Text style={styles.sectionTitle}>Perto de você</Text>
          </RevealOnScroll>

          <RevealOnScroll scrollY={scrollY} delay={40} offset={120}>
            <Text style={styles.caption}>Itens disponíveis na sua região</Text>
          </RevealOnScroll>

          <View style={styles.itemList}>
            <Animated.View style={getItemAnimatedStyle(itemAnim1)}>
              <ItemCard
                title="Cadeira de madeira"
                condition="Usado"
                details="Bom estado"
                distance="1 km de você"
                transaction="Doação"
                imageSource={require("../../../assets/images/itens/cadeira.jpg")}
              />
            </Animated.View>

            <Animated.View style={getItemAnimatedStyle(itemAnim2)}>
              <ItemCard
                title="Jaqueta de couro"
                condition="Usado"
                details="Tam 40"
                distance="1,4 km de você"
                transaction="Troca"
                imageSource={require("../../../assets/images/itens/jaqueta.jpg")}
              />
            </Animated.View>

            <Animated.View style={getItemAnimatedStyle(itemAnim3)}>
              <ItemCard
                title="Teclado gamer"
                condition="Usado"
                details="Bom estado"
                distance="2 km de você"
                transaction="Venda"
                imageSource={require("../../../assets/images/itens/teclado.jpg")}
              />
            </Animated.View>
          </View>
        </View>

        <RevealOnScroll scrollY={scrollY}>
          <CtaCard
            title="Impacto coletivo"
            highlightText="+ 1.240 itens"
            subtitle="ganharam um novo destino este mês. Tem algo parado em casa? Transforme em oportunidade."
            imageSource={require("../../../assets/images/cta/ImpactoColetivo.png")}
            buttonTitle="Publicar item"
            onPress={() => onNavigateToPublish?.()}
            variant="compact"
          />
        </RevealOnScroll>
      </AnimatedScrollView>
      <IncentiveModal
        visible={showIncentive}
        onClose={async () => {
          const emailUsuario = await buscarToken();
          if (emailUsuario) {
            await salvar(`incentive_seen:${emailUsuario}`, "true");
          }
          setShowIncentive(false);
        }}
        onPublish={async () => {
          const emailUsuario = await buscarToken();
          if (emailUsuario) {
            await salvar(`incentive_seen:${emailUsuario}`, "true");
          }
          setShowIncentive(false);
          onNavigateToPublish?.();
        }}
      />
    </>
  );
}
