"use client";

import { useActionState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { sendMessage } from "./actions";

const initialState = { error: null };

export default function ChatThread({ conversation, viewerId }) {
    const [state, formAction, pending] = useActionState(sendMessage, initialState);
    const formRef = useRef(null);
    const bottomRef = useRef(null);

    const otherUser = conversation.buyerId === viewerId
        ? conversation.seller
        : conversation.buyer;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: "end" });
    }, [conversation.messages.length]);

    useEffect(() => {
        if (!state?.error) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <div className="flex flex-1 flex-col">

            {/* CABEÇALHO */}
            <div className="flex items-center gap-3 border-b border-reuse-pink p-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                        src={otherUser.avatarUrl || "/images/perfil/avatar.png"}
                        alt={otherUser.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </div>

                <div>
                    <p className="text-sm font-bold text-reuse-brown">
                        {otherUser.name}
                    </p>

                    <Link
                        href={`/produto/${conversation.item.id}`}
                        className="text-xs text-reuse-brown-light underline"
                    >
                        {conversation.item.title}
                    </Link>
                </div>
            </div>

            {/* MENSAGENS */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                {conversation.messages.map((message) => {
                    const isMine = message.senderId === viewerId;

                    return (
                        <div
                            key={message.id}
                            className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMine
                                ? "ml-auto bg-reuse-pink text-reuse-brown"
                                : "bg-reuse-cream text-reuse-brown"
                                }`}
                        >
                            {message.content}
                        </div>
                    );
                })}

                {conversation.messages.length === 0 && (
                    <p className="m-auto text-sm text-reuse-brown-light">
                        Envie a primeira mensagem para {otherUser.name}.
                    </p>
                )}

                <div ref={bottomRef} />
            </div>

            {/* FORMULÁRIO */}
            <form
                ref={formRef}
                action={formAction}
                className="flex items-center gap-2 border-t border-reuse-pink p-4"
            >
                <input type="hidden" name="conversationId" value={conversation.id} />

                <input
                    type="text"
                    name="content"
                    required
                    placeholder="Escreva uma mensagem..."
                    className="h-11 flex-1 rounded-3xl border border-[#D1D5DC] bg-[#f3f3f5] px-4 text-sm outline-none"
                />

                <button
                    type="submit"
                    disabled={pending}
                    aria-label="Enviar mensagem"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-reuse-brown text-reuse-white disabled:opacity-50"
                >
                    <Send size={18} />
                </button>
            </form>

            {state?.error && (
                <p className="px-4 pb-2 text-xs font-medium text-red-600">
                    {state.error}
                </p>
            )}
        </div>
    );
}
