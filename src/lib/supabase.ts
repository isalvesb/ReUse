import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis do Supabase não configuradas no .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchStats(userId: string) {
  try {
    const { count: trocas, error: trocasError } = await supabase
      .from("trocas")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const { count: itens, error: itensError } = await supabase
      .from("itens")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const { data: avaliacoes, error: avaliacoesError } = await supabase
      .from("avaliacoes")
      .select("rating")
      .eq("to_user_id", userId);

    if (trocasError || itensError || avaliacoesError) {
      console.error("Erro ao buscar stats:", {
        trocasError,
        itensError,
        avaliacoesError,
      });

      return { trocas: 0, itens: 0, avaliacao: 0 };
    }

    const media =
      avaliacoes && avaliacoes.length > 0
        ? avaliacoes.reduce((acc, item) => acc + item.rating, 0) /
          avaliacoes.length
        : 0;

    return {
      trocas: trocas || 0,
      itens: itens || 0,
      avaliacao: Number(media.toFixed(1)),
    };
  } catch (error) {
    console.error("Erro geral:", error);
    return { trocas: 0, itens: 0, avaliacao: 0 };
  }
}