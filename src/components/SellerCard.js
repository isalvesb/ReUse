import Image from "next/image";
import { MessageSquare } from "lucide-react";
import { FaStar } from "react-icons/fa";
import Button from "@/components/Button";

export default function SellerCard({
    name,
    image,
    itemsCount,
    rating,
}) {
    return (
        <div className="h-[166px] w-[343px] rounded-2xl bg-[#F3E8D2] px-4 py-7">

            {/* INFORMAÇÕES DO USUÁRIO */}
            <div className="flex items-center gap-3">

                {/* FOTO */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* NOME E AVALIAÇÃO */}
                <div>
                    <p className="text-base font-bold text-reuse-brown">
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

            </div>

            {/* BOTÃO */}
            <Button
                variant="secondary"
                className="mt-4 w-full rounded-[14px]"
            >
                <span className="flex items-center justify-center gap-2">
                    <MessageSquare size={16} />
                    <span>Conversar</span>
                </span>
            </Button>

        </div>
    );
}