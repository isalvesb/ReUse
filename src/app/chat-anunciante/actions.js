"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export async function sendMessage(_prevState, formData) {
    const userId = await getCurrentUserId();

    if (!userId) {
        redirect("/login");
    }

    const conversationId = formData.get("conversationId")?.toString();
    const content = formData.get("content")?.toString().trim();

    if (!conversationId || !content) {
        return { error: "Escreva uma mensagem antes de enviar." };
    }

    const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
    });

    if (!conversation || (conversation.buyerId !== userId && conversation.sellerId !== userId)) {
        return { error: "Conversa não encontrada." };
    }

    await prisma.message.create({
        data: {
            conversationId,
            senderId: userId,
            content,
        },
    });

    const recipientId = conversation.buyerId === userId
        ? conversation.sellerId
        : conversation.buyerId;

    await prisma.notification.create({
        data: {
            userId: recipientId,
            message: "Você recebeu uma nova mensagem sobre um item.",
            itemId: conversation.itemId,
        },
    });

    revalidatePath("/chat-anunciante");

    return { error: null };
}
