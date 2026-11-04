import { Text } from "../../design/Text";
import { colors } from "../../design/tokens";
import { startConversation } from "../../lib/chatApi";
import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  readItem,
  CatalogItem,
  CatalogError,
  catalogImage,
  TYPE_LABELS,
  CONDITION_LABELS,
  priceLabel,
} from "../../lib/catalogApi";
import styles from "./styles";
import { readMyProfile } from "../../lib/profileApi";
type Props = {
  route?: {
    params?: {
      itemId: string;
      returnTo?: string;
    };
  };
};
export function ProductScreen({ route }: Props) {
  const navigation = useNavigation<any>(),
    insets = useSafeAreaInsets();
  const [owner, setOwner] = useState(false);
  const [item, setItem] = useState<CatalogItem | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [attempt, setAttempt] = useState(0),
    [photo, setPhoto] = useState(0);
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      let active = true;
      setLoading(true);
      setItem(null);
      setError("");
      setPhoto(0);
      readItem(route?.params?.itemId || "", controller.signal)
        .then((value) => {
          if (active) {
            setItem(value);
            readMyProfile()
              .then((p) => {
                if (active) setOwner(p.id === value.seller?.id);
              })
              .catch(() => {});
          }
        })
        .catch((error) => {
          if (active)
            setError(
              error instanceof CatalogError && error.status === 404
                ? "Anúncio não disponível."
                : "Não foi possível carregar o anúncio. Verifique a conexão.",
            );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
        controller.abort();
      };
    }, [route?.params?.itemId, attempt]),
  );
  return (
    <View style={styles.screen}>
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator
          accessibilityLabel="Carregando anúncio"
          color={colors.text}
        />
      ) : error ? (
        <View style={{ padding: 24 }}>
          <Text accessibilityRole="alert">{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setAttempt((v) => v + 1)}
            style={{ paddingVertical: 16 }}
          >
            <Text>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        item && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.mainImageWrapper}>
              <Image
                accessibilityLabel={item.title}
                source={{ uri: catalogImage(item.images[photo]) }}
                style={styles.mainImage}
              />
            </View>
            {item.images.length > 1 && (
              <ScrollView
                horizontal
                contentContainerStyle={styles.thumbsContent}
              >
                {item.images.map((url, index) => (
                  <Pressable
                    key={url}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver foto ${index + 1}`}
                    accessibilityState={{ selected: photo === index }}
                    onPress={() => setPhoto(index)}
                  >
                    <Image
                      source={{ uri: catalogImage(url) }}
                      style={styles.thumb}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            )}
            <View style={styles.infoSection}>
              <Text>{item.category.name}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.condition}>
                {CONDITION_LABELS[item.condition] || item.condition}
              </Text>
              <Text style={styles.locationText}>
                {item.location || "Combinar com o anunciante"}
              </Text>
              <View style={styles.badgeRow}>
                <Text style={styles.typeBadgeText}>
                  {TYPE_LABELS[item.type]}
                </Text>
                <Text style={styles.price}>{priceLabel(item)}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.ownerCard}>
              <Text style={styles.ownerName}>{item.seller?.name}</Text>
              <Text>{item.seller?.activeItemsCount} itens publicados</Text>
              {owner && (
                <Pressable
                  accessibilityRole="button"
                  style={styles.chatBtn}
                  onPress={() =>
                    navigation.navigate("HomeScreen", {
                      screen: "publicar",
                      params: { mode: "edit", itemId: item.id },
                    })
                  }
                >
                  <Text style={styles.chatBtnText}>Editar anúncio</Text>
                </Pressable>
              )}
              {!owner && (
                <Pressable
                  style={styles.chatBtn}
                  accessibilityRole="button"
                  onPress={async () => {
                    try {
                      const conversation = await startConversation(item.id);
                      navigation.navigate("Chats", {
                        conversationId: conversation.id,
                      });
                    } catch {
                      setError(
                        "Não foi possível iniciar a conversa. Verifique a conexão.",
                      );
                    }
                  }}
                >
                  <Text style={styles.chatBtnText}>Falar com anunciante</Text>
                </Pressable>
              )}
            </View>
          </ScrollView>
        )
      )}
    </View>
  );
}
