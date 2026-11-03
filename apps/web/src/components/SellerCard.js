import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Button from "@/components/Button";
import SpriteImage from "@/components/SpriteImage";
import { getAvatarSource } from "@/lib/sprite";

export default function SellerCard({
    name,
    image,
    itemsCount,
    rating,
    href,
    sellerId
}) {
    return (
        <div className="flex w-full flex-col gap-4 rounded-2xl border border-reuse-brown/10 bg-[#F3E8D2] p-4 sm:flex-row sm:items-center sm:justify-between">

            {/* INFORMAÇÕES DO USUÁRIO */}
            <Link
                href={`/perfil/${sellerId}`}
                className="flex min-w-0 items-center gap-3 rounded-lg transition hover:opacity-80 active:opacity-65">


                {/* FOTO */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <SpriteImage
                        src={getAvatarSource(image, sellerId)}
                        alt={name}
                        fill
                        sizes="48px"
                        className="object-cover"
                    />
                </div>

                {/* NOME E AVALIAÇÃO */}
                <div className="min-w-0">
                    <p className="break-words text-base font-bold text-reuse-brown">
                        {name}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-[#584C4C]">
                        <span>{itemsCount} itens publicados</span>

                        <span>•</span>

                        <FaStar
                            size={12}
                            color="yellow"
                            stroke="black"
                            strokeWidth={2}
                        />

                        <span>{rating}</span>
                    </div>
                </div>
            </Link>

            {/* BOTÃO */}
            <Button
                variant="secondary"
                href={href}
                className="w-full shrink-0 rounded-[14px] sm:w-auto sm:min-w-[135px]"
            >
                <span className="flex items-center justify-center gap-1">
                    <MessageSquare size={19} aria-hidden="true" />
                    <span className="text-sm">Conversar</span>
                </span>
            </Button>

        </div>
    );
}
