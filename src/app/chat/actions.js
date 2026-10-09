"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { consumeRateLimit } from "@/lib/rate-limit";

const MAX_MESSAGE_LENGTH = 1000;

export async function sendMessage(_previousState, formData) {
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const content = formData.get("message")?.toString().trim() || "";
    const conversationId = formData.get("conversationId")?.toString() || "";
    const itemId = formData.get("itemId")?.toString() || "";
    const requestConversationId = conversationId || (itemId ? `new:${itemId}` : "");

    const fail = (error) => ({
        error,
        conversationId: requestConversationId,
    });

    if (!content || content.length > MAX_MESSAGE_LENGTH) {
        return fail(
            `A mensagem deve ter entre 1 e ${MAX_MESSAGE_LENGTH} caracteres.`
        );
    }

    const rateLimit = await consumeRateLimit({
        scope: "mensagens",
        identifier: userId,
        limit: 30,
        windowMs: 60 * 1000,
    });

    if (!rateLimit.allowed) {
        return fail("Muitas mensagens em pouco tempo. Aguarde um momento.");
    }

    let conversation;

    if (conversationId) {
        conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { buyerId: userId },
                    { sellerId: userId },
                ],
            },
        });
    } else if (itemId) {
        const item = await prisma.item.findFirst({
            where: {
                id: itemId,
                status: "ATIVO",
                NOT: { sellerId: userId },
            },
            select: { id: true, sellerId: true },
        });

        if (item) {
            conversation = await prisma.conversation.upsert({
                where: {
                    itemId_buyerId: {
                        itemId: item.id,
                        buyerId: userId,
                    },
                },
                update: {},
                create: {
                    itemId: item.id,
                    buyerId: userId,
                    sellerId: item.sellerId,
                },
            });
        }
    }

    if (!conversation) {
        return fail("Esta conversa não está disponível.");
    }

    const recipientId = conversation.buyerId === userId
        ? conversation.sellerId
        : conversation.buyerId;

    await prisma.$transaction([
        prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: userId,
                content,
            },
        }),
        prisma.notification.create({
            data: {
                userId: recipientId,
                itemId: conversation.itemId,
                message: "Você recebeu uma nova mensagem sobre um item.",
            },
        }),
    ]);

    revalidatePath("/chat");
    revalidatePath("/notificacoes");
    redirect(`/chat?conversationId=${conversation.id}`);
}
