import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";

export default ChatMessage() {
    return (
        <>
            <Header loggedIn />

            <main className="mx-auto min-h-[calc(100vh-200px)] max-w-4xl px-6 py-10">

// VOLTAR
                <Link
                    href="/"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-reuse-brown">

                    <ArrowLeft size={20} />
                    Voltar
                </Link>

                // CABEÇALHO DO CHAT
                <section className="overflow-hidden rounded-2xl border border-reuse-pink bg-reuse-white" >

                    <div className="flex items-center gap-4 border-b border-reuse-pink px-6 py-4">

                    // FOTO
                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                            <Image
                                src='/images/perfil/maria-silva.png || '
                                alt="Maria Silva"
                                fill
                                sizes=""
                                className="object-cover"
                            />
                        </div>

                    // NOME
                        <div>
                            <h1 className="text-base font-bold text-reuse-brown">
                                Maria Silva
                            </h1>

                            <p className="text-xs text-reuse-brown-light">
                                Anunciante
                            </p>
                        </div>

                    </div>

                    // MENSAGENS
                    <div className="flex min-h-[450px] flex-col gap-4 bg-reuse-white px-6 py-6">
                        <ChatMessage
                            message="Olá! Vi seu anúncio da cadeira de madeira.Tenho interesse!"
                            sender='user'
                        />

                        <ChatMessage
                            message="Oi! Claro 😊 Ela ainda está disponível."
                            sender="seller"
                        />

                        <ChatMessage
                            message="Você aceita trocar por uma cômoda?"
                            sender="user"
                        />

                        <ChatMessage
                            message="Então, Claáudio, não, seria somente venda mesmo."
                            sender='seller'
                        />

                        <ChatMessage
                            message='Ah, sem problemas, vou pensar um pouco mais e te retorno'
                            sender='user'
                        />


                    </div>
                </section>

            </main>

        </>
    )
}