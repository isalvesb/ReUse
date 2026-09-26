export function hasValidImageSignature(buffer, mimeType) {
    if (mimeType === "image/jpeg") {
        return buffer.length >= 3
            && buffer[0] === 0xff
            && buffer[1] === 0xd8
            && buffer[2] === 0xff;
    }

    if (mimeType === "image/png") {
        return buffer.length >= 8
            && buffer.subarray(0, 8).equals(
                Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
            );
    }

    if (mimeType === "image/webp") {
        return buffer.length >= 12
            && buffer.toString("ascii", 0, 4) === "RIFF"
            && buffer.toString("ascii", 8, 12) === "WEBP";
    }

    if (mimeType === "image/gif") {
        const signature = buffer.toString("ascii", 0, 6);
        return signature === "GIF87a" || signature === "GIF89a";
    }

    return false;
}
