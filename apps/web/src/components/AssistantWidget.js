"use client";

import { useRef, useState, useEffect } from "react";
import { Bot, Send, X } from "lucide-react";

const WELCOME_MESSAGE =
    "Oi, eu sou o assistente da ReUse. Posso pausar ou reativar suas ofertas, listar seus itens, marcar notificações como lidas, e tirar dúvidas sobre como usar a plataforma. O que você precisa?";

export default function AssistantWidget({ loggedIn, enabled }) {
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "assistant", text: WELCOME_MESSAGE },
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [messages, open]);

    if (!loggedIn || !enabled) {
        return null;
    }

    async function handleSend(event) {
        event.preventDefault();

        const text = input.trim();
        if (!text || sending) return;

        setMessages((current) => [...current, { sender: "user", text }]);
        setInput("");
        setSending(true);

        try {
            const response = await fetch("/api/orchestrate/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history, text }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Falha ao falar com o assistente.");
            }

            setHistory((current) => [
                ...current,
                { role: "user", content: text },
                { role: "assistant", content: data.reply },
            ]);
            setMessages((current) => [...current, { sender: "assistant", text: data.reply }]);
        } catch (error) {
            setMessages((current) => [
                ...current,
                {
                    sender: "assistant",
                    text: error.message || "O assistente virtual está indisponível no momento.",
                },
            ]);
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:bottom-6">
            {open && (
                <div className="flex h-[min(70vh,480px)] w-full flex-col overflow-hidden rounded-2xl bg-reuse-cream shadow-2xl sm:w-[360px]">
                    <div className="flex shrink-0 items-center justify-between gap-2 bg-reuse-brown px-4 py-3">
                        <div className="flex items-center gap-2 text-reuse-white">
                            <Bot size={20} strokeWidth={1.8} />
                            <span className="text-sm font-bold">Assistente ReUse</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Fechar assistente"
                            className="rounded-full p-1 text-reuse-white transition hover:bg-reuse-white/10 hover:text-reuse-pink"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
                        <div className="flex flex-col gap-2.5">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-[13px] leading-[19px] ${
                                            message.sender === "user"
                                                ? "bg-reuse-pink text-reuse-brown"
                                                : "bg-reuse-brown text-reuse-cream"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}

                            {sending && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl bg-reuse-brown px-3.5 py-2.5 text-[13px] text-reuse-cream">
                                        Digitando...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <form
                        onSubmit={handleSend}
                        className="flex shrink-0 items-center gap-2 border-t border-reuse-brown/20 bg-[#FBEFE0] p-3"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Digite sua mensagem..."
                            disabled={sending}
                            className="h-10 min-w-0 flex-1 rounded-full border border-reuse-brown/20 bg-reuse-white px-4 text-sm text-reuse-brown outline-none placeholder:text-reuse-brown/50 focus:border-reuse-pink"
                        />

                        <button
                            type="submit"
                            disabled={sending}
                            aria-label="Enviar mensagem"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-reuse-pink/50 text-reuse-brown transition hover:scale-105 disabled:opacity-50"
                        >
                            <Send size={18} strokeWidth={1.7} className="-rotate-[8deg]" />
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-label="Abrir assistente virtual"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-reuse-brown text-reuse-cream shadow-xl transition hover:scale-105"
            >
                {open ? <X size={24} /> : <Bot size={24} />}
            </button>
        </div>
    );
}
