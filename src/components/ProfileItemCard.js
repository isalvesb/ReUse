import Image from "next/image";
import Link from "next/link";

export default function ProfileItemCard({
    id,
    name,
    category,
    condition,
    distance,
    type,
    price,
    image,
}) {
    return (
        <Link href={`/produto/${id}`} className="block">
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
                    <div className="mt-auto flex items-center justify-between pt-3">
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