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
import styles from "./styles";

export function ShowcaseScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadItems();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadItems();
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
            Assim que um item for publicado, ele aparecerá aqui.
          </Text>
        </View>
      ) : (
        <View style={styles.listContent}>
          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {item.category} • {formatCondition(item.item_condition)}{" "}
              </Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardLocation}>{item.location}</Text>
              {!!item.user_email && (
                <Text style={styles.cardUser}>
                  Publicado por: {item.user_email}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
