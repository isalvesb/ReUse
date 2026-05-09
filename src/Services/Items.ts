import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system/legacy";

export type ItemPayload = {
  title: string;
  category: string;
  item_condition: string;
  description: string;
  location: string;
  user_email?: string;
  price?: string | null;
  size?: string;
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  images?: string[];
  item_type?: "doacao" | "troca" | "venda" | null;
};

export type Item = {
  id: number;
  title: string;
  category: string;
  item_condition: string;
  description: string;
  location: string;
  user_email: string | null;
  created_at: string;
  images: string[] | null;
  price: string | null;
  size: string | null;
  cep: string | null;
  street: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  item_type: "doacao" | "troca" | "venda" | null;
};

export async function uploadItemImages(
  uris: string[],
  userEmail: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  const safeEmail = userEmail.replace(/[@.]/g, "_");

  for (const uri of uris) {
    try {
      const fileName = `${safeEmail}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;

      console.log("📤 Iniciando upload:", fileName);

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const file = await fetch(uri);
      const blob = await file.blob();

      const { data, error } = await supabase.storage
      .from("item-images")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });

      if (error) {
        console.error("❌ Upload falhou:", error.message);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log("✅ Upload bem-sucedido:", data.path);

      const { data: publicUrlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrlData.publicUrl);
      console.log("✅ Imagem vinculada:", publicUrlData.publicUrl);
    } catch (err) {
      console.error("❌ Erro no upload:", err);
    }
  }

  console.log("📦 Total de imagens vinculadas:", uploadedUrls.length);
  return uploadedUrls;
}

export async function createItem(item: ItemPayload) {
  try {
    console.log("💾 Criando item com imagens:", item.images?.length ?? 0);

    const { data, error } = await supabase
      .from("items")
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao criar item:", error.message);
      console.error("Detalhes:", error.details);
      throw error;
    }

    console.log("✅ Item criado com ID:", data.id);
    console.log("✅ Imagens salvas:", data.images);
    return data as Item;
  } catch (error: any) {
    console.error("❌ Falha ao criar item:", error);
    throw new Error(`Falha ao criar item: ${error.message}`);
  }
}

export async function getItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Item[];
}

export async function getItemsByUser(userEmail: string) {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_email", userEmail)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Item[];
}

export async function getItemById(id: number) {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Item;
}