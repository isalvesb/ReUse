"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Check, Send, X } from "lucide-react";

const SUGGESTIONS = [
    "Resuma minha vitrine",
    "Como publicar um item?",
    "Pausar minhas ofertas ativas",
];

const WELCOME_MESSAGE = {
    role: "assistant",
    text: "Olá! Posso orientar sua publicação e ajudar a administrar as ofertas da sua vitrine.",
};

export default function ReuseAssistant() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([WELCOME_MESSAGE]);
    const [pendingConfirmation, setPendingConfirmation] = useState(null);
    const [sending, setSending] = useState(false);

    function addAssistantMessage(text) {
        setConversation((current) => [
            ...current,
            { role: "assistant", text },
        ]);
    }

    async function send(text, { confirmationToken = null, repeatUserMessage = true } = {}) {
        const cleanMessage = text.trim();
        if ((!cleanMessage && !confirmationToken) || sending) return;

        if (repeatUserMessage) {
            setConversation((current) => [
                ...current,
                { role: "user", text: cleanMessage },
            ]);
        }

        setMessage("");
        setPendingConfirmation(null);
        setSending(true);

        try {
            const response = await fetch("/api/assistente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    confirmationToken
                        ? { confirmationToken }
                        : { message: cleanMessage }
                ),
            });
            const data = await response.json();

            if (response.status === 401) {
                router.push("/login");
                return;
            }

            addAssistantMessage(
                data.response || data.error || "Não consegui responder agora."
            );

            if (data.requiresConfirmation) {
                setPendingConfirmation({
                    token: data.confirmationToken,
                });
            }

            if (data.action) {
                router.refresh();
            }
        } catch {
            addAssistantMessage("Não consegui me conectar. Tente novamente.");
        } finally {
            setSending(false);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        void send(message);
    }

    function cancelConfirmation() {
        setPendingConfirmation(null);
        addAssistantMessage("Tudo bem. Nenhuma oferta foi alterada.");
    }

    return (
        <section
            aria-labelledby="reuse-assistant-title"
            className="mx-auto mt-16 w-full max-w-[880px] rounded-[18px] border border-reuse-pink bg-reuse-white p-6 shadow-sm"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-reuse-cream text-reuse-brown">
                        <Bot aria-hidden="true" size={23} />
                    </span>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-reuse-beige">
                            ReUse com IBM Watson
                        </p>
                        <h2 id="reuse-assistant-title" className="mt-1 text-xl font-semibold text-reuse-brown">
                            Assistente da sua vitrine
                        </h2>
                    </div>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Disponível
                </span>
            </div>

            <div
                aria-live="polite"
                aria-busy={sending}
                className="mt-5 max-h-[300px] space-y-3 overflow-y-auto rounded-[14px] bg-reuse-cream/60 p-4"
            >
                {conversation.map((entry, index) => (
                    <div
                        key={`${entry.role}-${index}`}
                        className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <p
                            className={`max-w-[82%] rounded-[14px] px-4 py-3 text-sm leading-6 ${
                                entry.role === "user"
                                    ? "bg-reuse-brown text-reuse-white"
                                    : "border border-reuse-pink/70 bg-reuse-white text-reuse-brown-light"
                            }`}
                        >
                            {entry.text}
                        </p>
                    </div>
                ))}
                {sending && (
                    <p className="text-sm text-reuse-beige">Preparando resposta…</p>
                )}
            </div>

            {pendingConfirmation && (
                <div className="mt-4 rounded-[12px] border border-amber-300 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900">
                        Confirme para executar esta alteração na sua vitrine.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            disabled={sending}
                            onClick={() => void send("", {
                                confirmationToken: pendingConfirmation.token,
                                repeatUserMessage: false,
                            })}
                            className="inline-flex items-center gap-2 rounded-[10px] bg-reuse-brown px-4 py-2 text-sm font-medium text-reuse-white disabled:opacity-60"
                        >
                            <Check aria-hidden="true" size={16} />
                            Confirmar
                        </button>
                        <button
                            type="button"
                            disabled={sending}
                            onClick={cancelConfirmation}
                            className="inline-flex items-center gap-2 rounded-[10px] border border-reuse-brown/20 bg-white px-4 py-2 text-sm font-medium text-reuse-brown disabled:opacity-60"
                        >
                            <X aria-hidden="true" size={16} />
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Sugestões de mensagem">
                {SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        disabled={sending}
                        onClick={() => void send(suggestion)}
                        className="rounded-full border border-reuse-brown/15 bg-white px-3 py-2 text-xs font-medium text-reuse-brown-light transition hover:bg-reuse-cream disabled:opacity-60"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
                <label htmlFor="reuse-assistant-message" className="sr-only">
                    Mensagem para o assistente
                </label>
                <input
                    id="reuse-assistant-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Ex.: quero retomar minhas ofertas"
                    maxLength={500}
                    disabled={sending}
                    className="h-12 min-w-0 flex-1 rounded-[12px] border border-[#D1D5DC] bg-[#f7f7f7] px-4 text-sm outline-none focus:border-reuse-pink disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-reuse-brown px-5 text-sm font-medium text-reuse-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Send aria-hidden="true" size={17} />
                    Enviar
                </button>
            </form>

            <p className="mt-3 text-xs leading-5 text-reuse-beige">
                Ações que alteram ofertas exigem confirmação. Sem credenciais IBM, o fluxo local de demonstração permanece disponível.
            </p>
        </section>
    );
}
