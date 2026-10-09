import SpriteImage from "@/components/SpriteImage";

export default function ProductGallery({
    mainImage,
    mainAlt,
    thumbnails = [],
    ribbonLabel,
    ribbonClasses = "",
}) {
    return (
        <section className="min-w-0">

            {/* IMAGEM PRINCIPAL */}
            <div className="relative aspect-square w-full max-w-[487px] overflow-hidden rounded-xl bg-reuse-white">
                <SpriteImage
                    src={mainImage}
                    alt={mainAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="eager"
                    className="object-contain"
                />
                {ribbonLabel && (
                    <span className={`pointer-events-none absolute left-[-52px] top-[25px] z-10 flex w-[188px] -rotate-45 items-center justify-center py-2 text-sm font-bold leading-none shadow-sm ${ribbonClasses}`}>
                        {ribbonLabel}
                    </span>
                )}
            </div>

            {/* MINIATURAS: aparecem somente quando há outras imagens para explorar. */}
            {thumbnails.length > 1 && (
            <div className="mt-3 flex gap-2">

                {thumbnails.map((image, index) => (
                    <div
                        key={index}
                        className="relative h-12 w-12 overflow-hidden rounded-md bg-reuse-white"
                    >
                        <SpriteImage
                            src={image}
                            alt={`${mainAlt} - imagem ${index + 1}`}
                            fill
                            sizes="48px"
                            className="object-contain"
                        />
                    </div>
                ))}

            </div>
            )}

        </section>
    );
}
