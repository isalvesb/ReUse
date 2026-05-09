import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system/legacy";

// ===================== TYPES =====================

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

// ===================== CREATE ITEM =====================

export async function createItem(item: ItemPayload) {
  const { data, error } = await supabase
    .from("items")
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("❌ Erro ao criar item:", error.message);
    throw error;
  }

  return data as Item;
}

// ===================== UPLOAD IMAGES =====================

export async function uploadItemImages(
  uris: string[],
  userEmail: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  const safeEmail = userEmail.replace(/[@.]/g, "_");

  for (const uri of uris) {
    try {
      const fileName = `${safeEmail}/${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}.jpg`;


      // 🔥 base64 correto
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const arrayBuffer = Uint8Array.from(atob(base64), (c) =>
        c.charCodeAt(0)
      );

      const { data, error } = await supabase.storage
        .from("item-images")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) {
        console.error("❌ Upload falhou:", error.message);
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrlData.publicUrl);

    } catch (err) {
      console.error("❌ Erro no upload:", err);
    }
  }

  return uploadedUrls;
}

// ===================== GET ITEMS =====================

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

export async function updateItem(id: number, item: Partial<ItemPayload>) {
  const { data, error } = await supabase
    .from("items")
    .update(item)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("❌ Erro ao atualizar item:", error.message);
    throw error;
  }

  return data as Item;
}