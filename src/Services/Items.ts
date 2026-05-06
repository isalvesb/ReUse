import { supabase } from "../lib/supabase";
import * as FileSystem from "expo-file-system/legacy";

export type ItemPayload = {
  title: string;
  category: string;
  item_condition: string;
  description: string;
  location: string;
  user_email?: string;
  price?: string;
  size?: string;
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  images?: string[];
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
};

const SUPABASE_URL = "https://cpdwuulriyahlyhrmnuc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZHd1dWxyaXlhaGx5aHJtbnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTk4OTEsImV4cCI6MjA5MjM3NTg5MX0.syDEAVAzUx6ea7ij7Iy5DMjPpvdNMz4Go8bq0yqCwAs";

export async function uploadItemImages(
  uris: string[],
  userEmail: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const uri of uris) {
    try {
      const fileName = `${userEmail}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/item-images/${fileName}`;

      const result = await FileSystem.uploadAsync(uploadUrl, uri, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "apikey": SUPABASE_KEY,
          "Content-Type": "image/jpeg",
          "x-upsert": "false",
        },
      });

      console.log("Upload status:", result.status, result.body);

      if (result.status === 200 || result.status === 201) {
        const { data: publicUrlData } = supabase.storage
          .from("item-images")
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrlData.publicUrl);
        console.log("✅ Uploaded:", publicUrlData.publicUrl);
      } else {
        console.log("❌ Upload falhou:", result.status, result.body);
      }
    } catch (err) {
      console.log("❌ Erro:", err);
    }
  }

  return uploadedUrls;
}

export async function createItem(item: ItemPayload) {
  const { data, error } = await supabase
    .from("items")
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("❌ Erro ao criar item:", error);
    throw error;
  }

  return data as Item;
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