import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SharedCatalog } from "../../components/SharedCatalog";
export function ShowcaseScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  return (
    <View style={{ flex: 1, backgroundColor: "#F7EFDE" }}>
      <View
        style={{
          paddingTop: insets.top + 14,
          padding: 20,
          backgroundColor: "#342A2A",
        }}
      >
        <Text
          style={{
            fontFamily: "Syne_800ExtraBold",
            fontSize: 26,
            color: "#EBBBEB",
          }}
        >
          Vitrine
        </Text>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      >
        <SharedCatalog showSearch query={query} onQueryChange={setQuery} />
      </ScrollView>
    </View>
  );
}
