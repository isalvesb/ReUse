import Link from "next/link";
import SpriteImage from "@/components/SpriteImage";

export default function ProfileItemCard({
    id,
    name,
    category,
    condition,
    distance,
    type,
    price,
    image,
    eager = false,
}) {
    return (
        <Link href={`/produto/${id}`} className="block min-w-0 w-full sm:w-fit">
            <article className="w-full overflow-hidden rounded-2xl bg-reuse-cream shadow-sm sm:w-43.25">

                {/* IMAGEM */}
                <div className="relative aspect-square w-full sm:h-37.5 sm:aspect-auto">
                    <SpriteImage
                        src={image}
                        alt={name}
                        fill
                        sizes="(max-width: 639px) calc((100vw - 44px) / 2), 173px"
                        loading={eager ? "eager" : "lazy"}
                        className="object-cover"
                    />
                </div>

                {/* INFORMAÇÕES */}
                <div className="flex min-h-[190px] flex-col bg-reuse-white px-3 py-3">

                    {/* CATEGORIA */}
                    <p className="mb-2 text-[13px] font-medium leading-5 text-reuse-brown-light">
                        {category}
                    </p>

                    {/* NOME */}
                    <h3 className="text-base font-bold leading-5 text-reuse-brown">
                        {name}
                    </h3>

                    {/* CONDIÇÃO + DISTÂNCIA */}
                    <div className="mt-2 flex flex-col gap-1">
                        <p className="text-[13px] font-medium leading-5 text-reuse-brown-light">
                            {condition}
                        </p>

                        <p className="text-[13px] font-medium leading-5 text-reuse-brown-light">
                            {distance}
                        </p>
                    </div>

                    {/* TIPO + PREÇO */}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
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
