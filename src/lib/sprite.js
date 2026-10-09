const SPRITE_PATTERN = /^(\/images\/pranchas\/prancha[1-8]\.png)#sprite=([1-6])$/;

export function parseSpriteSource(source) {
    if (typeof source !== "string") return null;

    const match = source.match(SPRITE_PATTERN);
    if (!match) return null;

    return {
        sheet: match[1],
        position: Number(match[2]),
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
