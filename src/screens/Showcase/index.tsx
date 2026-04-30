import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getItems, Item } from "../../Services/Items";
import { buscar, salvar } from "../../Services/Storage";
import { buscarToken } from "../../Services/Auth";
import { DEV_SKIP_AUTH } from "../../config/devAuth";

import styles from "./styles";

const ITEMS_CACHE_KEY = "showcase_items_cache";
const DEV_USER_EMAIL = "dev@reuse.app";

export function ShowcaseScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingCache, setUsingCache] = useState(false);

  const insets = useSafeAreaInsets();

  const normalizeEmail = (email?: string | null) => {
    return email?.trim().toLowerCase() ?? "";
  };

  const getUserCacheKey = (userEmail: string) => {
    return `${ITEMS_CACHE_KEY}:${normalizeEmail(userEmail)}`;
  };

  const filterItemsByUser = (allItems: Item[], userEmail: string) => {
    const normalizedUserEmail = normalizeEmail(userEmail);

    return allItems.filter(
      (item) => normalizeEmail(item.user_email) === normalizedUserEmail,
    );
  };

  const getLoggedUserEmail = async () => {
    if (DEV_SKIP_AUTH) {
      return normalizeEmail(DEV_USER_EMAIL);
    }

    const token = await buscarToken();
    return normalizeEmail(token);
  };

  const loadCachedItems = async (userEmail: string) => {
    try {
      const cacheKey = getUserCacheKey(userEmail);
      const cachedItems = await buscar(cacheKey);

      if (!cachedItems) {
        return [];
      }

      const parsedItems = JSON.parse(cachedItems) as Item[];
      const userItems = filterItemsByUser(parsedItems, userEmail);

      setItems(userItems);

      return userItems;
    } catch (error) {
      console.error("Erro ao carregar cache da vitrine:", error);
      return [];
    }
  };

  const loadItems = async (userEmail: string) => {
    try {
      const data = await getItems();
      const userItems = filterItemsByUser(data, userEmail);

      setItems(userItems);
      setUsingCache(false);

      const cacheKey = getUserCacheKey(userEmail);
      await salvar(cacheKey, JSON.stringify(userItems));
    } catch (error) {
      console.error("Erro ao buscar itens:", error);

      setUsingCache(items.length > 0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const initializeShowcase = async () => {
    setLoading(true);
    setItems([]);
    setUsingCache(false);

    const userEmail = await getLoggedUserEmail();

    if (!userEmail) {
      setItems([]);
      setLoading(false);
      return;
    }

    const cachedItems = await loadCachedItems(userEmail);

    if (cachedItems.length > 0) {
      setUsingCache(true);
    }

    await loadItems(userEmail);
  };

  useFocusEffect(
    useCallback(() => {
      initializeShowcase();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);

    const userEmail = await getLoggedUserEmail();

    if (!userEmail) {
      setItems([]);
      setRefreshing(false);
      return;
    }

    await loadItems(userEmail);
  };

  const formatCondition = (condition: string) => {
    const conditionMap: Record<string, string> = {
      novo: "Novo",
      como_novo: "Usado - Como Novo",
      usado: "Usado",
      regular: "Usado - Estado Regular",
    };

    return conditionMap[condition] ?? condition;
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#342A2A"
        />
      }
    >
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.navTitle}>Minha Vitrine</Text>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#342A2A" />
          <Text style={styles.feedbackText}>Carregando itens...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContent}>
          <Text style={styles.emptyTitle}>Nenhum item publicado ainda</Text>
          <Text style={styles.emptyText}>
            Assim que você publicar um item, ele aparecerá aqui.
          </Text>
        </View>
      ) : (
        <View style={styles.listContent}>
          {usingCache && (
            <View style={styles.cacheWarning}>
              <Text style={styles.cacheWarningText}>
                Exibindo dados salvos no dispositivo. Atualize quando a conexão
                voltar.
              </Text>
            </View>
          )}

          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>

              <Text style={styles.cardMeta}>
                {item.category} • {formatCondition(item.item_condition)}
              </Text>

              <Text style={styles.cardDescription}>{item.description}</Text>

              <Text style={styles.cardLocation}>{item.location}</Text>

            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}