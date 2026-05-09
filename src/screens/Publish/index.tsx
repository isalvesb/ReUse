import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Platform,
  ActionSheetIOS,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { salvar, buscar } from "../../Services/Storage";
import { IncentiveCard, IncentiveModal } from "../../components/IncentiveCard";
import { JourneyCard } from "../../components/JourneyCard";
import { PublishSuccessModal } from "../../components/SucessModal";
import { CepInput } from "../../components/CepInput";
import { CepResponse } from "../../Services/Cep";
import { createItem, uploadItemImages } from "../../Services/Items";
import { auth } from "../../Services/firebaseConfig";
import { supabase } from "../../lib/supabase";
import styles from "./styles";

type Condition =
  | "Novo"
  | "Usado • Como novo"
  | "Usado • Bom estado"
  | "Usado • Estado Regular";
type ItemType = "doacao" | "troca" | "venda";

interface PhotoItem {
  uri: string;
}

const CATEGORIES = [
  "Móveis",
  "Roupas e Acessórios",
  "Eletrônicos",
  "Livros e Revistas",
  "Brinquedos e Jogos",
  "Esportes e Lazer",
  "Utensílios Domésticos",
  "Ferramentas",
  "Bebês e Crianças",
  "Arte e Decoração",
  "Outros",
];

const TYPE_OPTIONS = [
  {
    key: "doacao" as ItemType,
    label: "Doação",
    icon: "heart-outline",
    desc: "Ofereça gratuitamente para quem precisar",
    badge: "#A8D4B0",
    badgeText: "#27500A",
  },
  {
    key: "troca" as ItemType,
    label: "Troca",
    icon: "swap-horizontal-outline",
    desc: "Troque por outro item de seu interesse",
    badge: "#C9A8D4",
    badgeText: "#3C3489",
  },
  {
    key: "venda" as ItemType,
    label: "Venda",
    icon: "pricetag-outline",
    desc: "Defina um preço e venda seu item",
    badge: "#F5C842",
    badgeText: "#412402",
  },
];

type Props = {
  navigation: any;
  route?: {
    params?: {
      mode?: "edit";
      itemId?: number;
    };
  };
};

