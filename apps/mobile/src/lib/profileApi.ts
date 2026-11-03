import { fetchWithTimeout } from "./fetchWithTimeout";
import { supabase, signOutLocally } from "./supabase";
export type SharedProfile = {
  id: string; name: string; email: string; location: string | null; bio: string | null;
  avatarUrl: string | null; rating: number; createdAt: string; updatedAt: string;
};
export class ProfileApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
function apiBase() {
  const value = process.env.EXPO_PUBLIC_REUSE_API_URL;
  if (!value) throw new Error("Configure o endereço da API do laboratório.");
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/"
    || (url.protocol !== "https:" && !(url.protocol === "http:" && __DEV__))) {
    throw new Error("Endereço da API inválido. Utilize HTTPS fora do desenvolvimento local.");
  }
  return url.origin;
}
async function request(path: string, init: RequestInit = {}, retry = true): Promise<any> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new ProfileApiError(401, "Entre novamente.");
  const response = await fetchWithTimeout(`${apiBase()}/api/v1${path}`, { ...init,
    headers: { "Content-Type": "application/json", ...init.headers, Authorization: `Bearer ${session.access_token}` },
  });
  if (response.status === 401 && retry) {
    const { error, data } = await supabase.auth.refreshSession();
    if (!error && data.session) return request(path, init, false);
  }
  if (response.status === 401) await signOutLocally();
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new ProfileApiError(response.status, result.error?.message ?? "Não foi possível acessar o perfil.");
  return result.data;
}
export function readMyProfile(): Promise<SharedProfile> { return request("/me"); }
export function editMyProfile(input: Pick<SharedProfile, "name" | "bio">): Promise<SharedProfile> {
  return request("/me", { method: "PATCH", body: JSON.stringify(input) });
}
export async function endSharedSession() {
  let remoteEnded = false;
  try { await request("/session/logout", { method: "POST" }); remoteEnded = true; }
  finally { await signOutLocally(); }
  return remoteEnded;
}
