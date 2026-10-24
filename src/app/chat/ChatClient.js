"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { sendMessage } from "./actions";

const initialState = { error: null };

export default function ChatClient({ conversations, initialConversationId }) {
    const router = useRouter();
    const [selection, setSelection] = useState(null);
    const selectedConversationId = selection?.source === initialConversationId
        ? selection.id : initialConversationId;
    const [state, formAction, pending] = useActionState(sendMessage, initialState);

    useEffect(() => {
        const refresh = () => { if (!document.hidden && !pending) router.refresh(); };
        const timer = window.setInterval(refresh, 5000);
        window.addEventListener("focus", refresh);
        return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
    }, [router, pending]);

    const selectedConversation = useMemo(
        () => conversations.find(
            (conversation) => conversation.id === selectedConversationId
        ) || null,
        [conversations, selectedConversationId]
    );

    function selectConversation(conversationId) {
        const conversation = conversations.find(
            (item) => item.id === conversationId
        );

        if (!conversation) {
            return;
        }

        setSelection({ id: conversationId, source: initialConversationId });

        const search = conversationId.startsWith("new:")
            ? `itemId=${encodeURIComponent(conversation.itemId)}`
            : `conversationId=${encodeURIComponent(conversationId)}`;

        router.replace(`/chat?${search}`, { scroll: false });
    }

    return (
        <main className="mx-auto flex min-h-[640px] w-full max-w-7xl flex-col lg:flex-row">
            <ChatList
                conversations={conversations}
                selectedConversation={selectedConversationId}
                onSelectConversation={selectConversation}
            />

            <ChatWindow
                key={selectedConversationId}
                conversation={selectedConversation}
                formAction={formAction}
                pending={pending}
                error={
                    state?.conversationId === selectedConversationId
                        ? state.error
                        : null
                }
            />
        </main>
    );
}
