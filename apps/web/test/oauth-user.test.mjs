import test from "node:test";
import assert from "node:assert/strict";
import { findOrCreateOAuthUserWithDatabase } from "../src/lib/oauth-user.mjs";

function uniqueError() {
    return Object.assign(new Error("unique constraint"), { code: "P2002" });
}

const oauthInput = {
    provider: "google",
    providerAccountId: "provider-user-1",
    email: "Pessoa@Example.com",
    emailVerified: true,
    requireVerifiedEmail: true,
    name: "Pessoa",
    avatarUrl: null,
};

test("recupera o vínculo criado por uma solicitação OAuth concorrente", async () => {
    const originalUser = { id: "user-original", email: "pessoa@example.com" };
    const linkedUser = { id: "user-linked", email: "pessoa@example.com" };
    let accountLookup = 0;

    const database = {
        account: {
            findUnique: async () => (
                accountLookup++ === 0 ? null : { user: linkedUser }
            ),
            create: async () => { throw uniqueError(); },
        },
        user: {
            findUnique: async () => originalUser,
            create: async () => { throw new Error("não deveria criar usuário"); },
        },
    };

    const user = await findOrCreateOAuthUserWithDatabase(database, oauthInput);
    assert.equal(user, linkedUser);
});

test("vincula conta verificada ao usuário criado concorrentemente", async () => {
    const concurrentUser = { id: "user-concurrent", email: "pessoa@example.com" };
    let userLookup = 0;
    let accountCreatedFor = null;

    const database = {
        account: {
            findUnique: async () => null,
            create: async ({ data }) => { accountCreatedFor = data.userId; },
        },
        user: {
            findUnique: async () => (
                userLookup++ === 0 ? null : concurrentUser
            ),
            create: async () => { throw uniqueError(); },
        },
    };

    const user = await findOrCreateOAuthUserWithDatabase(database, oauthInput);
    assert.equal(user, concurrentUser);
    assert.equal(accountCreatedFor, concurrentUser.id);
});

test("não vincula conta sem e-mail verificado a um usuário existente", async () => {
    let accountCreateCalled = false;
    const database = {
        account: {
            findUnique: async () => null,
            create: async () => { accountCreateCalled = true; },
        },
        user: {
            findUnique: async () => ({ id: "existing-user" }),
            create: async () => { throw new Error("não deveria criar usuário"); },
        },
    };

    await assert.rejects(
        findOrCreateOAuthUserWithDatabase(database, {
            ...oauthInput,
            provider: "facebook",
            emailVerified: false,
            requireVerifiedEmail: false,
        }),
        /senha atual/
    );
    assert.equal(accountCreateCalled, false);
});
