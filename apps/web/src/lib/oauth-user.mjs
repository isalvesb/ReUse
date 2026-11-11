function isUniqueConstraintError(error) {
    return error?.code === "P2002";
}

async function findOAuthAccount(database, provider, providerAccountId) {
    return database.account.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
    });
}

async function createOAuthAccount(database, { provider, providerAccountId, userId }) {
    await database.account.create({
        data: { provider, providerAccountId, userId },
    });
}

export async function findOrCreateOAuthUserWithDatabase(database, {
    provider,
    providerAccountId,
    email,
    emailVerified = false,
    requireVerifiedEmail = false,
    name,
    avatarUrl,
}) {
    const existingAccount = await findOAuthAccount(
        database,
        provider,
        providerAccountId
    );

    if (existingAccount) {
        return existingAccount.user;
    }

    if (!email) {
        throw new Error(`Não foi possível obter o e-mail da conta ${provider}.`);
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (requireVerifiedEmail && !emailVerified) {
        throw new Error(`O ${provider} não confirmou a propriedade do e-mail.`);
    }

    const existingUser = await database.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser) {
        if (!emailVerified) {
            throw new Error(
                "Entre com a senha atual antes de vincular uma conta social a este e-mail."
            );
        }

        try {
            await createOAuthAccount(database, {
                provider,
                providerAccountId,
                userId: existingUser.id,
            });
        } catch (error) {
            if (!isUniqueConstraintError(error)) throw error;

            const concurrentAccount = await findOAuthAccount(
                database,
                provider,
                providerAccountId
            );

            if (!concurrentAccount) throw error;
            return concurrentAccount.user;
        }

        return existingUser;
    }

    try {
        return await database.user.create({
            data: {
                name: name || normalizedEmail,
                email: normalizedEmail,
                avatarUrl: avatarUrl || null,
                accounts: {
                    create: { provider, providerAccountId },
                },
            },
        });
    } catch (error) {
        if (!isUniqueConstraintError(error)) throw error;

        const concurrentAccount = await findOAuthAccount(
            database,
            provider,
            providerAccountId
        );

        if (concurrentAccount) {
            return concurrentAccount.user;
        }

        const concurrentUser = await database.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!concurrentUser || !emailVerified) throw error;

        try {
            await createOAuthAccount(database, {
                provider,
                providerAccountId,
                userId: concurrentUser.id,
            });
            return concurrentUser;
        } catch (linkError) {
            if (!isUniqueConstraintError(linkError)) throw linkError;

            const linkedAccount = await findOAuthAccount(
                database,
                provider,
                providerAccountId
            );

            if (!linkedAccount) throw linkError;
            return linkedAccount.user;
        }
    }
}
