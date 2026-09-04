"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { destroySession, getCurrentUserId } from "@/lib/session";

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
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const location = formData.get("location")?.toString().trim();
    const bio = formData.get("bio")?.toString().trim();

    if (!name || !email) {
        return { error: "Nome e e-mail são obrigatórios." };
    }

    const emailInUse = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
    });

    if (emailInUse) {
        return { error: "Este e-mail já está em uso por outra conta." };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { name, email, location: location || null, bio: bio || null },
        });
    } catch (error) {
        if (error.code === "P2002") {
            return { error: "Este e-mail já está em uso por outra conta." };
        }

        throw error;
    }

    revalidatePath("/perfil");
    revalidatePath("/perfil/editar");

    redirect("/perfil");
}

const NEGOTIATION_TYPE_MAP = {
    venda: "VENDA",
    troca: "TROCA",
    doacao: "DOACAO",
};

const CONDITION_MAP = {
    "Novo": "NOVO",
    "Usado - Como Novo": "USADO_COMO_NOVO",
    "Usado - Bom Estado": "USADO_BOM_ESTADO",
    "Usado - Estado Regular": "USADO_ESTADO_REGULAR",
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

    if (type === "VENDA" && (!priceRaw || Number.isNaN(price))) {
        return { error: "Informe um preço válido para itens de venda." };
    }

    const imageUrls = [];

    if (photos.length > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "items");
        await mkdir(uploadDir, { recursive: true });

        for (const file of photos.slice(0, 5)) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const extension = path.extname(file.name) || ".jpg";
            const filename = `${randomUUID()}${extension}`;

            await writeFile(path.join(uploadDir, filename), buffer);
            imageUrls.push(`/uploads/items/${filename}`);
        }
    }

    const item = await prisma.item.create({
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
                create: imageUrls.map((url, index) => ({ url, position: index })),
            },
        },
    });

    await prisma.notification.create({
        data: {
            userId,
            message: `Seu item "${title}" foi publicado com sucesso.`,
            itemId: item.id,
        },
    });

    revalidatePath("/perfil");
    revalidatePath("/vitrine");

    return { success: true, error: null, publishedItemId: item.id };
}
