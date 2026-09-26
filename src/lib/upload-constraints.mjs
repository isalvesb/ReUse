export const ITEM_PHOTO_LIMITS = Object.freeze({
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024,
    maxTotalSize: 12 * 1024 * 1024,
});

export const ALLOWED_IMAGE_TYPES = Object.freeze({
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
});

export function getImageExtension(mimeType) {
    return ALLOWED_IMAGE_TYPES[mimeType] ?? null;
}

export function getItemPhotoValidationError(files) {
    if (files.length > ITEM_PHOTO_LIMITS.maxFiles) {
        return `Adicione no máximo ${ITEM_PHOTO_LIMITS.maxFiles} imagens.`;
    }

    if (files.some((file) => !getImageExtension(file.type))) {
        return "Use imagens JPG, PNG, WebP ou GIF.";
    }

    if (files.some((file) => file.size > ITEM_PHOTO_LIMITS.maxFileSize)) {
        return "Cada imagem pode ter no máximo 5 MB.";
    }

    const totalSize = files.reduce((total, file) => total + file.size, 0);

    if (totalSize > ITEM_PHOTO_LIMITS.maxTotalSize) {
        return "As imagens podem somar no máximo 12 MB.";
    }

    return null;
}
