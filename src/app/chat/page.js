"use client";

import { useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";

const conversations = [
    {
        id: 1,
        name: "Cláudio Souza",
        image: "/images/avatars/claudio-souza.jpg",
        preview:
            "Olá! Vi seu anúncio da cadeira de madeira. Tenho interesse!",
    },
    {
        id: 2,
        name: "Paula Ferreira",
        image: "/images/avatars/paula-ferreira.jpg",
        preview:
            "Oi, Maria! Tenho disponibilidade sim, que horas seria melhor?",
    },
    {
        id: 3,
        name: "Mari Soares",
        image: "/images/avatars/mari-soares.jpg",
        preview:
            "Infelizmente não consigo hoje...",
    },

    {
        id: 4,
        name: "Paulo Silva",
        image: "/images/avatars/paulo-silva.jpg",
        preview:
            "Maria, você aceitaria trocar a cadeira por uma mesa de cabeç...",
    },

    {
        id: 5,
        name: "Iara Prado",
        image: "/images/avatars/iara-prado.jpg",
        preview:
            "Seria possível no sábado?",
    },

    {
        id: 6,
        name: "Luana Maranhão",
        image: "/images/avatars/luana-maranhao.jpg",
        preview:
            "Maria, minha filha amou os livros! Obrigada pela gentileza",
    },

    {
        id: 7,
        name: "Gabriel P.",
        image: "/images/avatars/gabriel-p..jpg",
        preview:
            "Valeu. Vou pensar um pouco e te falo",
    },

    {
        id: 8,
        name: "Daniel Matos",
        image: "/images/avatars/daniel-matos.jpg",
        preview:
            "Muito obrigada, Maria!",
    },

    {
        id: 9,
        name: "Cristina Martins",
        image: "/images/avatars/cristina-martins.jpg",
        preview:
            "Eu quem agradeço, Maria! Até",
    },
];

const initialMessages = [
    {
        id: 1,
        text: "Olá! Vi seu anúncio da cadeira de madeira. Tenho interesse!",
        time: "10:32",
        sender: "other",
    },
    {
        id: 2,
        text: "Você aceita trocar por uma cômoda?",
        time: "10:33",
        sender: "other",
    },
    {
        id: 3,
        text: "Olá, tudo certo? A cadeira está em excelente estado",
        time: "10:33",
        sender: "me",
    },
    {
        id: 4,
        text: "Então, Cláudio, não seria somente venda mesmo",
        time: "10:35",
        sender: "me",
    },
    {
        id: 5,
        text: "Ah, sem problemas, vou pensar um pouco mais e te retorno",
        time: "10:36",
        sender: "other",
    },
];

export default function ChatPage() {
    const [selectedConversation, setSelectedConversation] =
        useState(1);

    const [message, setMessage] = useState("");

    const [messages, setMessages] =
        useState(initialMessages);

    const selectedUser = conversations.find(
        (conversation) =>
            conversation.id === selectedConversation
    );

    function handleSend(event) {
        event.preventDefault();

        if (!message.trim()) return;

        setMessages((current) => [
            ...current,
            {
                id: Date.now(),
                text: message,
                time: new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                sender: "me",
            },
        ]);

        setMessage("");
    }

    return (
        <div className="min-h-screen bg-[#F9EEDC]">

            <Header loggedIn />

            <main className="flex w-full">

                <ChatList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelectConversation={setSelectedConversation}
                />

                <ChatWindow
                    user={selectedUser}
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    onSend={handleSend}
                />

            </main>

            <Footer />

        </div>
    );
}