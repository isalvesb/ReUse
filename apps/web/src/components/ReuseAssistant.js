"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Check, Send, X } from "lucide-react";

const SUGGESTIONS = ["Como publicar uma doação?", "Quero pausar um anúncio meu", "Quero reativar um anúncio meu"];
const WELCOME = { role: "assistant", origin: "reuse", text: "Olá! Faça uma pergunta sobre o ReUse ou peça para pausar ou reativar um anúncio próprio. Você escolherá o anúncio e confirmará antes de qualquer alteração." };
export default function ReuseAssistant() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([WELCOME]);
  const [proposal, setProposal] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("unknown");
  async function request(path, input) {
    const response = await fetch(`/api/v1/assistant/${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input), signal: AbortSignal.timeout(45000),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const failure = new Error(result.error?.message || "Não foi possível concluir. Confira o anúncio antes de tentar novamente.");
      failure.status = response.status;
      if (response.status === 401) router.push("/login");
      throw failure;
    }
    return result.data;
  }
  async function run(operation) {
    if (busy) return;
    setBusy(true); setError("");
    try { await operation(); }
    catch (failure) {
      setError(failure.status ? failure.message : "Falha de conexão. O texto permanece disponível. Se você confirmou uma alteração, confira o anúncio antes de tentar novamente.");
      if (failure.status === 503) setOrigin("unavailable");
      if (failure.status === 409 || failure.status === 401) { setConfirmation(null); setProposal(null); }
    } finally { setBusy(false); }
  }
  async function send(text) {
    const clean = text.trim();
    if (!clean || busy) return;
    await run(async () => {
      const question = { role: "user", text: clean, status: "pending" };
      setConversation(current => [...current, question]);
      try {
        const data = await request("messages", { message: clean });
        setConversation(current => [...current.map(entry => entry === question ? { ...entry, status: "sent" } : entry), { role: "assistant", origin: "ibm", text: data.text }]);
        setOrigin("ibm"); setMessage(""); setProposal(data.proposal); setConfirmation(null);
      } catch (failure) {
        setMessage(clean);
        setConversation(current => current.map(entry => entry === question ? { ...entry, status: "failed" } : entry));
        throw failure;
      }
    });
  }
  async function select(itemId) {
    await run(async () => {
      setConfirmation(await request("selection", { proposalToken: proposal.proposalToken, itemId }));
      setProposal(null);
    });
  }
  async function decide(decision) {
    await run(async () => {
      const data = await request("confirm", { confirmationToken: confirmation.confirmationToken, decision });
      const text = data.cancelled ? "Solicitação cancelada. Nenhum anúncio foi alterado por esta confirmação." :
        `“${data.item.title}”: ${data.item.status === "INATIVO" ? "pausa" : "reativação"} persistida no ReUse.`;
      setConversation(current => [...current, { role: "assistant", origin: "reuse", text }]);
      setConfirmation(null); router.refresh();
    });
  }
  const control = "min-h-11 rounded-[var(--ds-radius-control)] border border-reuse-brown/30 px-4 py-2 text-sm text-reuse-brown transition hover:bg-reuse-cream disabled:opacity-60";
  return (
    <section aria-labelledby="reuse-assistant-title" className="mx-auto mt-16 w-full max-w-[880px] rounded-[18px] border border-reuse-pink bg-reuse-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-reuse-cream text-reuse-brown"><Bot aria-hidden="true" size={23} /></span>
          <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-reuse-brown-light">Assistente ReUse</p><h2 id="reuse-assistant-title" className="mt-1 text-xl font-semibold text-reuse-brown">Assistente da sua vitrine</h2></div>
        </div>
        <span aria-live="polite" className="rounded-full bg-reuse-cream px-3 py-1 text-xs font-medium text-reuse-brown-light">
          {origin === "ibm" ? "Resposta IBM verificada" : origin === "unavailable" ? "Assistente indisponível" : "IBM: aguardando primeira resposta"}
        </span>
      </div>
      <div aria-live="polite" aria-busy={busy} className="mt-5 max-h-[360px] space-y-3 overflow-y-auto rounded-[14px] bg-reuse-cream/60 p-4">
        {conversation.map((entry, index) => <div key={index} className={`flex ${entry.role === "user" ? "justify-end" : "justify-start"}`}>
          <p className={`max-w-[90%] whitespace-pre-wrap break-words rounded-[14px] px-4 py-3 text-sm leading-6 ${entry.role === "user" ? "bg-reuse-brown text-reuse-white" : "border border-reuse-pink/70 bg-reuse-white text-reuse-brown-light"}`}>
            <span className="mb-1 block text-xs font-semibold">{entry.role === "user" ? "Você" : entry.origin === "ibm" ? "IBM watsonx Orchestrate" : "ReUse"}</span>{entry.text}
            {entry.status === "pending" && <span className="mt-1 block text-xs">Enviando…</span>}
            {entry.status === "failed" && <span className="mt-1 block text-xs">Falha no envio. Tente novamente pelo campo de mensagem.</span>}
          </p>
        </div>)}
        {busy && <p className="text-sm text-reuse-brown-light">Aguarde…</p>}
      </div>
      {error && <p role="alert" className="mt-4 rounded-[var(--ds-radius-small)] border border-[var(--ds-colors-error)] p-3 text-sm text-[var(--ds-colors-error)]">{error}</p>}
      {proposal && <div className="mt-4 space-y-2" aria-label="Escolha um anúncio próprio">
        <p className="text-sm font-medium text-reuse-brown">Escolha um anúncio para {proposal.intent === "PAUSAR" ? "pausar" : "reativar"}:</p>
        {!proposal.items.length && <p className="text-sm">Nenhum anúncio próprio elegível.</p>}
        <div className="max-h-48 space-y-2 overflow-y-auto">{proposal.items.map(item => <button type="button" key={item.id} disabled={busy} onClick={() => void select(item.id)} className={`${control} block w-full text-left`}>{item.title}</button>)}</div>
      </div>}
      {confirmation && <div className="mt-4 rounded-[var(--ds-radius-small)] border border-reuse-pink bg-reuse-cream p-4">
        <p className="text-sm font-medium text-reuse-brown">{confirmation.intent === "PAUSAR" ? "Pausar" : "Reativar"} somente “{confirmation.item.title}”?</p>
        <p className="mt-1 text-xs text-reuse-brown-light">Confirmação válida por até cinco minutos, para este anúncio e esta sessão.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => void decide("confirm")} className={`${control} inline-flex items-center gap-2 bg-reuse-pink`}><Check aria-hidden="true" size={16} />Confirmar {confirmation.intent === "PAUSAR" ? "pausa" : "reativação"}</button>
          <button type="button" disabled={busy} onClick={() => void decide("cancel")} className={`${control} inline-flex items-center gap-2`}><X aria-hidden="true" size={16} />Cancelar</button>
        </div>
      </div>}
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Sugestões de mensagem">{SUGGESTIONS.map(text => <button key={text} type="button" disabled={busy} onClick={() => void send(text)} className={control}>{text}</button>)}</div>
      <form onSubmit={event => { event.preventDefault(); void send(message); }} className="mt-4 flex gap-3">
        <label htmlFor="reuse-assistant-message" className="sr-only">Mensagem para o assistente</label>
        <input id="reuse-assistant-message" value={message} onChange={event => setMessage(event.target.value)} placeholder="Ex.: como publicar uma doação?" maxLength={500} disabled={busy} className="min-h-12 min-w-0 flex-1 rounded-[var(--ds-radius-input)] border border-[var(--ds-colors-border)] bg-reuse-white px-4 text-sm text-reuse-brown disabled:opacity-60" />
        <button type="submit" disabled={busy || !message.trim()} className={`${control} inline-flex items-center gap-2 bg-reuse-pink`}><Send aria-hidden="true" size={17} /><span>Enviar</span></button>
      </form>
      <p className="mt-3 text-xs leading-5 text-reuse-brown-light">Trial acadêmico: use apenas dados fictícios, sem dados pessoais ou credenciais. Perguntas são independentes; o histórico desta tela não é enviado à IBM. Alterações exigem escolha e confirmação no ReUse.</p>
    </section>
  );
}
