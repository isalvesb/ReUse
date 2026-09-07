import Image from "next/image";
import { Send } from "lucide-react";

export default function ChatWindow({
    user,
    messages,
    message,
    setMessage,
    onSend,
}) {
    return (
        <section className="flex min-w-0 flex-1 flex-col">

            {/* ================= CABEÇALHO ================= */}

            <div className="flex h-[88px] shrink-0 items-center border border-reuse-brown/20 px-7 gap-2.5">

                <div className="h-[60px] w-[60px] overflow-hidden rounded-full">
                    <Image
                        src={user.image}
                        alt={user.name}
                        width={60}
                        height={60}
                        className="h-full w-full object-cover object-top"
                    />
                </div>

                <h1 className="ml-4.5 text-2xl font-bold">
                    {user.name}
                </h1>

            </div>

            {/* ================= ÁREA DAS MENSAGENS ================= */}

            <div className="relative flex-1 overflow-hidden bg-[#F2D5AB/20]">

                {/* DATA */}

                <div className="absolute left-1/2 top-[35px] -translate-x-1/2 text-[10px] text-reuse-brown">
                    31/08/2026
                </div>

                {/* MENSAGENS */}

                <div className="absolute inset-x-0 bottom-8 top-[145px]  overflow-y-auto px-[65px]">

                    <div className="flex min-h-full flex-col justify-end gap-3.5">

                        {messages.map((item) => (
                            <div
                                key={item.id}
                                className={`flex ${item.sender === "me"
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >

                                <div
                                    className={`max-w-[260px] rounded-2xl px-4 py-3 ${item.sender === "me"
                                        ? "bg-reuse-cream text-reuse-brown"
                                        : "bg-reuse-brown text-reuse-cream"
                                        }`}
                                >

                                    <p className="text-[13px] leading-[19px]">
                                        {item.text}
                                    </p>

                                    <span
                                        className={`mt-1 block text-[9px] ${item.sender === "me"
                                            ? "text-reuse-brown"
                                            : "text-reuse-brown"
                                            }`}
                                    >
                                        {item.time}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* ================= CAMPO DE ENVIO ================= */}

            <form
                onSubmit={onSend}
                className="flex h-[93px] shrink-0 items-center gap-3 border-t border-reuse-brown/20 bg-[#FBEFE0] px-6"
            >

                <input
                    type="text"
                    value={message}
                    onChange={(event) =>
                        setMessage(event.target.value)
                    }
                    placeholder="Digite sua mensagem..."
                    className="h-[47px] flex-1 rounded-full border border-reuse-brown/20 bg-reuse-white px-4 py-3 text-sm text-reuse-brown outline-none placeholder:text-reuse-brown/50 focus:border-reuse-pink"
                />

                <button
                    type="submit"
                    aria-label="Enviar mensagem"
                    className="flex h-[47px] w-[47px] shrink-0 items-center justify-center px-3.5 rounded-full bg-reuse-pink/50 text-reuse-brown transition hover:scale-105"
                >
                    <Send
                        size={20}
                        strokeWidth={1.7}
                        className="-rotate-[8deg]"
                    />
                </button>

            </form>

        </section>
    );
}