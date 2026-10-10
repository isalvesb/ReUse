export async function prepareOrConfirmAssistantMutation({
    userId,
    intent,
    confirmationToken,
    createConfirmation,
    consumeConfirmation,
}) {
    if (!confirmationToken) {
        return {
            confirmed: false,
            confirmationToken: await createConfirmation({ userId, intent }),
        };
    }

    const confirmedIntent = await consumeConfirmation(
        confirmationToken,
        userId,
        intent
    );

    if (confirmedIntent !== intent) {
        throw new Error("A confirmação não corresponde à ação solicitada.");
    }

    return { confirmed: true, confirmationToken: null };
}
