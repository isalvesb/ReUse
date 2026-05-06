import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { buscarToken } from "../../Services/Auth";
import { buscar } from "../../Services/Storage";
import { getItemById, Item } from "../../Services/Items";

import styles from "./styles";

// ─── Imagens locais ───────────────────────────────────────────────────────────

const defaultProfileImage = require("../../../assets/images/profiles/default.png");
const profileImagesByEmail: Record<string, any> = {
  "gui@email.com": require("../../../assets/images/profiles/gui.png"),
  "isa@email.com": require("../../../assets/images/profiles/isa.png"),
  "kau@email.com": require("../../../assets/images/profiles/kau.png"),
  "mir@email.com": require("../../../assets/images/profiles/mir.png"),
};

function getProfileImage(email?: string | null, avatarUri?: string | null) {
  if (avatarUri) return { uri: avatarUri };
  const key = email?.toLowerCase() ?? "";
  return profileImagesByEmail[key] ?? defaultProfileImage;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONDITION_LABEL: Record<string, string> = {
  novo: "Novo",
  como_novo: "Usado - Como Novo",
  bom_estado: "Usado - Bom estado",
  regular: "Usado - Estado Regular",
};

function getItemType(item: Item): "Venda" | "Troca" | "Doação" {
  const cat = item.category?.toLowerCase() ?? "";
  if (cat.includes("troca")) return "Troca";
  if (cat.includes("doa")) return "Doação";
  return "Venda";
}

// ─── Tela ─────────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OwnerData = {
  name: string;
  email: string;
  avatar?: string | null;
  trocas?: number;
  avaliacao?: string;
};

type Props = {
  route?: {
    params?: {
      itemId: number;
    };
  };
};

export function ProductScreen({ route }: Props) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const itemId = route?.params?.itemId;

  const [item, setItem] = useState<Item | null>(null);
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      if (!itemId) return;
      try {
        // Busca o item
        const fetchedItem = await getItemById(itemId);
        setItem(fetchedItem);

        // Busca dados do dono do item
        if (fetchedItem.user_email) {
          const raw = await buscar(`user:${fetchedItem.user_email}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            setOwner({
              name: parsed.name,
              email: fetchedItem.user_email,
              avatar: parsed.avatar ?? null,
              trocas: parsed.trocas ?? 0,
              avaliacao: parsed.avaliacao ?? "—",
            });
          } else {
            setOwner({
              name: "Usuário ReUse",
              email: fetchedItem.user_email,
              trocas: 0,
              avaliacao: "—",
            });
          }
        }

        // Verifica se o usuário logado é o dono
        const loggedEmail = await buscarToken();
        setIsOwner(
          !!loggedEmail &&
          loggedEmail.toLowerCase() === fetchedItem.user_email?.toLowerCase()
        );
      } catch (err) {
        console.error("Erro ao carregar produto:", err);
        Alert.alert("Erro", "Não foi possível carregar o produto.");
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    carregar();
  }, [itemId]);

  if (isLoading || !item) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#342A2A" />
      </View>
    );
  }

  const images = item.images ?? [];
  const itemType = getItemType(item);

  const badgeBg =
    itemType === "Troca" ? "#C9A8D4" :
    itemType === "Doação" ? "#A8D4B0" :
    "#F5C842";

  const locationLabel = item.city
    ? `${item.neighborhood ? `${item.neighborhood}, ` : ""}${item.city} - ${item.state}`
    : item.location;

  return (
    <View style={styles.screen}>
      {/* ── Header ── */}
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Imagem principal ── */}
        <View style={styles.mainImageWrapper}>
          {images.length > 0 ? (
            <Image
              source={{ uri: images[selectedImage] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.mainImagePlaceholder}>
              <Ionicons name="image-outline" size={64} color="#CCC" />
            </View>
          )}

          {/* Botão editar — só aparece pro dono */}
          {isOwner && (
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Profile", { mode: "edit", user: owner })}
            >
              <Ionicons name="pencil" size={18} color="#342A2A" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Thumbnails ── */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbsScroll}
            contentContainerStyle={styles.thumbsContent}
          >
            {images.map((uri, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedImage(i)}
                activeOpacity={0.8}
                style={[styles.thumb, i === selectedImage && styles.thumbActive]}
              >
                <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Informações ── */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.condition}>
            {CONDITION_LABEL[item.item_condition] ?? item.item_condition}
          </Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#888780" />
            <Text style={styles.locationText}>{locationLabel}</Text>
          </View>

          {/* Badge + preço */}
          <View style={styles.badgeRow}>
            <View style={[styles.typeBadge, { backgroundColor: badgeBg }]}>
              <Text style={styles.typeBadgeText}>{itemType}</Text>
            </View>
            {/* Preço — visível só em Venda (adapte conforme seu modelo de dados) */}
            {itemType === "Venda" && (
              <Text style={styles.price}>R$ —</Text>
            )}
          </View>

          {/* Descrição */}
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {/* ── Card do vendedor ── */}
        <View style={styles.ownerCard}>
          <View style={styles.ownerInfo}>
            <Image
              source={getProfileImage(owner?.email, owner?.avatar)}
              style={styles.ownerAvatar}
            />
            <View style={styles.ownerText}>
              <Text style={styles.ownerName}>{owner?.name ?? "Usuário"}</Text>
              <Text style={styles.ownerMeta}>
                {owner?.trocas ?? 0} trocas realizadas
                {"  •  "}
                <Ionicons name="star" size={12} color="#F5C842" />
                {" "}{owner?.avaliacao ?? "—"}
              </Text>
            </View>
          </View>

          {/* Botão conversar — só pro visitante */}
          {!isOwner && (
            <TouchableOpacity
              style={styles.chatBtn}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate("Chats", { recipientEmail: owner?.email })
              }
            >
              <Ionicons name="chatbox-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.chatBtnText}>Conversar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

