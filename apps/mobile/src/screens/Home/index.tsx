import { Text } from "../../design/Text";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  View,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import CtaCard from "../../components/CtaCard";
import { PromoCard } from "../../components/PromoCard";
import { IncentiveModal } from "../../components/IncentiveCard";
import { salvar, buscar } from "../../Services/Storage";
import { buscarEmailUsuarioAtual } from "../../Services/authSession";
import { conditionLabel } from "../../lib/itemCondition";
import styles from "./styles";
import { SharedCatalog } from "../../components/SharedCatalog";

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
  onNavigateToProduct?: (itemId: string) => void;
}

export function HomeScreen({
  onNavigateToPublish,
  onNavigateToProfile,
  onNavigateToProduct,
}: HomeScreenProps) {
  const [showIncentive, setShowIncentive] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [catalogPreset, setCatalogPreset] = useState<{
    categoria?: string;
    curadoria?: string;
  }>();
  const catalogScroll = useRef<ScrollView>(null);

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

  const [itemsSectionY, setItemsSectionY] = useState(0);

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
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onSubmit={() => {
                Keyboard.dismiss();
                catalogScroll.current?.scrollTo({
                  y: Math.max(0, itemsSectionY - insets.top - 16),
                  animated: true,
                });
              }}
            />
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
                    onPress={() => {
                      setQuery("");
                      setCatalogPreset(
                        card.id === 2
                          ? { curadoria: "pecas-raras" }
                          : {
                              categoria: (
                                {
                                  1: "eletronicos",
                                  3: "sapatos",
                                  4: "livros",
                                  5: "moveis",
                                } as Record<number, string>
                              )[card.id],
                            },
                      );
                      catalogScroll.current?.scrollTo({
                        y: itemsSectionY,
                        animated: true,
                      });
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </RevealOnScroll>

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
            <Text style={styles.caption}>
              Localização informada pelos anunciantes
            </Text>
          </RevealOnScroll>

          <View style={styles.itemList}>
            <SharedCatalog
              preset={catalogPreset}
              pageSize={6}
              query={query}
              onQueryChange={setQuery}
            />
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
