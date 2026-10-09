const SPRITE_PATTERN = /^(\/images\/pranchas\/prancha[1-8]\.png)#sprite=([1-6])$/;

const SHEET_SIZE = { width: 1536, height: 1024 };
const STANDARD_COLUMNS = [
    { x: 4, width: 504 },
    { x: 516, width: 504 },
    { x: 1028, width: 504 },
];
const STANDARD_ROWS = [
    { y: 4, height: 504 },
    { y: 516, height: 504 },
];
const SHEET_ROWS = {
    "/images/pranchas/prancha6.png": [
        { y: 4, height: 466 },
        { y: 479, height: 541 },
    ],
};

export function parseSpriteSource(source) {
    if (typeof source !== "string") return null;

    const match = source.match(SPRITE_PATTERN);
    if (!match) return null;

    return {
        sheet: match[1],
        position: Number(match[2]),
    };
}

export function getSpriteCrop(sprite) {
    const zeroBasedPosition = sprite.position - 1;
    const column = zeroBasedPosition % 3;
    const row = Math.floor(zeroBasedPosition / 3);
    const columnGeometry = STANDARD_COLUMNS[column];
    const rowGeometry = (SHEET_ROWS[sprite.sheet] || STANDARD_ROWS)[row];

    return {
        sheetWidth: SHEET_SIZE.width,
        sheetHeight: SHEET_SIZE.height,
        x: columnGeometry.x,
        y: rowGeometry.y,
        width: columnGeometry.width,
        height: rowGeometry.height,
    };
}

export function getDefaultAvatarSource(stableKey = "") {
    const normalizedKey = String(stableKey).trim().toLowerCase() || "reuse";
    let hash = 0;

    for (let index = 0; index < normalizedKey.length; index += 1) {
        hash = (hash * 31 + normalizedKey.charCodeAt(index)) >>> 0;
    }

    return `/images/pranchas/prancha8.png#sprite=${(hash % 6) + 1}`;
}

export function getAvatarSource(avatarUrl, stableKey) {
    return avatarUrl || getDefaultAvatarSource(stableKey);
}
