import SpriteImage from "@/components/SpriteImage";
import { getAvatarSource } from "@/lib/sprite";

export default function ChatList({
    conversations,
    selectedConversation,
    onSelectConversation,
}) {
    return (
        <aside className="w-full shrink-0 border-b border-reuse-brown/20 bg-[#F9EEDC] px-5 py-6 lg:w-[390px] lg:border-b-0 lg:border-r lg:px-8 lg:pt-[54px]">
            <div className="flex h-full flex-col">

                {/* LISTA DE CONVERSAS */}
                <div className="flex-1 space-y-3 overflow-hidden">

                    {conversations.map((conversation) => {
                        const isSelected =
                            selectedConversation === conversation.id;

                        return (
                            <button
                                key={conversation.id}
                                type="button"
                                aria-pressed={isSelected}
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
                                    <SpriteImage
                                        src={getAvatarSource(conversation.image, conversation.avatarKey)}
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

                                    <div className="mt-2">
                                        <p className="line-clamp-2 text-sm leading-[18px]">
                                            {conversation.preview}
                                        </p>

                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {conversations.length === 0 && (
                        <p className="rounded-2xl bg-reuse-white/70 p-5 text-sm text-reuse-brown-light">
                            Você ainda não tem conversas. Abra um item da vitrine para falar com o anunciante.
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
}
