import Image from "next/image";
import { Archive, CheckCheck } from "lucide-react";

export default function ChatList({
    conversations,
    selectedConversation,
    onSelectConversation,
}) {
    return (
        <aside className="w-[457px] shrink-0 border-r border-reuse-brown/20  bg-[#F9EEDC] px-8 pt-[54px]">
            <div className="flex h-full flex-col">

                {/* LISTA DE CONVERSAS */}
                <div className="flex-1 space-y-6 overflow-hidden mb-4">

                    {conversations.map((conversation) => {
                        const isSelected =
                            selectedConversation === conversation.id;

                        return (
                            <button
                                key={conversation.id}
                                type="button"
                                onClick={() =>
                                    onSelectConversation(conversation.id)
                                }
                                className={`flex w-full items-center gap-4 rounded-[15px] px-3 py-3 text-left transition ${isSelected
                                    ? "bg-reuse-pink/50"
                                    : "bg-transparent hover:bg-[#F3E3D2]"
                                    }`}
                            >
                                {/* AVATAR */}
                                <div className="h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full">
                                    <Image
                                        src={conversation.image}
                                        alt={conversation.name}
                                        width={60}
                                        height={60}
                                        className="h-full w-full object-cover object-top"
                                    />
                                </div>

                                {/* INFORMAÇÕES */}
                                <div className="min-w-0 flex-1">

                                    <h2 className="text-xl font-bold leading-tight">
                                        {conversation.name}
                                    </h2>

                                    <div className="mt-2 flex items-start gap-2">

                                        <CheckCheck
                                            size={12}
                                            strokeWidth={1.5}
                                            className="mt-0.5 shrink-0 text-reuse-brown"
                                        />

                                        <p className="line-clamp-2 text-sm leading-4.5">
                                            {conversation.preview}
                                        </p>

                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* MENSAGENS ARQUIVADAS */}
                <button
                    type="button"
                    className="mb-8 mt-8 flex items-center justify-center gap-2 text-sm text-reuse-brown hover:opacity-70"
                >
                    <Archive
                        size={14}
                        strokeWidth={1.5}
                    />

                    Mensagens Arquivadas
                </button>

            </div>
        </aside>
    );
}