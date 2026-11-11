import { Text } from "../../design/Text";
import { colors, font, tokens, radius } from "../../design/tokens";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase";
import { itemRequest, uploadPhoto } from "../../lib/itemWriteApi";
import {
  readCategories,
  Category,
  TYPE_LABELS,
  CONDITION_LABELS,
} from "../../lib/catalogApi";
import { JourneyCard } from "../../components/JourneyCard";
import styles from "./styles";
import { publishDraftKey, draftPhotoReference } from "../../lib/publishDraft";
type Photo = {
  uri: string;
  type: string;
  size: number;
  imageId?: string;
  uploadId?: string;
};
type Draft = {
  title: string;
  description: string;
  category: string;
  type: string;
  condition: string;
  price: string;
  location: string;
  photos: Photo[];
  creationKey: string;
  status: string;
};
const blank = (): Draft => ({
  title: "",
  description: "",
  category: "",
  type: "",
  condition: "",
  price: "",
  location: "",
  photos: [],
  creationKey: "",
  status: "ATIVO",
});
export function PublishScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets(),
    id = route?.params?.itemId as string | undefined;
  const [draft, setDraft] = useState<Draft>(blank),
    [categories, setCategories] = useState<Category[]>([]),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [version, setVersion] = useState(""),
    [count, setCount] = useState(0);
  const saveQueue = useRef(Promise.resolve());
  const key = useRef(""),
    directory = useRef(""),
    draftRef = useRef(draft);
  draftRef.current = draft;
  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(async (session) => {
        const subject = session.data.session?.user.id;
        if (!subject) throw Error("Entre novamente.");
        key.current = publishDraftKey(subject);
        directory.current = `${FileSystem.documentDirectory}reuse-drafts/${subject}/`;
        await FileSystem.makeDirectoryAsync(directory.current, {
          intermediates: true,
        });
        let value = blank();
        if (id) {
          const item = await itemRequest(
            `/me/items?id=${encodeURIComponent(id)}`,
          );
          value = {
            ...value,
            ...item,
            category: item.category.slug,
            photos: item.photos.map((p: any) => ({
              imageId: p.id,
              uri: p.preview.startsWith("/")
                ? process.env.EXPO_PUBLIC_REUSE_API_URL + p.preview
                : p.preview,
              type: "image/jpeg",
              size: 0,
            })),
            price: item.price || "",
            location: item.location || "",
          };
          if (active) setVersion(item.updatedAt);
        } else {
          const saved = await AsyncStorage.getItem(key.current);
          if (saved) value = JSON.parse(saved);
        }

        const cached = await AsyncStorage.getItem("reuse:categories:v1");
        if (active) {
          setDraft(value);
          setReady(true);
          if (cached) setCategories(JSON.parse(cached));
        }
        readCategories()
          .then((cats) => {
            if (active) setCategories(cats);
            return AsyncStorage.setItem(
              "reuse:categories:v1",
              JSON.stringify(cats),
            );
          })
          .catch(() => {
            if (active)
              setError(
                "Sem conexão com o catálogo. O rascunho local foi preservado.",
              );
          });
        itemRequest("/me/items")
          .then((items) => {
            if (active) setCount(items.length);
          })
          .catch(() => {});
      })
      .catch(() => {
        if (active)
          setError(
            "Não foi possível carregar o anúncio ou o rascunho. Volte e tente novamente.",
          );
      });
    return () => {
      active = false;
    };
  }, [id]);
  const change = (patch: Partial<Draft>) => {
    const next = { ...draftRef.current, ...patch };
    draftRef.current = next;
    setDraft(next);
    if (!id && key.current)
      saveQueue.current = saveQueue.current
        .then(() => AsyncStorage.setItem(key.current, JSON.stringify(next)))
        .catch(() => {
          setError("Não foi possível salvar o rascunho neste aparelho.");
        });
  };
  async function pick(camera = false) {
    try {
      const permission = camera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError("Permita acesso às fotos ou à câmera para adicionar imagens.");
        return;
      }
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
        quality: 0.85,
        allowsMultipleSelection: !camera,
        selectionLimit: 5 - draft.photos.length,
      };
      const result = camera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled) return;
      const photos = [...draftRef.current.photos];
      for (const asset of result.assets) {
        const type = asset.mimeType || "image/jpeg";
        if (
          !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(type)
        )
          throw Error("Use JPG, PNG, WebP ou GIF.");
        const size =
          asset.fileSize || (await (await fetch(asset.uri)).blob()).size;
        if (size > 5242880) throw Error("Cada foto pode ter no máximo 5 MB.");
        if (photos.length >= 5) throw Error("Adicione no máximo cinco fotos.");
        const filename = asset.uri
          .split("/")
          .pop()!
          .replace(/[^a-zA-Z0-9.-]/g, "");
        const uri = directory.current + Date.now() + "-" + filename;
        await FileSystem.copyAsync({ from: asset.uri, to: uri });
        photos.push({ uri, type, size });
      }
      if (photos.reduce((n, p) => n + p.size, 0) > 12582912)
        throw Error("As fotos podem somar até 12 MB.");
      change({ photos });
      setError("");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível abrir a câmera ou selecionar fotos.",
      );
    }
  }
  function choosePhoto() {
    if (Platform.OS === "ios")
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancelar", "Tirar foto", "Escolher fotos"],
          cancelButtonIndex: 0,
        },
        (v) => {
          if (v) void pick(v === 1);
        },
      );
    else
      Alert.alert("Adicionar foto", "Escolha a origem", [
        { text: "Câmera", onPress: () => void pick(true) },
        { text: "Galeria", onPress: () => void pick(false) },
        { text: "Cancelar" },
      ]);
  }
  async function save() {
    if (busy || !ready) return;
    setBusy(true);
    setError("");
    try {
      if (
        !draft.title.trim() ||
        draft.description.trim().length < 20 ||
        !draft.category ||
        !draft.type ||
        !draft.condition ||
        !draft.photos.length
      )
        throw Error(
          "Preencha os campos e adicione pelo menos uma foto. Descrição mínima: 20 caracteres.",
        );
      if (!id && !draft.creationKey) {
        const created = await itemRequest("/me/items", "POST");
        change({ creationKey: created.creationKey });
      }
      const photos = [...draft.photos];
      for (let i = 0; i < photos.length; i++) {
        if (!photos[i].imageId && !photos[i].uploadId) {
          photos[i] = { ...photos[i], uploadId: await uploadPhoto(photos[i]) };
          change({ photos: [...photos] });
        }
      }
      const body = {
        title: draft.title,
        description: draft.description,
        category: draft.category,
        type: draft.type,
        condition: draft.condition,
        price: draft.type === "VENDA" ? draft.price.replace(",", ".") : null,
        location: draft.location,
        status: draft.status,
        photos: photos.map(draftPhotoReference),
        ...(id
          ? { updatedAt: version }
          : { creationKey: draftRef.current.creationKey }),
      };
      const item = await itemRequest(
        id ? `/items/${id}` : "/items",
        id ? "PATCH" : "POST",
        body,
      );
      if (!id) {
        await saveQueue.current;
        await AsyncStorage.removeItem(key.current);
        const empty = blank();
        draftRef.current = empty;
        setDraft(empty);
      }
      navigation.navigate("Product", { itemId: item.id });
    } catch (e) {
      setError(
        e instanceof Error && !/network|fetch|abort/i.test(e.message)
          ? e.message
          : "Falha de conexão. Os dados e fotos do rascunho foram preservados. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  const field = (
    label: string,
    name: keyof Draft,
    max: number,
    multiline = false,
  ) => (
    <View style={{ marginVertical: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={[
          styles.input,
          multiline ? { minHeight: 110 } : { minHeight: 48 },
        ]}
        maxLength={max}
        value={String(draft[name])}
        editable={!busy}
        multiline={multiline}
        onChangeText={(v) => change({ [name]: v })}
      />
    </View>
  );
  const choices = (
    label: string,
    name: keyof Draft,
    options: Record<string, string>,
  ) => (
    <View style={{ gap: 8, marginVertical: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {Object.entries(options).map(([v, text]) => (
          <Pressable
            key={v}
            accessibilityRole="button"
            accessibilityState={{ selected: draft[name] === v }}
            disabled={busy}
            onPress={() => change({ [name]: v })}
            style={{
              padding: 12,
              minHeight: 44,
              borderWidth: 1,
              borderColor: colors.text,
              borderRadius: radius.control,
              backgroundColor: draft[name] === v ? colors.accent : colors.background,
            }}
          >
            <Text>{text}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
  if (!ready)
    return (
      <View style={{ padding: 30, paddingTop: insets.top + 30 }}>
        {error ? <Text role="alert">{error}</Text> : <ActivityIndicator />}
      </View>
    );
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: insets.top + 20,
        paddingBottom: Math.max(insets.bottom, 12) + 140,
      }}
    >
      <JourneyCard userItemCount={count} />
      <Text
        style={{
          fontFamily: font.bold,
          fontSize: tokens.type.title,
          color: colors.text,
          marginVertical: 20,
        }}
      >
        {id ? "Editar anúncio" : "Publicar item"}
      </Text>
      <Text>De 1 a 5 fotos · até 5 MB cada e 12 MB no total</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
          marginVertical: 15,
        }}
      >
        {draft.photos.map((p, i) => (
          <View key={p.uri}>
            <Image
              source={{ uri: p.uri }}
              style={{ width: 90, height: 90, borderRadius: 12 }}
            />
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() =>
                change({ photos: draft.photos.filter((_, j) => j !== i) })
              }
              style={{ padding: 10 }}
            >
              <Text>Remover foto {i + 1}</Text>
            </Pressable>
          </View>
        ))}
      </View>
      {draft.photos.length < 5 && (
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={choosePhoto}
          style={{ padding: 16, borderWidth: 1, borderRadius: 14 }}
        >
          <Text>Adicionar foto</Text>
        </Pressable>
      )}
      {field("Título", "title", 120)}
      {choices(
        "Categoria",
        "category",
        Object.fromEntries(categories.map((c) => [c.slug, c.name])),
      )}
      {choices("Condição", "condition", CONDITION_LABELS)}
      {choices("Modalidade", "type", TYPE_LABELS)}
      {draft.type === "VENDA" && field("Preço", "price", 12)}
      {field("Descrição", "description", 3000, true)}
      {field("Localização pública (opcional)", "location", 160)}
      {id &&
        choices(
          "Estado",
          "status",
          ["ATIVO", "INATIVO"].includes(draft.status)
            ? { ATIVO: "Ativo", INATIVO: "Pausado" }
            : { [draft.status]: draft.status },
        )}
      {error && (
        <Text
          accessibilityRole="alert"
          style={{ color: colors.error, marginVertical: 15 }}
        >
          {error}
        </Text>
      )}
      {!id && (
        <Text>
          Rascunho privado salvo neste aparelho. Fotos locais só serão
          compartilhadas após a publicação.
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={() => void save()}
        style={{
          padding: 20,
          backgroundColor: colors.accent,
          borderRadius: radius.control,
          marginVertical: 20,
        }}
      >
        <Text style={{ fontFamily: font.bold, textAlign: "center" }}>
          {busy
            ? "Enviando e salvando..."
            : id
              ? "Salvar anúncio"
              : "Publicar anúncio"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
