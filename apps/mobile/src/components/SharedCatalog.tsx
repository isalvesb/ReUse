import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  readCategories,
  readItems,
  Category,
  CatalogItem,
  CatalogPage,
  TYPE_LABELS,
  CONDITION_LABELS,
  priceLabel,
  catalogImage,
} from "../lib/catalogApi";
import { ItemCard } from "./ItemCard";
export function SharedCatalog({
  query = "",
  showSearch = false,
  onQueryChange,
  pageSize = 12,
  preset,
}: {
  query?: string;
  showSearch?: boolean;
  onQueryChange?: (q: string) => void;
  pageSize?: number;
  preset?: { categoria?: string; curadoria?: string };
}) {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<Category[]>([]),
    [category, setCategory] = useState(""),
    [type, setType] = useState(""),
    [curadoria, setCuradoria] = useState(""),
    [page, setPage] = useState(1),
    [attempt, setAttempt] = useState(0),
    [data, setData] = useState<CatalogPage | null>(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    setPage(1);
  }, [query]);
  useEffect(() => {
    setCategory(preset?.categoria || "");
    setCuradoria(preset?.curadoria || "");
    setPage(1);
  }, [preset]);
  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      let active = true;
      setLoading(true);
      setError("");
      setData(null);
      const timer = setTimeout(() => {
        Promise.all([
          readCategories(controller.signal),
          readItems(
            {
              q: query,
              categoria: category,
              tipo: type,
              curadoria,
              page: String(page),
              pageSize: String(pageSize),
            },
            controller.signal,
          ),
        ])
          .then(([cats, result]) => {
            if (active) {
              setCategories(cats);
              setData(result);
            }
          })
          .catch(() => {
            if (active)
              setError(
                "Não foi possível consultar os anúncios. Verifique a conexão e tente novamente.",
              );
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      }, 250);
      return () => {
        active = false;
        clearTimeout(timer);
        controller.abort();
      };
    }, [query, category, type, curadoria, page, pageSize, attempt]),
  );
  const chip = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        minHeight: 44,
        padding: 12,
        marginRight: 8,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#342A2A",
        backgroundColor: selected ? "#EBBBEB" : "#F7EFDE",
      }}
    >
      <Text style={{ color: "#342A2A", fontFamily: "Inter_500Medium" }}>
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={{ gap: 14 }}>
      {showSearch && (
        <TextInput
          accessibilityLabel="Buscar anúncios"
          placeholder="Buscar por título, descrição ou categoria"
          value={query}
          onChangeText={(q) => {
            setPage(1);
            onQueryChange?.(q);
          }}
          maxLength={80}
          returnKeyType="search"
          style={{
            minHeight: 48,
            padding: 12,
            backgroundColor: "#F3E8D2",
            borderRadius: 20,
          }}
        />
      )}
      <Text style={{ color: "#342A2A", fontFamily: "Inter_700Bold" }}>
        Categorias
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chip("Todas as categorias", !category, () => {
          setCategory("");
          setPage(1);
        })}
        {categories.map((c) =>
          chip(c.name, category === c.slug, () => {
            setCategory(c.slug);
            setPage(1);
          }),
        )}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chip("Todas as modalidades", !type, () => {
          setType("");
          setPage(1);
        })}
        {Object.entries(TYPE_LABELS).map(([value, label]) =>
          chip(label, type === value, () => {
            setType(value);
            setPage(1);
          }),
        )}
      </ScrollView>
      {curadoria ? <Text>Curadoria: peças raras</Text> : null}
      {category || type || query || curadoria ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setCategory("");
            setCuradoria("");
            setType("");
            setPage(1);
            onQueryChange?.("");
          }}
          style={{ minHeight: 44, justifyContent: "center" }}
        >
          <Text>Limpar busca e filtros</Text>
        </Pressable>
      ) : null}
      {loading ? (
        <ActivityIndicator
          accessibilityLabel="Carregando anúncios"
          color="#342A2A"
        />
      ) : error ? (
        <View>
          <Text accessibilityRole="alert">{error}</Text>
          {chip("Tentar novamente", false, () => setAttempt((v) => v + 1))}
        </View>
      ) : (
        <>
          <Text accessibilityLiveRegion="polite">
            {data?.pagination.total || 0} anúncio(s)
          </Text>
          {!data?.items.length ? (
            <Text>Nenhum anúncio encontrado para esta busca.</Text>
          ) : (
            data.items.map((item: CatalogItem) => (
              <View key={item.id} accessibilityLabel={`Anúncio ${item.title}`}>
                <ItemCard
                  title={item.title}
                  condition={CONDITION_LABELS[item.condition] || item.condition}
                  details={priceLabel(item) || ""}
                  distance={item.location || "Combinar com o anunciante"}
                  transaction={TYPE_LABELS[item.type]}
                  imageSource={{ uri: catalogImage(item.images[0]) }}
                  onPress={() =>
                    navigation.navigate("Product", { itemId: item.id })
                  }
                />
              </View>
            ))
          )}
          <View style={{ flexDirection: "row", gap: 12 }}>
            {page > 1 && chip("Anterior", false, () => setPage((v) => v - 1))}
            {data &&
              page < data.pagination.totalPages &&
              chip("Próxima página", false, () => setPage((v) => v + 1))}
          </View>
        </>
      )}
    </View>
  );
}
