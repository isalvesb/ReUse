import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
    title,
    description,
    image,
    href,
}) {
    return (
        <Link href={href} className="group">
            <article className="relative h-64 overflow-hidden rounded-2xl">
                {/* Imagem */}
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 transition duration-300 group-hover:bg-black/40" />

                {/* Texto */}
                <div className="absolute bottom-0 left-0 p-6 text-reuse-white">
                    <h3 className="text-xl font-bold">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm">
                        {description}
                    </p>
                </div>
            </article>
        </Link>
    );
}