export function PublishScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();

  const isEditMode = route?.params?.mode === "edit";
  const editItemId = route?.params?.itemId;

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState<ItemType | null>(null);
  const [price, setPrice] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [userItemCount, setUserItemCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIncentiveModal, setShowIncentiveModal] = useState(false);

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");

  const [uploading, setUploading] = useState(false);

  const fetchUserItemCount = async () => {
  const user = auth.currentUser;

  if (!user?.email) return;

  const { count, error } = await supabase
    .from("items")
    .select("*", { count: "exact", head: true })
    .eq("user_email", user.email);

  if (!error && count !== null) {
    setUserItemCount(count);
  }
};

  const salvarTitulo = (v: string) => { setTitle(v); salvar("draft_title", v); };
  const salvarCategoria = (v: string) => { setCategory(v); salvar("draft_category", v); };
  const salvarCondicao = (v: Condition) => { setCondition(v); salvar("draft_condition", v); };
  const salvarDescricao = (v: string) => { setDescription(v); salvar("draft_description", v); };

  const salvarTipo = (v: ItemType) => {
    setItemType(v);
    if (!isEditMode) salvar("draft_type", v);
    if (v !== "venda") setPrice("");
  };

  const salvarPreco = (v: string) => {
    const clean = v.replace(/[^0-9,]/g, "");
    setPrice(clean);
    if (!isEditMode) salvar("draft_price", clean);
  };

  const limparDadosEndereco = () => {
    setStreet(""); setNeighborhood(""); setCity(""); setState(""); setLocation("");
    salvar("draft_street", ""); salvar("draft_neighborhood", "");
    salvar("draft_city", ""); salvar("draft_state", ""); salvar("draft_location", "");
  };

  const salvarCep = (v: string) => {
    setCep(v);
    if (!isEditMode) salvar("draft_cep", v);
    if (v.length < 8) limparDadosEndereco();
  };

  const handleAddressFound = (address: CepResponse) => {
    const formattedLocation = address.bairro
      ? `${address.bairro}, ${address.localidade} - ${address.uf}`
      : `${address.localidade} - ${address.uf}`;

    setStreet(address.logradouro);
    setNeighborhood(address.bairro);
    setCity(address.localidade);
    setState(address.uf);
    setLocation(formattedLocation);

    if (!isEditMode) {
      salvar("draft_street", address.logradouro);
      salvar("draft_neighborhood", address.bairro);
      salvar("draft_city", address.localidade);
      salvar("draft_state", address.uf);
      salvar("draft_location", formattedLocation);
    }
  };

  const limparRascunho = async () => {
    await salvar("draft_title", "");
    await salvar("draft_category", "");
    await salvar("draft_condition", "");
    await salvar("draft_description", "");
    await salvar("draft_cep", "");
    await salvar("draft_street", "");
    await salvar("draft_neighborhood", "");
    await salvar("draft_city", "");
    await salvar("draft_state", "");
    await salvar("draft_location", "");
    await salvar("draft_type", "");
    await salvar("draft_price", "");
    await fetchUserItemCount();
  };

  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Autorize o acesso à câmera nas configurações.",
      );
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });
      if (!result.canceled && result.assets.length > 0) {
        setPhotos((prev) =>
          [...prev, { uri: result.assets[0].uri }].slice(0, 5),
        );
      }
    } catch {
      Alert.alert("Erro", "Não foi possível abrir a câmera. Tente novamente.");
    }
  };

  const abrirGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Autorize o acesso à galeria nas configurações.",
      );
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: 5 - photos.length,
        quality: 0.8,
      });
      if (!result.canceled) {
        const novasFotos = result.assets.map((a) => ({ uri: a.uri }));
        setPhotos((prev) => [...prev, ...novasFotos].slice(0, 5));
      }
    } catch {
      Alert.alert("Erro", "Não foi possível acessar a galeria.");
    }
  };

  const handleAddPhoto = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Cancelar", "Câmera", "Galeria"], cancelButtonIndex: 0 },
        (index) => {
          if (index === 1) abrirCamera();
          if (index === 2) abrirGaleria();
        },
      );
    } else {
      Alert.alert("Adicionar foto", "Escolha uma opção:", [
        { text: "Câmera", onPress: abrirCamera },
        { text: "Galeria", onPress: abrirGaleria },
        { text: "Cancelar", style: "cancel" },
      ]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const validar = () => {
    if (!title.trim()) { Alert.alert("Atenção!", "Adicione um título!"); return false; }
    if (!category) { Alert.alert("Atenção!", "Selecione uma categoria."); return false; }
    if (!condition) { Alert.alert("Atenção!", "Selecione a condição do item."); return false; }
    if (!itemType) { Alert.alert("Atenção!", "Selecione o tipo do item (Doação, Troca ou Venda)."); return false; }
    if (itemType === "venda" && !price.trim()) { Alert.alert("Atenção!", "Informe o preço do item."); return false; }
    if (description.trim().length < 20) { Alert.alert("Atenção!", "Descrição mínima de 20 caracteres."); return false; }
    if (!location.trim()) { Alert.alert("Atenção!", "Informe um CEP válido."); return false; }
    return true;
  };

  const handlePublish = async () => {
    if (!title.trim()) return Alert.alert("Atenção!", "Adicione um título!");
    if (!category) return Alert.alert("Atenção!", "Selecione uma categoria.");
    if (!condition) return Alert.alert("Atenção!", "Selecione a condição do item.");
    if (!itemType) return Alert.alert("Atenção!", "Selecione o tipo do item (Doação, Troca ou Venda).");
    if (itemType === "venda" && !price.trim()) return Alert.alert("Atenção!", "Informe o preço do item.");
    if (description.trim().length < 20) return Alert.alert("Atenção!", "Descrição mínima de 20 caracteres.");
    if (!location.trim()) return Alert.alert("Atenção!", "Informe um CEP válido.");

    setUploading(true);
    try {
      const firebaseUser = auth.currentUser;
      const userEmail = auth.currentUser?.email;

      if (!userEmail) {
        Alert.alert("Login necessário");
        return;
      }
      
      let imageUrls: string[] = [];
      if (photos.length > 0) {
        imageUrls = await uploadItemImages(
          photos.map((p) => p.uri),
          userEmail,
        );
      }

      await createItem({
        title: title.trim(),
        category,
        item_condition: condition!,
        description: description.trim(),
        location: location.trim(),
        user_email: userEmail,
        images: imageUrls,
        cep, street, neighborhood, city, state,
        item_type: itemType,
        price: itemType === "venda" ? price : null,
      });

      setPhotos([]); setTitle(""); setCategory(""); setCondition(null);
      setItemType(null); setPrice(""); setDescription(""); setCep("");
      setStreet(""); setNeighborhood(""); setCity(""); setState(""); setLocation("");
      await limparRascunho();
      setShowSuccessModal(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível publicar: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!validar()) return;
    if (!editItemId) return;
    setUploading(true);
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) { Alert.alert("Login necessário"); return; }

      const fotosNovas = photos.filter((p) => !p.uri.startsWith("http"));
      const fotosExistentes = photos.filter((p) => p.uri.startsWith("http")).map((p) => p.uri);

      let novasUrls: string[] = [];
      if (fotosNovas.length > 0) {
        novasUrls = await uploadItemImages(fotosNovas.map((p) => p.uri), userEmail);
      }

      await updateItem(editItemId, {
        title: title.trim(),
        category,
        item_condition: condition!,
        description: description.trim(),
        location: location.trim(),
        images: [...fotosExistentes, ...novasUrls],
        cep, street, neighborhood, city, state,
        item_type: itemType,
        price: itemType === "venda" ? price : null,
      });

      Alert.alert("Salvo!", "Item atualizado com sucesso.", [
        { text: "OK", onPress: () => navigation?.goBack() },
      ]);
    } catch (error) {
      console.error("❌ Erro ao publicar item:", error);
      const errorMsg = error instanceof Error ? error.message : "Erro desconhecido";
      if (errorMsg.includes("RLS") || errorMsg.includes("row-level security")) {
        Alert.alert("Erro de Segurança", "O banco de dados está bloqueando a publicação. Contate o suporte.");
      } else if (errorMsg.includes("authentication")) {
        Alert.alert("Erro de Autenticação", "Você precisa estar logado para publicar um item.");
      } else {
        Alert.alert("Erro", `Não foi possível publicar: ${errorMsg}`);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loadingItem) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#342A2A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 140 }}>

      {/* NavBar */}
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.navTitle}>Publicar Item</Text>
      </View>
  
          <JourneyCard userItemCount={userItemCount} />

      <IncentiveCard
        userItemCount={userItemCount}
        onPublish={() => navigation?.goBack()}
      />

      {/* Fotos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fotos do Item</Text>
        <Text style={styles.cardSubtitle}>Adicione até 5 fotos do seu item. A primeira será a foto de capa.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {photos.map((p, i) => (
            <View key={i} style={styles.photoThumb}>
              <Image source={{ uri: p.uri }} style={styles.thumbImg} />
              {i === 0 && (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverBadgeText}>Capa</Text>
                </View>
              )}
              <TouchableOpacity style={styles.removeBtn} onPress={() => removePhoto(i)}>
                <Text style={{ color: "#fff", fontSize: 12 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 5 && (
            <TouchableOpacity style={styles.addPhotoBtn} onPress={handleAddPhoto}>
              <Ionicons name="camera-outline" size={28} color="#888780" />
              <Text style={styles.addPhotoText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detalhes do Item</Text>

        <Text style={styles.label}>Título <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Cadeira de escritório ergonômica"
          value={title}
          onChangeText={salvarTitulo}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Categoria <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.inputDropdown} onPress={() => setShowCategoryModal(true)} activeOpacity={0.7}>
          <Text style={[styles.inputDropdownField, !category && { color: "#aaa" }]}>
            {category || "Selecione..."}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#888780" />
        </TouchableOpacity>

        <Text style={styles.label}>Condição <Text style={styles.required}>*</Text></Text>
        <View style={styles.conditionGrid}>
          {(["Novo","Usado • Como novo","Usado • Bom estado","Usado • Estado Regular"] as Condition[]).map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.conditionBtn, condition === c && styles.conditionBtnActive]}
              onPress={() => salvarCondicao(c)}
            >
              <Text style={[styles.conditionText, condition === c && styles.conditionTextActive]}>
                {c === "Novo" ? "Novo"
                  : c === "Usado • Como novo" ? "Usado -\nComo Novo"
                  : c === "Usado • Bom estado" ? "Usado -\nBom Estado"
                  : "Usado - Estado\nRegular"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Tipo <Text style={styles.required}>*</Text></Text>
        <TouchableOpacity style={styles.inputDropdown} onPress={() => setShowTypeModal(true)} activeOpacity={0.7}>
          <Text style={[styles.inputDropdownField, !itemType && { color: "#aaa" }]}>
            {itemType === "doacao" ? "Doação"
              : itemType === "troca" ? "Troca"
              : itemType === "venda" ? "Venda"
              : "Selecione..."}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#888780" />
        </TouchableOpacity>

        {itemType === "venda" && (
          <>
            <Text style={styles.label}>Preço <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputRow}>
              <Text style={styles.pricePrefix}>R$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0,00"
                value={price}
                onChangeText={salvarPreco}
                keyboardType="decimal-pad"
                placeholderTextColor="#aaa"
              />
            </View>
          </>
        )}

        <Text style={styles.label}>Descrição <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          placeholder="Descreva o item, suas características"
          value={description}
          onChangeText={salvarDescricao}
          multiline
          placeholderTextColor="#aaa"
        />
        <Text style={styles.charCount}>Mínimo 20 caracteres ({description.length}/20)</Text>

        <Text style={styles.label}>Localização <Text style={styles.required}>*</Text></Text>
        <CepInput onCepChange={salvarCep} onAddressFound={handleAddressFound} />
        {location ? (
          <View style={[styles.inputRow, { marginTop: 12 }]}>
            <Ionicons name="location-outline" size={16} color="#888780" style={{ marginRight: 8 }} />
            <Text style={styles.inputRowField}>{location}</Text>
          </View>
        ) : (
          <Text style={styles.charCount}>Digite um CEP válido para preencher a localização aproximada.</Text>
        )}
      </View>

      {/* Dica */}
      <View style={styles.tipBox}>
        <Text style={styles.tip}>
          <Text style={styles.tipBold}>Dica:</Text> Itens com fotos claras e descrições detalhadas têm até 3x mais chances de serem doados rapidamente!
        </Text>
      </View>

      {/* Botão publicar */}
      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>Publicar Item</Text>}
      </TouchableOpacity>

        {!isEditMode && (
          <Text style={styles.terms}>
            Ao publicar, você concorda com nossos{" "}
            <Text style={styles.termsLink}>Termos de Uso</Text>
          </Text>
        )}

      {/* ── Modal Categoria ── */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryModal(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Selecione a categoria</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    category === item && styles.modalItemActive,
                  ]}
                  onPress={() => {
                    salvarCategoria(item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, category === item && styles.modalItemTextActive]}>
                    {item}
                  </Text>
                  {category === item && <Ionicons name="checkmark" size={16} color="#4A6741" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Modal Tipo ── */}
      <Modal
        visible={showTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTypeModal(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Tipo do item</Text>
            {TYPE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.typeModalItem,
                  itemType === opt.key && styles.typeModalItemActive,
                ]}
                onPress={() => {
                  salvarTipo(opt.key);
                  setShowTypeModal(false);
                }}
              >
                <View
                  style={[
                    styles.typeModalBadge,
                    { backgroundColor: opt.badge },
                  ]}
                >
                  <Ionicons
                    name={opt.icon as any}
                    size={22}
                    color={opt.badgeText}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.typeModalLabel, itemType === opt.key && styles.typeModalLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.typeModalDesc}>{opt.desc}</Text>
                </View>
                {itemType === opt.key && (
                  <Ionicons name="checkmark" size={18} color="#4A6741" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
}
