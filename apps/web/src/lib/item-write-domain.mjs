import { stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { IntegrationError } from "./profile-domain.mjs";
import { CATALOG_CATEGORIES, catalogDetail } from "./catalog-domain.mjs";
export function invalid(message = "Anúncio inválido.") {
  throw new IntegrationError(400, "INVALID_ITEM", message);
}
export function validateItem(input, editing = false) {
  const allowed = [
    "title",
    "description",
    "category",
    "type",
    "condition",
    "price",
    "location",
    "photos",
    editing ? "updatedAt" : "creationKey",
    "status",
  ];
  if (
    !input ||
    Array.isArray(input) ||
    typeof input !== "object" ||
    Object.keys(input).some((k) => !allowed.includes(k))
  )
    invalid();
  const text = (key, min, max) => {
    const v = input[key];
    if (typeof v !== "string" || v.trim().length < min || v.trim().length > max)
      invalid(`Confira o campo ${key} (${min}–${max} caracteres).`);
    return v.trim();
  };
  const data = {
    title: text("title", 1, 120),
    description: text("description", 20, 3000),
    location: text("location", 0, 160) || null,
    type: input.type,
    condition: input.condition,
    status: input.status || "ATIVO",
  };
  if (
    !["VENDA", "TROCA", "DOACAO"].includes(data.type) ||
    ![
      "NOVO",
      "USADO_COMO_NOVO",
      "USADO_BOM_ESTADO",
      "USADO_ESTADO_REGULAR",
    ].includes(data.condition) ||
    !CATALOG_CATEGORIES.some((c) => c.slug === input.category)
  )
    invalid("Selecione categoria, modalidade e condição válidas.");
  // Preserve existing pause/reactivate flow; reserved/completed records keep their state.
  if (
    !["ATIVO", "INATIVO", "RESERVADO", "CONCLUIDO"].includes(data.status) ||
    (!editing && data.status !== "ATIVO")
  )
    invalid("Estado inválido.");
  data.price = null;
  if (data.type === "VENDA") {
    if (
      typeof input.price !== "string" ||
      !/^\d{1,8}(\.\d{1,2})?$/.test(input.price) ||
      Number(input.price) <= 0 ||
      Number(input.price) > 99999999.99
    )
      invalid("Informe um preço válido.");
    data.price = Number(input.price).toFixed(2);
  }
  if (
    !Array.isArray(input.photos) ||
    input.photos.length < 1 ||
    input.photos.length > 5
  )
    invalid("Adicione de uma a cinco fotos.");
  const keys = input.photos.map((p) => {
    if (
      !p ||
      typeof p !== "object" ||
      Object.keys(p).length !== 1 ||
      !["imageId", "uploadId"].includes(Object.keys(p)[0]) ||
      typeof Object.values(p)[0] !== "string"
    )
      invalid("Referência de foto inválida.");
    return Object.values(p)[0];
  });
  if (new Set(keys).size !== keys.length) invalid("Fotos duplicadas.");
  if (editing) {
    if (
      typeof input.updatedAt !== "string" ||
      !Number.isFinite(Date.parse(input.updatedAt))
    )
      invalid("Recarregue o anúncio antes de editar.");
  } else if (
    typeof input.creationKey !== "string" ||
    !/^[a-f\d-]{36}$/i.test(input.creationKey)
  )
    invalid("Identificador de publicação inválido.");
  return { data, category: input.category, photos: input.photos };
}
export async function ownItem(db, actor, id) {
  const item = await db.item.findFirst({
    where: { id, sellerId: actor.userId },
    include: { category: true, images: { orderBy: { position: "asc" } } },
  });
  if (!item)
    throw new IntegrationError(
      404,
      "ITEM_NOT_FOUND",
      "Anúncio não encontrado.",
    );
  return item;
}
export async function saveItem(db, actor, input, id = null) {
  const validated = validateItem(input, !!id),
    hash = createHash("sha256").update(JSON.stringify(validated)).digest("hex");
  const run = () =>
    db.$transaction(
      async (tx) => {
        if (!id) {
          const old = await tx.item.findUnique({
            where: { creationKey: input.creationKey },
          });
          if (old) {
            if (old.sellerId !== actor.userId || old.creationHash !== hash)
              throw new IntegrationError(
                409,
                "REQUEST_CONFLICT",
                "Publicação já utilizada com outros dados.",
              );
            return old.id;
          }
        }
        const old = id ? await ownItem(tx, actor, id) : null;
        if (
          old &&
          !(
            old.status === validated.data.status ||
            (["ATIVO", "INATIVO"].includes(old.status) &&
              ["ATIVO", "INATIVO"].includes(validated.data.status))
          )
        )
          invalid(
            "Somente pausar e reativar anúncios está disponível neste fluxo.",
          );
        const category = await tx.category.findUnique({
          where: { slug: validated.category },
        });
        if (!category) invalid("Categoria inválida.");
        const photos = [];
        let total = 0;
        for (const photo of validated.photos) {
          if (photo.imageId) {
            const existing = old?.images.find((i) => i.id === photo.imageId);
            if (!existing) invalid("Foto não pertence a este anúncio.");
            photos.push({
              id: existing.id,
              url: existing.url,
              uploadId: existing.uploadId,
            });
            if (existing.uploadId) {
              const upload = await tx.itemUpload.findUnique({
                where: { id: existing.uploadId },
              });
              total += upload?.size || 0;
            } else {
              const pathname = new URL(existing.url, "https://static.invalid")
                .pathname;
              if (!pathname.startsWith("/images/"))
                invalid("Não foi possível validar a foto antiga.");
              total += (
                await stat(new URL("../../public" + pathname, import.meta.url))
              ).size;
            }
          } else {
            const upload = await tx.itemUpload.findFirst({
              where: {
                id: photo.uploadId,
                ownerId: actor.userId,
                status: "VERIFIED",
                expiresAt: { gt: new Date() },
              },
            });
            if (!upload)
              invalid("Foto não verificada, expirada ou de outra conta.");
            const claimed = await tx.itemUpload.updateMany({
              where: {
                id: upload.id,
                ownerId: actor.userId,
                status: "VERIFIED",
                expiresAt: { gt: new Date() },
              },
              data: { status: "ATTACHED" },
            });
            if (!claimed.count)
              invalid("Foto não disponível. Tente novamente.");
            photos.push({
              url: `/api/v1/images/${upload.id}`,
              uploadId: upload.id,
            });
            total += upload.size;
          }
        }
        if (total > 12 * 1024 * 1024)
          invalid("As imagens podem somar no máximo 12 MB.");
        let itemId = id;
        if (old) {
          const updated = await tx.item.updateMany({
            where: {
              id,
              sellerId: actor.userId,
              updatedAt: new Date(input.updatedAt),
            },
            data: {
              ...validated.data,
              categoryId: category.id,
              updatedAt: new Date(),
            },
          });
          if (!updated.count)
            throw new IntegrationError(
              409,
              "STALE_ITEM",
              "O anúncio mudou. Recarregue antes de salvar.",
            );
          await tx.itemImage.deleteMany({ where: { itemId: id } });
        } else {
          itemId = (
            await tx.item.create({
              data: {
                ...validated.data,
                categoryId: category.id,
                sellerId: actor.userId,
                creationKey: input.creationKey,
                creationHash: hash,
              },
            })
          ).id;
        }
        for (const [position, photo] of photos.entries()) {
          await tx.itemImage.create({ data: { ...photo, itemId, position } });
          if (photo.uploadId)
            await tx.itemUpload.update({
              where: { id: photo.uploadId },
              data: { status: "ATTACHED" },
            });
        }
        // Removed files are not deleted inside the transaction. Cleanup checks live references.
        for (const image of old?.images || [])
          if (
            image.uploadId &&
            !photos.some((p) => p.uploadId === image.uploadId)
          )
            await tx.itemUpload.update({
              where: { id: image.uploadId },
              data: {
                status: "DETACHED",
                expiresAt: new Date(Date.now() + 86400000),
              },
            });
        return itemId;
      },
      { timeout: 60000, maxWait: 15000 },
    );
  let result;
  try {
    result = await run();
  } catch (e) {
    // A concurrent identical request may have claimed the photos before this transaction.
    // Resolve only the same authenticated creation key and payload, never another owner's record.
    const saved = !id
      ? await db.item.findUnique({ where: { creationKey: input.creationKey } })
      : null;
    if (saved?.sellerId === actor.userId && saved.creationHash === hash)
      result = saved.id;
    else throw e;
  }
  return catalogDetail(db, result, actor.userId);
}
