"use client";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { sendMessage } from "./actions";
const initialState = { error: null };
async function submitChatMessage(previous, formData) {
  try {
    return await sendMessage(previous, formData);
  } catch (error) {
    if (
      typeof error?.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    )
      throw error;
    return {
      error:
        "Mensagem não confirmada. Tente novamente; o texto foi preservado.",
      conversationId: String(
        formData.get("conversationId") || `new:${formData.get("itemId")}`,
      ),
    };
  }
}
export default function ChatClient({
  conversations,
  initialConversationId,
  historyCursor,
  nextConversationCursor,
  initialClientKey,
}) {
  const router = useRouter();
  const [composing, setComposing] = useState(false);
  const [selection, setSelection] = useState(null);
  const selectedConversationId =
    selection?.source === initialConversationId
      ? selection.id
      : initialConversationId;
  const [state, formAction, pending] = useActionState(
    async (previous, formData) => {
      const result = await submitChatMessage(previous, formData);
      if (result?.sent) setComposing(false);
      return result;
    },
    initialState,
  );
  const [successId, setSuccessId] = useState("");
  if (state?.sent && successId !== state.sent) setSuccessId(state.sent);
  useEffect(() => {
    const refresh = () => {
      if (!document.hidden && !pending && !composing) router.refresh();
    };
    const timer = window.setInterval(refresh, 5000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [router, pending, composing]);
  useEffect(() => {
    if (state?.sent) {
      router.replace(`/chat?conversationId=${state.conversationId}`, {
        scroll: false,
      });
      router.refresh();
    }
  }, [state?.sent, state?.conversationId, router]);
  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId,
      ) || null,
    [conversations, selectedConversationId],
  );
  function selectConversation(conversationId) {
    setComposing(false);
    const conversation = conversations.find(
      (item) => item.id === conversationId,
    );
    if (!conversation) {
      return;
    }
    setSelection({
      id: conversationId,
      source: initialConversationId,
    });
    const search = conversationId.startsWith("new:")
      ? `itemId=${encodeURIComponent(conversation.itemId)}`
      : `conversationId=${encodeURIComponent(conversationId)}`;
    router.replace(`/chat?${search}`, { scroll: false });
  }
  return (
    <main className="mx-auto flex min-h-[640px] w-full max-w-7xl flex-col lg:flex-row">
      <ChatList
        nextCursor={nextConversationCursor}
        conversations={conversations}
        selectedConversation={selectedConversationId}
        onSelectConversation={selectConversation}
      />

      <ChatWindow
        key={`${selectedConversationId}:${successId}`}
        conversation={selectedConversation}
        formAction={formAction}
        pending={pending}
        historyCursor={historyCursor}
        initialClientKey={initialClientKey}
        onComposingChange={setComposing}
        error={
          state?.conversationId === selectedConversationId ? state.error : null
        }
      />
    </main>
  );
}
