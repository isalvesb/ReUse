import Image from "next/image";
import { parseSpriteSource } from "@/lib/sprite";

const HORIZONTAL_POSITIONS = ["0%", "50%", "100%"];
const VERTICAL_POSITIONS = ["0%", "100%"];

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

    const zeroBasedPosition = sprite.position - 1;
    const column = zeroBasedPosition % 3;
    const row = Math.floor(zeroBasedPosition / 3);
    const dimensions = fill ? undefined : { width, height };

    return (
        <span
            role={alt ? "img" : undefined}
            aria-label={alt || undefined}
            aria-hidden={alt ? undefined : true}
            className={`${fill ? "absolute inset-0" : "inline-block"} ${className}`.trim()}
            style={{
                ...dimensions,
                backgroundImage: `url("${sprite.sheet}")`,
                backgroundPosition: `${HORIZONTAL_POSITIONS[column]} ${VERTICAL_POSITIONS[row]}`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "300% auto",
            }}
        />
    );
}
