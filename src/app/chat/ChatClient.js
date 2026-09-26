"use client";

import { useActionState, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";
import { sendMessage } from "./actions";

const initialState = { error: null };

export default function ChatClient({ conversations, initialConversationId }) {
    const router = useRouter();
    const [selectedConversationId, setSelectedConversationId] = useState(
        initialConversationId
    );
    const [state, formAction, pending] = useActionState(sendMessage, initialState);

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

        setSelectedConversationId(conversationId);

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
