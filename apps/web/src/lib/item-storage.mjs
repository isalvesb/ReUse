import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { LAB_AUTH_URL } from "./lab-config.mjs";
import { IntegrationError } from "./profile-domain.mjs";
import {
  getItemPhotoValidationError,
  getImageExtension,
} from "./upload-constraints.mjs";
import { hasValidImageSignature } from "./image-signatures.mjs";
export const ITEM_BUCKET = "reuse-lab-items";
export function storageClient() {
  if (
    process.env.SUPABASE_AUTH_URL !== LAB_AUTH_URL ||
    !process.env.REUSE_STORAGE_SECRET?.startsWith("sb_secret_")
  )
    throw Error("Storage exclusivo do laboratório não configurado.");
  return createClient(LAB_AUTH_URL, process.env.REUSE_STORAGE_SECRET, {
    auth: { persistSession: false, autoRefreshToken: false },
  }).storage.from(ITEM_BUCKET);
}
export async function signPhoto(db, actor, input) {
  if (
    !input ||
    Object.keys(input).some((k) => !["type", "size"].includes(k)) ||
    !Number.isSafeInteger(input.size) ||
    input.size <= 0
  )
    throw new IntegrationError(400, "INVALID_PHOTO", "Foto inválida.");
  const error = getItemPhotoValidationError([input]);
  if (error) throw new IntegrationError(400, "INVALID_PHOTO", error);
  // Limit abandoned requests even before bytes are uploaded.
  const pending = await db.itemUpload.count({
    where: {
      ownerId: actor.userId,
      status: { in: ["PENDING", "VERIFIED"] },
      expiresAt: { gt: new Date() },
    },
  });
  if (pending >= 15)
    throw new IntegrationError(
      429,
      "UPLOAD_LIMIT",
      "Conclua ou descarte os envios anteriores.",
    );
  const id = randomUUID(),
    stagingKey = `staging/${actor.userId}/${id}.${getImageExtension(input.type)}`;
  const { data, error: failure } = await storageClient().createSignedUploadUrl(
    stagingKey,
    { upsert: false },
  );
  if (failure) throw Error("Storage indisponível.");
  await db.itemUpload.create({
    data: {
      id,
      ownerId: actor.userId,
      stagingKey,
      mime: input.type,
      size: input.size,
      expiresAt: new Date(Date.now() + 3 * 3600000),
    },
  });
  return { id, url: data.signedUrl };
}
export async function verifyPhoto(db, actor, id) {
  const row = await db.itemUpload.findFirst({
    where: { id, ownerId: actor.userId, expiresAt: { gt: new Date() } },
  });
  if (!row)
    throw new IntegrationError(404, "PHOTO_NOT_FOUND", "Foto não encontrada.");
  if (["VERIFIED", "ATTACHED"].includes(row.status)) return { id };
  if (row.status !== "PENDING")
    throw new IntegrationError(404, "PHOTO_NOT_FOUND", "Foto não encontrada.");
  const store = storageClient(),
    { data, error } = await store.download(row.stagingKey);
  if (error)
    throw new IntegrationError(
      400,
      "UPLOAD_INCOMPLETE",
      "O envio da foto não foi concluído.",
    );
  const buffer = Buffer.from(await data.arrayBuffer());
  let valid =
    buffer.length === row.size &&
    buffer.length <= 5 * 1024 * 1024 &&
    hasValidImageSignature(buffer, row.mime);
  try {
    const meta = await sharp(buffer, { limitInputPixels: 40000000 }).metadata();
    const actual = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    }[meta.format];
    valid = valid && actual === row.mime;
    await sharp(buffer, { limitInputPixels: 40000000 }).stats();
  } catch {
    valid = false;
  }
  if (!valid) {
    await store.remove([row.stagingKey]);
    throw new IntegrationError(
      400,
      "INVALID_PHOTO",
      "Conteúdo da imagem inválido ou tamanho divergente.",
    );
  }
  // Separate immutable verified key: upload capabilities can never overwrite validated bytes.
  const storageKey = `verified/${row.ownerId}/${row.id}.${getImageExtension(row.mime)}`;
  const result = await store.upload(storageKey, buffer, {
    contentType: row.mime,
    upsert: false,
  });
  if (result.error) {
    const existing = await store.download(storageKey);
    if (
      existing.error ||
      !Buffer.from(await existing.data.arrayBuffer()).equals(buffer)
    )
      throw Error("Falha ao confirmar foto.");
  }
  await db.itemUpload.updateMany({
    where: { id, status: "PENDING" },
    data: { storageKey, status: "VERIFIED" },
  });
  await store.remove([row.stagingKey]);
  return { id };
}
export async function photoUrl(key) {
  const { data, error } = await storageClient().createSignedUrl(key, 60);
  if (error) throw Error("Foto indisponível.");
  return data.signedUrl;
}
export function expiredPhotoWhere(actor = null, now = new Date()) {
  return {
    ...(actor ? { ownerId: actor.userId } : {}),
    expiresAt: { lt: now },
    status: { not: "ATTACHED" },
    image: { is: null },
  };
}
export async function inspectPhotoCleanup(db, actor = null, now = new Date()) {
  const where = expiredPhotoWhere(actor, now);
  const [expiredCandidates, rows] = await Promise.all([
    db.itemUpload.count({ where }),
    db.itemUpload.findMany({
      where,
      orderBy: [{ expiresAt: "asc" }, { id: "asc" }],
      take: 50,
    }),
  ]);
  return { expiredCandidates, rows };
}
export async function cleanupPhotos(db, actor = null, store = storageClient()) {
  const { rows } = await inspectPhotoCleanup(db, actor);
  const result = { removed: 0, skipped: 0, failed: 0 };
  for (const row of rows) {
    try {
      // Keep the row lock until removal and commit. Concurrent workers must not
      // both reclaim CLEANING; expired uploads cannot be acquired by publishing.
      const outcome = await db.$transaction(
        async (tx) => {
          const claimed = await tx.itemUpload.updateMany({
            where: {
              ...expiredPhotoWhere(actor),
              id: row.id,
              status: row.status,
            },
            data: { status: "CLEANING" },
          });
          if (!claimed.count) return "skipped";
          if (await tx.itemImage.count({ where: { uploadId: row.id } })) {
            await tx.itemUpload.update({
              where: { id: row.id },
              data: { status: "ATTACHED" },
            });
            return "skipped";
          }
          const { error } = await store.remove([
            row.stagingKey,
            row.storageKey ||
              `verified/${row.ownerId}/${row.id}.${getImageExtension(row.mime)}`,
          ]);
          if (error) return "failed";
          await tx.itemUpload.delete({ where: { id: row.id } });
          return "removed";
        },
        { maxWait: 5000, timeout: 15000 },
      );
      result[outcome]++;
    } catch {
      // A failed transaction or transport error leaves the record for retry.
      // Do not log Storage responses, signed URLs or connection credentials.
      result.failed++;
    }
  }
  return result;
}
