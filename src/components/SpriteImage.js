import Image from "next/image";
import { getSpriteCrop, parseSpriteSource } from "@/lib/sprite";

export default function SpriteImage({
    src,
    alt,
    fill = false,
    width,
    height,
    className = "",
    ...imageProps
}) {
    const sprite = parseSpriteSource(src);

    if (!sprite) {
        return (
            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                className={className}
                {...imageProps}
            />
        );
    }

    const crop = getSpriteCrop(sprite);
    const dimensions = fill ? undefined : { width, height };

    return (
        <span
            role={alt ? "img" : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true}
            className={`${fill ? "absolute inset-0" : "relative inline-block"} overflow-hidden ${className}`.trim()}
            style={dimensions}
        >
            {/*
              O viewBox mostra apenas a célula correspondente da prancha.
              Usamos slice para preencher a área sem exibir as fileiras vizinhas.
              Na prancha 6, as células não são quadradas: meet criava faixas
              na borda mostrando pedaços da célula ao lado.
              O recorte permanece proporcional, sem deformar o produto.
            */}
            <svg
                className="absolute inset-0 block h-full w-full overflow-hidden"
                viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`}
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                focusable="false"
            >
                <image
                    href={sprite.sheet}
                    x="0"
                    y="0"
                    width={crop.sheetWidth}
                    height={crop.sheetHeight}
                    preserveAspectRatio="none"
                />
            </svg>
        </span>
    );
}
