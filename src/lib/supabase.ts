import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://cpdwuulriyahlyhrmnuc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZHd1dWxyaXlhaGx5aHJtbnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTk4OTEsImV4cCI6MjA5MjM3NTg5MX0.syDEAVAzUx6ea7ij7Iy5DMjPpvdNMz4Go8bq0yqCwAs';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchStats(userId: string) {
  try {
    // Trocas
    const { count: trocas, error: trocasError } = await supabase
      .from("trocas")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Itens
    const { count: itens, error: itensError } = await supabase
      .from("itens")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Avaliações
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
