import React, { useEffect, useRef, useState, useCallback } from "react";
import { Animated, Dimensions, ScrollView, View, Text, Pressable, ActivityIndicator, Keyboard } from "react-native";
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
import { buscarEmailUsuarioAtual } from "../../Services/authSession";
import { supabase } from "../../lib/supabase";
import { conditionLabel } from "../../lib/itemCondition";
import styles from "./styles";
import { getItems, Item } from "../../Services/Items";
import { filterCatalog } from "../../lib/catalog";

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

async function buscarQuantidadeItensUsuario(email: string) {
  const { count, error } = await supabase
    .from("items")
    .select("id", { count: "exact", head: true })
    .eq("user_email", email);

  if (error) {
    return null;
  }

  return count ?? 0;
}

interface HomeScreenProps {
  onNavigateToPublish?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToProduct?: (itemId: number) => void;
}

export function HomeScreen({
  onNavigateToPublish,
  onNavigateToProfile,
  onNavigateToProduct,
}: HomeScreenProps) {
  const [showIncentive, setShowIncentive] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Item[]>([]);
  const [catalogError, setCatalogError] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogAttempt, setCatalogAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("");
  const catalogScroll = useRef<ScrollView>(null);
  const filteredCatalog = filterCatalog(catalog, query, catalogCategory);
  useFocusEffect(useCallback(() => {
    let active = true;
    setCatalogLoading(true); setCatalogError("");
    getItems().then(items => { if (active) setCatalog(items); })
      .catch(() => { if (active) setCatalogError("Não foi possível consultar os anúncios. Tente novamente."); })
      .finally(() => { if (active) setCatalogLoading(false); });
    return () => { active = false; };
  }, [catalogAttempt]));


  useFocusEffect(
    useCallback(() => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      let isActive = true;

      const verificar = async () => {
        const emailUsuario = buscarEmailUsuarioAtual();

        if (!emailUsuario) return;

        const quantidadeItens =
          await buscarQuantidadeItensUsuario(emailUsuario);

        if (!isActive) return;

        if (quantidadeItens === null) {
          setShowIncentive(false);
          return;
        }

        if (quantidadeItens > 0) {
          await salvar(`incentive_seen:${emailUsuario}`, "true");

          if (isActive) {
            setShowIncentive(false);
          }

          return;
        }

        const jaViu = await buscar(`incentive_seen:${emailUsuario}`);

        if (!isActive) return;

        if (jaViu !== "true") {
          timer = setTimeout(() => {
            if (isActive) {
              setShowIncentive(true);
            }
          }, 2000);
        }
      };

      verificar();

      return () => {
        isActive = false;

        if (timer) {
          clearTimeout(timer);
        }
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const carregarAvatarUsuario = async () => {
        const emailUsuario = buscarEmailUsuarioAtual();

        if (!emailUsuario) {
          if (isActive) {
            setAvatarUri(null);
          }

          return;
        }

        const dadosUsuario = await buscar(`user:${emailUsuario}`);

        if (!isActive) return;

        if (!dadosUsuario) {
          setAvatarUri(null);
          return;
        }

        try {
          const usuarioSalvo = JSON.parse(dadosUsuario);
          const fotoSalva = usuarioSalvo?.avatarUri;

          if (typeof fotoSalva === "string" && fotoSalva.trim() !== "") {
            setAvatarUri(fotoSalva);
          } else {
            setAvatarUri(null);
          }
        } catch {
          setAvatarUri(null);
        }
      };

      carregarAvatarUsuario();

      return () => {
        isActive = false;
      };
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
        ref={catalogScroll}
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
        <Header onProfilePress={onNavigateToProfile} avatarUri={avatarUri} />
        <RevealOnScroll scrollY={scrollY}>
          <View style={styles.searchWrap}>
            <SearchBar value={query} onChangeText={setQuery} onSubmit={() => { Keyboard.dismiss(); catalogScroll.current?.scrollTo({ y: Math.max(0, itemsSectionY - insets.top - 16), animated: true }); }} />
            {(query || catalogCategory) ? <View><Text style={styles.caption}>{catalogError ? "Consulta indisponível" : `${filteredCatalog.length} anúncio(s) encontrado(s)`}{catalogCategory ? ` · ${catalogCategory}` : ""}</Text><Pressable accessibilityRole="button" onPress={() => { setQuery(""); setCatalogCategory(""); }} style={{paddingVertical:12}}><Text style={{color:"#342A2A",fontWeight:"700"}}>Limpar busca e filtros</Text></Pressable></View> : null}
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
                label="Categoria Roupas"
                imageSource={require("../../../assets/images/categorias/roupas.jpg")}
                onPress={() => { setCatalogCategory("Roupas"); Keyboard.dismiss(); catalogScroll.current?.scrollTo({ y: Math.max(0, itemsSectionY - insets.top - 16), animated: true }); }}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.categoryAnimatedItem,
                getCategoryAnimatedStyle(categoryAnim2),
              ]}
            >
              <CategoryCard
                label="Categoria Acessórios"
                imageSource={require("../../../assets/images/categorias/oculos.jpg")}
                onPress={() => { setCatalogCategory("Acessórios"); Keyboard.dismiss(); catalogScroll.current?.scrollTo({ y: Math.max(0, itemsSectionY - insets.top - 16), animated: true }); }}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.categoryAnimatedItem,
                getCategoryAnimatedStyle(categoryAnim3),
              ]}
            >
              <CategoryCard
                label="Categoria Decoração"
                imageSource={require("../../../assets/images/categorias/luminaria.jpg")}
                onPress={() => { setCatalogCategory("Decoração"); Keyboard.dismiss(); catalogScroll.current?.scrollTo({ y: Math.max(0, itemsSectionY - insets.top - 16), animated: true }); }}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.categoryAnimatedItem,
                getCategoryAnimatedStyle(categoryAnim4),
              ]}
            >
              <CategoryCard
                label="Categoria Infantil"
                imageSource={require("../../../assets/images/categorias/infantil.jpg")}
                onPress={() => { setCatalogCategory("Infantil"); Keyboard.dismiss(); catalogScroll.current?.scrollTo({ y: Math.max(0, itemsSectionY - insets.top - 16), animated: true }); }}
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
            <Text style={styles.sectionTitle}>Anúncios da comunidade</Text>
          </RevealOnScroll>

          <RevealOnScroll scrollY={scrollY} delay={40} offset={120}>
            <Text style={styles.caption}>Localização informada pelos anunciantes</Text>
          </RevealOnScroll>

          <View style={styles.itemList}>
            {catalogLoading ? <ActivityIndicator accessibilityLabel="Carregando anúncios" color="#342A2A" /> : catalogError ? <View><Text accessibilityRole="alert">{catalogError}</Text><Pressable accessibilityRole="button" onPress={() => setCatalogAttempt(value => value + 1)} style={{padding:14}}><Text>Tentar novamente</Text></Pressable></View> : filteredCatalog.length === 0 ? <Text>Nenhum anúncio encontrado para esta busca.</Text> : filteredCatalog.slice(0, 6).map((item, index) => (
              <Animated.View key={item.id} style={getItemAnimatedStyle([itemAnim1,itemAnim2,itemAnim3][Math.min(index,2)])}>
                <ItemCard title={item.title} condition={conditionLabel(item.item_condition)} details={item.size || ""} distance={item.location || "Localização não informada"} transaction={item.item_type === "doacao" ? "Doação" : item.item_type === "troca" ? "Troca" : "Venda"} imageSource={item.images?.[0] ? {uri:item.images[0]} : require("../../../assets/images/icon.png")} onPress={() => onNavigateToProduct?.(item.id)} />
              </Animated.View>
            ))}
          </View>
        </View>

        <RevealOnScroll scrollY={scrollY}>
          <CtaCard
            title="Impacto coletivo"
            highlightText="Cada item conta"
            subtitle="Dê um novo destino ao que está parado em casa. Transforme em oportunidade."
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
          const emailUsuario = buscarEmailUsuarioAtual();
          if (emailUsuario) {
            await salvar(`incentive_seen:${emailUsuario}`, "true");
          }
          setShowIncentive(false);
        }}
        onPublish={async () => {
          const emailUsuario = buscarEmailUsuarioAtual();
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
