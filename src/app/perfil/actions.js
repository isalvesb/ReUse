"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { destroySession, getCurrentUserId } from "@/lib/session";
import {
    deleteStoredItemImage,
    storeItemImage,
    storeProfileImage,
    UploadValidationError,
} from "@/lib/uploads";
import { getItemPhotoValidationError } from "@/lib/upload-constraints.mjs";
import { FIELD_LIMITS } from "@/lib/validation.mjs";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 3000;
const MAX_LOCATION_LENGTH = 160;

export async function logOut() {
    await destroySession();
    redirect("/login");
}

export async function updateProfile(_prevState, formData) {
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const name = formData.get("name")?.toString().trim();
    const location = formData.get("location")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();
    const avatarChoice = formData.get("avatarChoice")?.toString() || "current";
    const avatarFile = formData.get("avatar");

    if (!name) {
        return { error: "O nome é obrigatório." };
    }

    if (name.length > FIELD_LIMITS.name) {
        return { error: `O nome pode ter no máximo ${FIELD_LIMITS.name} caracteres.` };
    }

    if (location && location.length > FIELD_LIMITS.location) {
        return { error: `A localização pode ter no máximo ${FIELD_LIMITS.location} caracteres.` };
    }

    if (bio && bio.length > FIELD_LIMITS.bio) {
        return { error: `A biografia pode ter no máximo ${FIELD_LIMITS.bio} caracteres.` };
    }

    let avatarUrl;

    if (avatarFile instanceof File && avatarFile.size > 0) {
        try {
            avatarUrl = (await storeProfileImage(avatarFile)).url;
        } catch (error) {
            console.error("Falha ao armazenar imagem do perfil", error);
            return {
                error: error instanceof UploadValidationError
                    ? error.message
                    : "Não foi possível enviar a imagem do perfil.",
            };
        }
    } else if (/^\/images\/pranchas\/prancha8\.png#sprite=[1-6]$/.test(avatarChoice)) {
        avatarUrl = avatarChoice;
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            location: location || null,
            bio: bio || null,
            ...(avatarUrl ? { avatarUrl } : {}),
        },
    });

    revalidatePath("/perfil");
    revalidatePath("/perfil/editar");

    redirect("/perfil");
}

export async function updateBio(_prevState, formData) {
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const bio = formData.get("bio")?.toString().trim() || "";

    if (bio.length > FIELD_LIMITS.bio) {
        return {
            success: false,
            error: `A biografia pode ter no máximo ${FIELD_LIMITS.bio} caracteres.`,
        };
    }

    await prisma.user.update({
        where: { id: userId },
        data: { bio: bio || null },
    });

    revalidatePath("/perfil");

    return { success: true, error: null, bio };
}

const NEGOTIATION_TYPE_MAP = {
    venda: "VENDA",
    troca: "TROCA",
    doacao: "DOACAO",
};

const CONDITION_MAP = {
    "Novo": "NOVO",
    "Usado • Como Novo": "USADO_COMO_NOVO",
    "Usado • Bom Estado": "USADO_BOM_ESTADO",
    "Usado • Estado Regular": "USADO_ESTADO_REGULAR",
};

export async function publishItem(_prevState, formData) {
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const title = formData.get("title")?.toString().trim();
    const priceRaw = formData.get("price")?.toString();
    const categorySlug = formData.get("category")?.toString();
    const conditionLabel = formData.get("condition")?.toString();
    const negotiationType = formData.get("negotiationType")?.toString();
    const description = formData.get("description")?.toString().trim();
    const location = formData.get("location")?.toString().trim();
    const photos = formData
        .getAll("photos")
        .filter((entry) => entry instanceof File && entry.size > 0);

    if (!title || !categorySlug || !conditionLabel || !negotiationType || !description) {
        return { error: "Preencha todos os campos obrigatórios." };
    }

    if (description.length < 20) {
        return { error: `A descrição deve ter no mínimo 20 caracteres (${description.length}/20).` };
    }

    if (title.length > MAX_TITLE_LENGTH) {
        return { error: `O título pode ter no máximo ${MAX_TITLE_LENGTH} caracteres.` };
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
        return { error: `A descrição pode ter no máximo ${MAX_DESCRIPTION_LENGTH} caracteres.` };
    }

    if (location && location.length > MAX_LOCATION_LENGTH) {
        return { error: `A localização pode ter no máximo ${MAX_LOCATION_LENGTH} caracteres.` };
    }

    const photoValidationError = getItemPhotoValidationError(photos);
    if (photoValidationError) return { error: photoValidationError };

    const type = NEGOTIATION_TYPE_MAP[negotiationType];
    const condition = CONDITION_MAP[conditionLabel];

    if (!type || !condition) {
        return { error: "Selecione uma condição e uma categoria de negociação válidas." };
    }

    const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
    });

    if (!category) {
        return { error: "Categoria inválida." };
    }

    const price = type === "VENDA" && priceRaw ? Number(priceRaw) : null;

    if (
        type === "VENDA"
        && (
            !priceRaw
            || !Number.isFinite(price)
            || price <= 0
            || price > 99999999.99
        )
    ) {
        return { error: "Informe um preço válido para itens de venda." };
    }

    const storedImages = [];

    try {
        for (const file of photos) {
            storedImages.push(await storeItemImage(file));
        }
    } catch (error) {
        console.error("Falha ao armazenar imagem do item", error);

        await Promise.allSettled(
            storedImages.map(deleteStoredItemImage)
        );

        return {
            error: error instanceof UploadValidationError
                ? error.message
                : "Não foi possível enviar as imagens.",
        };
    }

    let item;

    try {
        item = await prisma.$transaction(async (transaction) => {
            const createdItem = await transaction.item.create({
                data: {
                    title,
                    description,
                    price,
                    type,
                    condition,
                    location: location || null,
                    sellerId: userId,
                    categoryId: category.id,
                    images: {
                        create: storedImages.map(({ url }, index) => ({
                            url,
                            position: index,
                        })),
                    },
                },
            });

            await transaction.notification.create({
                data: {
                    userId,
                    message: `Seu item "${title}" foi publicado com sucesso.`,
                    itemId: createdItem.id,
                },
            });

            return createdItem;
        });
    } catch (error) {
        console.error("Falha ao publicar item", error);
        await Promise.allSettled(
            storedImages.map(deleteStoredItemImage)
        );
        return { error: "Não foi possível publicar o item. Tente novamente." };
    }

    revalidatePath("/perfil");
    revalidatePath("/vitrine");

    return { success: true, error: null, publishedItemId: item.id };
}
