import Image from "next/image";
import Link from "next/link";

export default function ProfileItemCard({
    id,
    name,
    condition,
    distance,
    type,
    price,
    image,
}) {
    return (
        <Link href={`/vitrine/${id}`} className="block">
            <article className="w-43.25 overflow-hidden rounded-2xl bg-reuse-cream shadow-sm">
                {/* IMAGEM */}
                <div className="relative h-37.5 w-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="173px"
                        className="object-cover"
                    />
                </div>

                {/* CONTEÚDO */}
                <div className="flex h-[149px] flex-col gap-2 bg-reuse-white px-3 py-3">
                    <h3 className="min-h-10 text-base font-bold leading-5 text-reuse-brown">
                        {name}
                    </h3>

                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] font-medium leading-5 text-reuse-brown-light">
                            {condition}
                        </p>

                        <p className="text-[13px] font-medium leading-5 text-reuse-brown-light">
                            {distance}
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${type === "Venda"
                                    ? "bg-[#ffe4a1] text-[#78350f]"
                                    : type === "Troca"
                                        ? "bg-[#e0c3fc] text-[#4a1d96]"
                                        : "bg-[#d9ead3] text-[#285430]"
                                }`}
                        >
                            {type}
                        </span>

                        {price && (
                            <strong className="text-[13px] font-bold text-reuse-brown">
                                {price}
                            </strong>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}