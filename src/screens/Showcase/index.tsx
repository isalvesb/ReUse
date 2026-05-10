import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { buscarEmailUsuarioAtual } from "../../Services/firebaseAuth";
import { buscar } from "../../Services/Storage";
import { getItemsByUser, Item } from "../../Services/Items";
import styles from "./styles";

type ItemType = "Venda" | "Troca" | "Doação";

type ShowcaseItem = {
  id: number;
  title: string;
  condition: string;
  size?: string;
  distance: string;
  type: ItemType;
  price?: string;
  image?: string;
};

type UserData = {
  name: string;
  email: string;
  location: string;
  avatarUri?: string | null;
  avaliacao?: string;
};

type FilterOption = "Todos" | "Doações" | "Trocas" | "Vendas";

const defaultProfileImage = require("../../../assets/images/profiles/default.png");

function getProfileImage(avatarUri?: string | null) {
  if (typeof avatarUri === "string" && avatarUri.trim() !== "") {
    return { uri: avatarUri };
  }

  return defaultProfileImage;
}

function getItemType(item: Item): ItemType {
  if (item.item_type === "troca") return "Troca";
  if (item.item_type === "doacao") return "Doação";
  if (item.item_type === "venda") return "Venda";
  const cat = item.category?.toLowerCase() ?? "";
  if (cat.includes("troca")) return "Troca";
  if (cat.includes("doa")) return "Doação";
  return "Venda";
}

function TypeBadge({ type }: { type: ItemType }) {
  const bg =
    type === "Venda" ? "#F5C842" : type === "Troca" ? "#C9A8D4" : "#A8D4B0";
  return (
    <View style={[styles.typeBadge, { backgroundColor: bg }]}>
      <Text style={styles.typeBadgeText}>{type}</Text>
    </View>
  );
}

function ItemCard({
  item,
  onPress,
}: {
  item: ShowcaseItem;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.itemImageBox}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        ) : (
          <View style={styles.itemImagePlaceholder}>
            <Ionicons name="image-outline" size={36} color="#CCC" />
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemSub}>
          {item.condition}
          {item.size ? ` • ${item.size}` : ""}
        </Text>
        <Text style={styles.itemDistance}>{item.distance}</Text>
        <View style={styles.itemFooter}>
          <TypeBadge type={item.type} />
          {item.price && <Text style={styles.itemPrice}>{item.price}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ShowcaseScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState<FilterOption>("Todos");

  const filterOptions: FilterOption[] = [
    "Todos",
    "Doações",
    "Trocas",
    "Vendas",
  ];

  const counts = {
    Doações: items.filter((i) => getItemType(i) === "Doação").length,
    Trocas: items.filter((i) => getItemType(i) === "Troca").length,
    Vendas: items.filter((i) => getItemType(i) === "Venda").length,
  };

  const filtered =
    filter === "Todos"
      ? items
      : filter === "Doações"
        ? items.filter((i) => getItemType(i) === "Doação")
        : filter === "Trocas"
          ? items.filter((i) => getItemType(i) === "Troca")
          : items.filter((i) => getItemType(i) === "Venda");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const carregar = async () => {
        try {
          const email = buscarEmailUsuarioAtual();

          if (!email) {
            if (isActive) {
              setIsLoading(false);
            }

            return;
          }

          const raw = await buscar(`user:${email}`);

          if (!isActive) return;

          if (raw) {
            const parsed = JSON.parse(raw);

            setUser({
              name: parsed.name ?? "Usuário ReUse",
              email,
              location: parsed.location ?? "Localização não informada",
              avatarUri: parsed.avatarUri ?? null,
              avaliacao: parsed.avaliacao ?? "4.8",
            });
          } else {
            setUser({
              name: "Usuário ReUse",
              email,
              location: "Localização não informada",
              avatarUri: null,
              avaliacao: "4.8",
            });
          }

          const userItems = await getItemsByUser(email);

          if (isActive) {
            setItems(userItems);
          }
        } catch (err) {
          console.error("Erro ao carregar vitrine:", err);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      carregar();

      return () => {
        isActive = false;
      };
    }, []),
  );

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#2B2118" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* ── Bloco escuro fixo (fora do ScrollView) ── */}
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.navTitle}>Minha Vitrine</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.userCardLeft}>
          <Image
            source={getProfileImage(user?.avatarUri)}
            style={styles.userAvatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name ?? "Usuário"}</Text>
            <View style={styles.userLocationRow}>
              <Ionicons name="location-outline" size={13} color="#9A9186" />
              <Text style={styles.userLocation}>{user?.location ?? "—"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={14} color="#F5C842" />
          <Text style={styles.ratingText}>{user?.avaliacao ?? "4.8"}</Text>
        </View>
      </View>

      {/* Contadores — fecham o bloco escuro com borderRadius embaixo */}
      <View style={styles.countersRow}>
        <View style={[styles.counterCard, styles.counterCardDoacao]}>
          <Text style={styles.counterValue}>{counts.Doações}</Text>
          <Text style={styles.counterLabel}>Doações</Text>
        </View>
        <View style={[styles.counterCard, styles.counterCardTroca]}>
          <Text style={styles.counterValue}>{counts.Trocas}</Text>
          <Text style={styles.counterLabel}>Trocas</Text>
        </View>
        <View style={[styles.counterCard, styles.counterCardVenda]}>
          <Text style={styles.counterValue}>{counts.Vendas}</Text>
          <Text style={styles.counterLabel}>Vendas</Text>
        </View>
      </View>

      {/* ── ScrollView só para o conteúdo abaixo ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filtros */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {filterOptions.map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive,
              ]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === f && styles.filterChipTextActive,
                ]}
              >
                {f !== "Todos" && counts[f as keyof typeof counts]
                  ? `${f} (${counts[f as keyof typeof counts]})`
                  : f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Contagem total */}
        <Text style={styles.itemCount}>
          {filtered.length} {filtered.length === 1 ? "item" : "itens"}
        </Text>

        {/* Grade */}
        <View style={styles.grid}>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <View key={item.id} style={styles.gridCell}>
                <ItemCard
                  item={{
                    id: item.id,
                    title: item.title,
                    condition: item.item_condition || "Bom estado",
                    size: item.size ?? undefined,
                    distance: item.city
                      ? `${item.neighborhood ? `${item.neighborhood}, ` : ""}${item.city}`
                      : item.location || "Localização não informada",
                    type: getItemType(item),
                    price: item.price ?? undefined,
                    image: item.images?.[0] ?? undefined,
                  }}
                  onPress={() =>
                    navigation.navigate("Product", {
                      itemId: item.id,
                      returnTo: "vitrine",
                    })
                  }
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="archive-outline" size={48} color="#CCC" />
              <Text style={styles.emptyStateText}>Nenhum item encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
