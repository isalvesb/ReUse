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
import { IncentiveCard } from "../../components/IncentiveCard";
import { CepInput } from "../../components/CepInput";
import { CepResponse } from "../../Services/Cep";
import { createItem } from "../../Services/Items";
import { buscarToken } from "../../Services/Auth";
import { DEV_SKIP_AUTH } from "../../config/devAuth";
import styles from "./styles";

type Condition = "novo" | "como_novo" | "bom_estado" | "regular";

interface PhotoItem {
  uri: string;
}

const MILESTONES = [
  { items: 1, label: "1 item" },
  { items: 3, label: "3 itens" },
  { items: 5, label: "5 itens" },
  { items: 10, label: "10 itens" },
];

const REWARDS = [
  {
    icon: "🌱",
    text: '1º Item: Badge "Iniciante Verde" + Acesso a dicas exclusivas',
    threshold: 1,
  },
  {
    icon: "🍃",
    text: "3 Itens: Destaque no perfil + Prioridade em itens premium",
    threshold: 3,
  },
  {
    icon: "🌿",
    text: "5 Itens: Badge exclusivo + Frete grátis",
    threshold: 5,
  },
];

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

export function PublishScreen({ navigation, userItemCount = 0 }: any) {
  const insets = useSafeAreaInsets();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [description, setDescription] = useState("");

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [location, setLocation] = useState("");

  const [uploading, setUploading] = useState(false);

  const salvarTitulo = (v: string) => {
    setTitle(v);
    salvar("draft_title", v);
  };

  const salvarCategoria = (v: string) => {
    setCategory(v);
    salvar("draft_category", v);
  };

  const salvarCondicao = (v: Condition) => {
    setCondition(v);
    salvar("draft_condition", v);
  };

  const salvarDescricao = (v: string) => {
    setDescription(v);
    salvar("draft_description", v);
  };

  const limparDadosEndereco = () => {
    setStreet("");
    setNeighborhood("");
    setCity("");
    setState("");
    setLocation("");

    salvar("draft_street", "");
    salvar("draft_neighborhood", "");
    salvar("draft_city", "");
    salvar("draft_state", "");
    salvar("draft_location", "");
  };

  const salvarCep = (v: string) => {
    setCep(v);
    salvar("draft_cep", v);

    if (v.length < 8) {
      limparDadosEndereco();
    }
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

    salvar("draft_street", address.logradouro);
    salvar("draft_neighborhood", address.bairro);
    salvar("draft_city", address.localidade);
    salvar("draft_state", address.uf);
    salvar("draft_location", formattedLocation);
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
    } catch (error) {
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
    } catch (error) {
      Alert.alert("Erro", "Não foi possível acessar a galeria.");
    }
  };

  const handleAddPhoto = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Câmera", "Galeria"],
          cancelButtonIndex: 0,
        },
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

  const handlePublish = async () => {
    if (!title.trim()) {
      return Alert.alert("Atenção!", "Adicione um título!");
    }

    if (!category) {
      return Alert.alert("Atenção!", "Selecione uma categoria.");
    }

    if (!condition) {
      return Alert.alert("Atenção", "Selecione a condição do item.");
    }

    if (description.trim().length < 20) {
      return Alert.alert("Atenção!", "Descrição mínima de 20 caracteres.");
    }

    if (!location.trim()) {
      return Alert.alert("Atenção!", "Informe um CEP válido.");
    }

    setUploading(true);

    try {
      const savedUserEmail = await buscarToken();

      const userEmail = DEV_SKIP_AUTH
        ? "dev@reuse.app"
        : (savedUserEmail ?? undefined);

      console.log("DEV_SKIP_AUTH:", DEV_SKIP_AUTH);
      console.log("Email usado na publicação:", userEmail);

      await createItem({
        title: title.trim(),
        category,
        item_condition: condition,
        description: description.trim(),
        location: location.trim(),
        user_email: userEmail,

        cep,
        street,
        neighborhood,
        city,
        state,
      });

      Alert.alert("Publicado!", "Seu item foi publicado com sucesso.", [
        {
          text: "OK",
          onPress: async () => {
            setPhotos([]);
            setTitle("");
            setCategory("");
            setCondition(null);
            setDescription("");

            setCep("");
            setStreet("");
            setNeighborhood("");
            setCity("");
            setState("");
            setLocation("");

            await limparRascunho();

            navigation?.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao publicar item:", error);
      Alert.alert("Erro", "Não foi possível publicar. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const carregarRascunho = async () => {
      const t = await buscar("draft_title");
      const cat = await buscar("draft_category");
      const cond = await buscar("draft_condition");
      const desc = await buscar("draft_description");

      const savedCep = await buscar("draft_cep");
      const savedStreet = await buscar("draft_street");
      const savedNeighborhood = await buscar("draft_neighborhood");
      const savedCity = await buscar("draft_city");
      const savedState = await buscar("draft_state");
      const savedLocation = await buscar("draft_location");

      if (t) setTitle(t);
      if (cat) setCategory(cat);
      if (cond) setCondition(cond as Condition);
      if (desc) setDescription(desc);

      if (savedCep) setCep(savedCep);
      if (savedStreet) setStreet(savedStreet);
      if (savedNeighborhood) setNeighborhood(savedNeighborhood);
      if (savedCity) setCity(savedCity);
      if (savedState) setState(savedState);
      if (savedLocation) setLocation(savedLocation);
    };

    carregarRascunho();
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ paddingBottom: 140 }}
    >
      <View style={[styles.navBar, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.navTitle}>Publicar Item</Text>
      </View>

      <View style={styles.journeyCard}>
        <View style={styles.journeyHeader}>
          <View>
            <Text style={styles.journeyTitle}>Sua Jornada Sustentável</Text>
            <Text style={styles.journeySubtitle}>
              Publique seu primeiro item!
            </Text>
          </View>

          <Ionicons name="trophy" size={28} color="#F5C542" />
        </View>

        <View style={styles.milestoneRow}>
          {MILESTONES.map((m) => {
            const done = userItemCount >= m.items;

            return (
              <View key={m.items} style={styles.milestoneItem}>
                <View
                  style={[
                    styles.milestoneIcon,
                    done
                      ? styles.milestoneIconDone
                      : styles.milestoneIconLocked,
                  ]}
                >
                  {done ? (
                    <Ionicons name="leaf" size={20} color="#FFFFFF" />
                  ) : (
                    <Ionicons name="lock-closed" size={20} color="#888780" />
                  )}
                </View>

                <Text
                  style={[
                    styles.milestoneLabel,
                    done && styles.milestoneLabelDone,
                  ]}
                >
                  {m.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <IncentiveCard />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fotos do Item</Text>
        <Text style={styles.cardSubtitle}>
          Adicione até 5 fotos do seu item. A primeira será a foto de capa.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 12 }}
        >
          {photos.map((p, i) => (
            <View key={i} style={styles.photoThumb}>
              <Image source={{ uri: p.uri }} style={styles.thumbImg} />

              {i === 0 && (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverBadgeText}>Capa</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removePhoto(i)}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          {photos.length < 5 && (
            <TouchableOpacity
              style={styles.addPhotoBtn}
              onPress={handleAddPhoto}
            >
              <Ionicons name="camera-outline" size={28} color="#888780" />
              <Text style={styles.addPhotoText}>Adicionar</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalhes do Item</Text>

        <Text style={styles.label}>
          Título <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Cadeira de escritório ergonômica"
          value={title}
          onChangeText={salvarTitulo}
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>
          Categoria <Text style={styles.required}>*</Text>
        </Text>

        <TouchableOpacity
          style={styles.inputDropdown}
          onPress={() => setShowCategoryModal(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.inputDropdownField, !category && { color: "#aaa" }]}
          >
            {category || "Selecione..."}
          </Text>

          <Ionicons name="chevron-down" size={16} color="#888780" />
        </TouchableOpacity>

        <Text style={styles.label}>
          Condição <Text style={styles.required}>*</Text>
        </Text>

        <View style={styles.conditionGrid}>
          {(["novo", "como_novo", "bom_estado", "regular"] as Condition[]).map(
            (c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.conditionBtn,
                  condition === c && styles.conditionBtnActive,
                ]}
                onPress={() => salvarCondicao(c)}
              >
                <Text
                  style={[
                    styles.conditionText,
                    condition === c && styles.conditionTextActive,
                  ]}
                >
                  {c === "novo"
                    ? "Novo"
                    : c === "como_novo"
                      ? "Usado -\nComo Novo"
                      : c === "bom_estado"
                        ? "Usado -\nBom Estado"
                        : "Usado - Estado\nRegular"}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        <Text style={styles.label}>
          Descrição <Text style={styles.required}>*</Text>
        </Text>

        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          placeholder="Descreva o item, suas características"
          value={description}
          onChangeText={salvarDescricao}
          multiline
          placeholderTextColor="#aaa"
        />

        <Text style={styles.charCount}>
          Mínimo 20 caracteres ({description.length}/20)
        </Text>

        <Text style={styles.label}>
          Localização <Text style={styles.required}>*</Text>
        </Text>

        <CepInput onCepChange={salvarCep} onAddressFound={handleAddressFound} />

        {location ? (
          <View style={[styles.inputRow, { marginTop: 12 }]}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#888780"
              style={{ marginRight: 8 }}
            />

            <Text style={styles.inputRowField}>{location}</Text>
          </View>
        ) : (
          <Text style={styles.charCount}>
            Digite um CEP válido para preencher a localização aproximada.
          </Text>
        )}
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tip}>
          <Text style={styles.tipBold}>Dica:</Text> Itens com fotos claras e
          descrições detalhadas têm até 3x mais chances de serem doados
          rapidamente!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.publishBtn}
        onPress={handlePublish}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.publishBtnText}>Publicar Item</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.terms}>
        Ao publicar, você concorda com nossos{" "}
        <Text style={styles.termsLink}>Termos de Uso</Text>
      </Text>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
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
                  <Text
                    style={[
                      styles.modalItemText,
                      category === item && styles.modalItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>

                  {category === item && (
                    <Ionicons name="checkmark" size={16} color="#4A6741" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}
