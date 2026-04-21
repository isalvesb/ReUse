import { supabase } from "../lib/supabase";

export type ItemPayload = {
  title: string;
  category: string;
  item_condition: string;
  description: string;
  location: string;
  user_email?: string;
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
};

export async function createItem(item: ItemPayload) {
  const { data, error } = await supabase
    .from("items")
    .insert([item])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Item;
}

export async function getItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Item[];
}