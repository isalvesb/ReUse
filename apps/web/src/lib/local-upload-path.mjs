export function localUploadSegments(segments) {
    if (!Array.isArray(segments) || segments.length !== 2) return null;
    const [folder, filename] = segments;
    if (!["items", "avatars"].includes(folder)
        || !/^[a-f0-9-]{36}\.(jpg|png|webp|gif)$/.test(filename)) return null;
    return { folder, filename, mime: { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" }[filename.split(".").at(-1)] };
}
