import { supabase, signOutLocally } from "./supabase";
import { fetchWithTimeout } from "./fetchWithTimeout";
import { apiBase } from "./profileApi";

export type AssistantItem = { id: string; title: string; status: string; updatedAt: string };
export type AssistantProposal = { intent: "PAUSAR" | "RETOMAR"; proposalToken: string; items: AssistantItem[] };
export type AssistantConfirmation = { intent: "PAUSAR" | "RETOMAR"; confirmationToken: string; item: AssistantItem; expiresAt: string; targetStatus: string };
export class AssistantApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function assistantRequest<T>(path: "messages" | "selection" | "confirm", input: unknown, retry = true): Promise<T> {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) throw new AssistantApiError(401, "Sessão encerrada. Entre novamente.");
  const response = await fetchWithTimeout(`${apiBase()}/api/v1/assistant/${path}`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify(input),
  }, 45000);
  if (response.status === 401 && retry) {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) return assistantRequest<T>(path, input, false);
  }
  if (response.status === 401) await signOutLocally();
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new AssistantApiError(response.status,
    result.error?.message || "Não foi possível concluir. Confira o anúncio antes de tentar novamente.");
  return result.data;
}
