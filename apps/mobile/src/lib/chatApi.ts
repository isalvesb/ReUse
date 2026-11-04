import { supabase, signOutLocally } from "./supabase";
import { fetchWithTimeout } from "./fetchWithTimeout";
export type Conversation = {
  id: string;
  itemId: string;
  itemTitle: string;
  itemStatus: string;
  role: string;
  participant: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  preview: string;
  lastActivity: string;
  unreadCount: number;
};
export type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  sender: "me" | "other";
};
export type Notice = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  itemId: string | null;
  conversationId: string | null;
};
export type Page<T> = {
  items: T[];
  nextCursor: string | null;
};
export class ChatApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function chatRequest(
  path: string,
  method = "GET",
  input?: unknown,
  retry = true,
): Promise<any> {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session)
    throw new ChatApiError(401, "Sessão encerrada. Entre novamente.");
  const response = await fetchWithTimeout(
    `${process.env.EXPO_PUBLIC_REUSE_API_URL}/api/v1${path}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      ...(input ? { body: JSON.stringify(input) } : {}),
    },
    15000,
  );
  if (response.status === 401 && retry) {
    const { data, error } = await supabase.auth.refreshSession();
    if (!error && data.session) return chatRequest(path, method, input, false);
  }
  if (response.status === 401) await signOutLocally();
  const result = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ChatApiError(
      response.status,
      result.error?.message || "Não foi possível atualizar. Tente novamente.",
    );
  return result.data;
}
const page = (cursor?: string | null) =>
  cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
export const conversations = (
  cursor?: string | null,
): Promise<Page<Conversation>> => chatRequest("/conversations" + page(cursor));
export const startConversation = (itemId: string): Promise<Conversation> =>
  chatRequest("/conversations", "POST", { itemId });
export const messages = (
  id: string,
  cursor?: string | null,
): Promise<
  Page<ChatMessage> & {
    conversation: Conversation;
  }
> => chatRequest(`/conversations/${id}/messages${page(cursor)}`);
export const sendMessage = (
  id: string,
  content: string,
  clientKey: string,
): Promise<ChatMessage> =>
  chatRequest(`/conversations/${id}/messages`, "POST", { content, clientKey });
export const readConversation = (id: string, throughMessageId: string) =>
  chatRequest(`/conversations/${id}/read`, "POST", { throughMessageId });
export const notifications = (
  cursor?: string | null,
): Promise<
  Page<Notice> & {
    unreadCount: number;
  }
> => chatRequest("/notifications" + page(cursor));
export const readNotification = (id: string) =>
  chatRequest(`/notifications/${id}/read`, "POST");
export const readAllNotifications = () =>
  chatRequest("/notifications/read", "POST");
export const messageKey = (
  id: string,
): Promise<{
  clientKey: string;
}> => chatRequest(`/conversations/${id}/messages/key`, "POST");
