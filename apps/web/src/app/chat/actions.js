"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { consumeRateLimit } from "@/lib/rate-limit";
import {
  startConversation,
  sendChatMessage,
  listMessages,
  markConversationRead,
  chatQuery,
  messageInput,
} from "@/lib/chat-domain.mjs";
import { IntegrationError } from "@/lib/profile-domain.mjs";
async function actor() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  return { userId };
}
export async function sendMessage(_previousState, formData) {
  const user = await actor();
  const requested = String(formData.get("conversationId") || ""),
    itemId = String(formData.get("itemId") || "");
  let conversationId = requested,
    sent;
  try {
    messageInput({
      content: formData.get("message"),
      clientKey: formData.get("clientKey"),
    });
    if (!conversationId)
      conversationId = (
        await startConversation(prisma, user, { itemId }, consumeRateLimit)
      ).id;
    sent = await sendChatMessage(
      prisma,
      user,
      conversationId,
      {
        content: formData.get("message"),
        clientKey: formData.get("clientKey"),
      },
      consumeRateLimit,
    );
  } catch (e) {
    return {
      error:
        e instanceof IntegrationError
          ? e.message
          : "Não foi possível enviar. Tente novamente.",
      conversationId: requested || `new:${itemId}`,
    };
  }
  revalidatePath("/chat");
  revalidatePath("/notificacoes");
  return { sent: sent.id, conversationId };
}
export async function olderMessages(id, cursor) {
  return listMessages(
    prisma,
    await actor(),
    id,
    chatQuery(new URLSearchParams(cursor ? { cursor } : {})),
  );
}
export async function readConversation(id, messageId) {
  await markConversationRead(prisma, await actor(), id, {
    throughMessageId: messageId,
  });
  revalidatePath("/notificacoes");
}
