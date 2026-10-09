import SpriteImage from "@/components/SpriteImage";
import { truncateCardText } from "@/lib/format";

export default function ProductCard({
    name,
    condition,
    distance,
    type,
    image,
}) {
    const displayName = truncateCardText(name, 38);
    const displayDistance = truncateCardText(distance, 24);

    return (
        <article className="flex self-stretch flex-col items-stretch justify-between sm:flex-row sm:items-center">
            {/* Imagem do produto */}
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-reuse-white sm:w-48 md:w-52 lg:w-56">
                <SpriteImage
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 208px, 224px"
                    className="object-contain"
                />
            </div>

            {/* Informações do produto */}
            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    <h3
                        className="mb-3 line-clamp-2 min-h-10 text-[clamp(0.875rem,2.8vw,1rem)] font-bold leading-5 text-[#342a2a]"
                        title={displayName !== name ? name : undefined}
                    >
                        {displayName}
                    </h3>

                    <p className="self-stretch justify-center text-stone-600 text-sm font-medium font-['Inter']">
                        {condition}
                    </p>

                    <p
                        className="self-stretch overflow-hidden whitespace-nowrap text-[clamp(0.75rem,2.4vw,0.8125rem)] font-medium text-stone-600"
                        title={displayDistance !== distance ? distance : undefined}
                    >
                        {displayDistance}
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
