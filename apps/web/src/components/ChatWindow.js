"use client";

import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import SpriteImage from "@/components/SpriteImage";
import { getAvatarSource } from "@/lib/sprite";

function formatTime(value) {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function formatDate(value) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

export default function ChatWindow({ conversation, formAction, pending, error }) {
    const messagesRef = useRef(null);
    const lastMessageId = conversation?.messages.at(-1)?.id;

    useEffect(() => {
        const area = messagesRef.current;
        if (area) {
            area.scrollTop = area.scrollHeight;
        }
    }, [conversation?.id, lastMessageId]);

    if (!conversation) {
        return (
            <section className="flex min-h-[540px] min-w-0 flex-1 items-center justify-center px-8 text-center text-reuse-brown-light">
                Selecione uma conversa ou abra um item da vitrine para enviar uma mensagem.
            </section>
        );
    }

    const lastMessage = conversation.messages.at(-1);
    const persistedConversationId = conversation.id.startsWith("new:")
        ? ""
        : conversation.id;

    return (
        <section className="flex h-[640px] min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex min-h-[88px] shrink-0 items-center gap-3 border-b border-reuse-brown/20 px-7 py-3">
                <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full">
                    <SpriteImage
                        src={getAvatarSource(conversation.image, conversation.avatarKey)}
                        alt={conversation.name}
                        width={60}
                        height={60}
                        className="h-full w-full object-cover object-top"
                    />
                </div>

                <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold text-reuse-brown">
                        {conversation.name}
                    </h1>
                    <p className="truncate text-sm text-reuse-brown-light">
                        {conversation.itemTitle}
                    </p>
                </div>
            </div>

            <div
                ref={messagesRef}
                className="relative min-h-0 flex-1 overflow-y-auto bg-[#F2D5AB]/20 px-5 py-8 md:px-16">
                {lastMessage && (
                    <p className="mb-7 text-center text-[11px] text-reuse-brown-light">
                        {formatDate(lastMessage.createdAt)}
                    </p>
                )}

                <div className="flex min-h-full flex-col justify-end gap-3.5">
                    {conversation.messages.map((item) => (
                        <div
                            key={item.id}
                            className={`flex ${item.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${item.sender === "me"
                                    ? "bg-reuse-cream text-reuse-brown"
                                    : "bg-reuse-brown text-reuse-cream"
                                }`}
                            >
                                <p className="whitespace-pre-wrap break-words text-[13px] leading-[19px]">
                                    {item.text}
                                </p>
                                <span className="mt-1 block text-right text-[9px] opacity-70">
                                    {formatTime(item.createdAt)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {conversation.messages.length === 0 && (
                        <p className="m-auto max-w-md text-center text-sm text-reuse-brown-light">
                            Esta conversa ainda não tem mensagens. Escreva abaixo para falar sobre o item.
                        </p>
                    )}
                </div>
            </div>

            <form
                action={formAction}
                className="flex min-h-[93px] shrink-0 flex-wrap items-center gap-3 border-t border-reuse-brown/20 bg-[#FBEFE0] px-6 py-4"
            >
                <input type="hidden" name="conversationId" value={persistedConversationId} />
                <input type="hidden" name="itemId" value={conversation.itemId} />

                <input
                    type="text"
                    name="message"
                    aria-label="Mensagem"
                    maxLength={1000}
                    required
                    autoComplete="off"
                    placeholder="Digite sua mensagem..."
                    className="h-[47px] min-w-0 flex-1 rounded-full border border-reuse-brown/20 bg-reuse-white px-4 py-3 text-sm text-reuse-brown outline-none placeholder:text-reuse-brown/50 focus:border-reuse-pink"
                />

                <button
                    type="submit"
                    disabled={pending}
                    aria-label="Enviar mensagem"
                    className="flex h-[47px] w-[47px] shrink-0 items-center justify-center rounded-full bg-reuse-pink/50 px-3.5 text-reuse-brown transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send size={20} strokeWidth={1.7} className="-rotate-[8deg]" />
                </button>

                {error && (
                    <p id="chat-message-error" role="alert" className="w-full text-sm font-medium text-red-600">
                        {error}
                    </p>
                )}
            </form>
        </section>
    );
}
