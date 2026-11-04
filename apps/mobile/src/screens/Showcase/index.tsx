import { Text } from "../../design/Text";
import { colors, font } from "../../design/tokens";
import React, { useState, useCallback } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { itemRequest } from "../../lib/itemWriteApi";
import { SharedCatalog } from "../../components/SharedCatalog";
export function ShowcaseScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [mine, setMine] = useState(false),
    [items, setItems] = useState<any[]>([]),
    [error, setError] = useState("");
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (mine)
        itemRequest("/me/items")
          .then((data) => {
            if (active) {
              setItems(data);
              setError("");
            }
          })
          .catch(() => {
            if (active) setError("Não foi possível consultar seus anúncios.");
          });
      return () => {
        active = false;
      };
    }, [mine]),
  );
  const [query, setQuery] = useState("");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingBottom: Math.max(insets.bottom, 12) + 102,
      }}
    >
      <View
        style={{
          paddingTop: insets.top + 14,
          padding: 20,
          backgroundColor: colors.text,
        }}
      >
        <Text
          style={{
            fontFamily: font.bold,
            fontSize: 26,
            color: colors.accent,
          }}
        >
          Vitrine
        </Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 24,
        }}
      >
        <Pressable
          accessibilityRole="button"
          style={{ paddingVertical: 16 }}
          onPress={() => setMine(!mine)}
        >
          <Text>{mine ? "Ver catálogo público" : "Meus anúncios"}</Text>
        </Pressable>
        {mine ? (
          <View>
            <Text accessibilityRole="alert">{error}</Text>
            {items.map((item) => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                style={{ padding: 16, borderBottomWidth: 1 }}
                onPress={() =>
                  navigation.navigate("HomeScreen", {
                    screen: "publicar",
                    params: { mode: "edit", itemId: item.id },
                  })
                }
              >
                <Text>
                  {item.title} · {item.status} · Editar
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <SharedCatalog showSearch query={query} onQueryChange={setQuery} />
        )}
      </ScrollView>
    </View>
  );
}
