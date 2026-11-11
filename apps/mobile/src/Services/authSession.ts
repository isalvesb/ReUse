import type { User } from "@supabase/supabase-js";
import { supabase, onLocalSignOut } from "../lib/supabase";
import { endSharedSession } from "../lib/profileApi";
let currentUser: User | null = null;
export async function loginComEmailSenha(email: string, senha: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: senha });
  if (error || !data.user) throw new Error("Não foi possível entrar. Verifique as credenciais e a conexão.");
  return data.user;
}
export function observarUsuarioLogado(callback: (user: User | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    callback(currentUser);
  });
  const unsubscribeLocal = onLocalSignOut(() => { currentUser = null; callback(null); });
  return () => { data.subscription.unsubscribe(); unsubscribeLocal(); };
}
export const buscarEmailUsuarioAtual = () => currentUser?.email ?? null;
export const logoutCompartilhado = endSharedSession;
