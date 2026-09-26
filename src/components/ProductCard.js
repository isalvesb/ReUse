import Image from "next/image";

export default function ProductCard({
    name,
    condition,
    distance,
    type,
    image,
}) {
    return (
        <article className="flex self-stretch flex-col items-stretch justify-between sm:flex-row sm:items-center">
            {/* Imagem do produto */}
            <div className="relative h-44 w-full shrink-0 sm:w-80">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover rounded-2xl"
                />
            </div>

            {/* Informações do produto */}
            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    <h3 className="mb-3 text-lg font-bold leading-6 text-[#342a2a]">
                        {name}
                    </h3>

                    <p className="self-stretch justify-center text-stone-600 text-sm font-medium font-['Inter']">
                        {condition}
                    </p>

                    <p className="self-stretch justify-center text-stone-600 text-sm font-medium font-['Inter']">
                        {distance}
                    </p>
                </div>

                {/* Tipo de anúncio */}
                <span className="self-stretch justify-center text-stone-600 text-sm font-medium font-['Inter']">
                    {type}
                </span>
            </div>
        </article>
    );
}
