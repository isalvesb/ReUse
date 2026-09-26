import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { hasValidImageSignature } from "@/lib/image-signatures.mjs";
import {
    getImageExtension,
    getItemPhotoValidationError,
} from "@/lib/upload-constraints.mjs";

export class UploadValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "UploadValidationError";
    }
}

function validateImage(file) {
    const validationError = getItemPhotoValidationError([file]);
    if (validationError) throw new UploadValidationError(validationError);

    return getImageExtension(file.type);
}

function getSupabaseConfig() {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET;
    const values = [url, serviceRoleKey, bucket];

    if (values.some(Boolean) && !values.every(Boolean)) {
        throw new Error("A configuração do Supabase Storage está incompleta.");
    }

    return values.every(Boolean) ? { url, serviceRoleKey, bucket } : null;
}

function encodeStoragePath(value) {
    return value.split("/").map(encodeURIComponent).join("/");
}

async function uploadToSupabase(file, buffer, extension, config) {
    const objectPath = `items/${randomUUID()}.${extension}`;
    const endpoint = `${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodeStoragePath(objectPath)}`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            apikey: config.serviceRoleKey,
            Authorization: `Bearer ${config.serviceRoleKey}`,
            "Content-Type": file.type,
            "x-upsert": "false",
        },
        body: buffer,
        cache: "no-store",
    });

    if (!response.ok) {
        const detail = await response.text();
        console.error(
            `Falha no Supabase Storage (${response.status}):`,
            detail.slice(0, 160)
        );
        throw new Error("Não foi possível armazenar a imagem.");
    }

    return {
        provider: "supabase",
        storageKey: objectPath,
        url: `${config.url}/storage/v1/object/public/${encodeURIComponent(config.bucket)}/${encodeStoragePath(objectPath)}`,
    };
}

async function uploadLocally(buffer, extension) {
    const filename = `${randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "items");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(
        path.join(uploadDir, filename),
        buffer
    );
    return {
        provider: "local",
        storageKey: filename,
        url: `/uploads/items/${filename}`,
    };
}

export async function storeItemImage(file) {
    const extension = validateImage(file);
    const buffer = Buffer.from(await file.arrayBuffer());

    if (!hasValidImageSignature(buffer, file.type)) {
        throw new UploadValidationError("O conteúdo do arquivo não corresponde a uma imagem válida.");
    }

    const supabase = getSupabaseConfig();

    if (supabase) {
        return uploadToSupabase(file, buffer, extension, supabase);
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("Configure o Supabase Storage antes de publicar imagens em produção.");
    }

    return uploadLocally(buffer, extension);
}

export async function deleteStoredItemImage(storedImage) {
    if (storedImage.provider === "local") {
        const filename = path.basename(storedImage.storageKey);
        await unlink(
            path.join(process.cwd(), "public", "uploads", "items", filename)
        ).catch((error) => {
            if (error.code !== "ENOENT") throw error;
        });
        return;
    }

    if (storedImage.provider === "supabase") {
        const config = getSupabaseConfig();
        if (!config) return;

        const endpoint = `${config.url}/storage/v1/object/${encodeURIComponent(config.bucket)}/${encodeStoragePath(storedImage.storageKey)}`;
        const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
                apikey: config.serviceRoleKey,
                Authorization: `Bearer ${config.serviceRoleKey}`,
            },
            cache: "no-store",
        });

        if (!response.ok && response.status !== 404) {
            console.error(
                `Falha ao remover imagem órfã (${response.status}):`,
                (await response.text()).slice(0, 160)
            );
        }
    }
}
