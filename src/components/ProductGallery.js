import Image from "next/image";

export default function ProductGallery({
    mainImage,
    mainAlt,
    thumbnails = [],
}) {
    return (
        <section className="min-w-0">

            {/* IMAGEM PRINCIPAL */}
            <div className="relative h-[300px] w-full max-w-[487px] overflow-hidden rounded-xl">
                <Image
                    src={mainImage}
                    alt={mainAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="eager"
                    className="object-cover"
                />
            </div>

            {/* MINIATURAS */}
            <div className="mt-3 flex gap-2">

                {thumbnails.map((image, index) => (
                    <div
                        key={index}
                        className="relative h-12 w-12 overflow-hidden rounded-md"
                    >
                        <Image
                            src={image}
                            alt={`${mainAlt} - imagem ${index + 1}`}
                            fill
                            sizes="48px"
                            className="object-cover"
                        />
                    </div>
                ))}

            </div>

        </section>
    );
}
