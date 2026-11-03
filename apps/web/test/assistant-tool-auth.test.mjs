import test from "node:test";
import assert from "node:assert/strict";
import {
    ASSISTANT_TOOL_SCOPES,
    createAssistantToolDelegationToken,
    parseDelegatedToolBody,
    verifyAssistantToolDelegationToken,
} from "../src/lib/assistant-tool-auth.mjs";

process.env.ASSISTANT_CONFIRMATION_SECRET =
    "teste-delegacao-reuse-com-mais-de-32-caracteres";

test("deriva a identidade exclusivamente da delegação assinada", async () => {
    const token = await createAssistantToolDelegationToken({
        userId: "usuario-1",
        sessionVersion: 4,
    });
    const delegation = await verifyAssistantToolDelegationToken(
        token,
        ASSISTANT_TOOL_SCOPES.LISTAR_OFERTAS
    );

    assert.equal(delegation.userId, "usuario-1");
    assert.equal(delegation.sessionVersion, 4);
});

test("rejeita delegação sem o escopo da ferramenta", async () => {
    const token = await createAssistantToolDelegationToken({
        userId: "usuario-1",
        sessionVersion: 1,
        scopes: [ASSISTANT_TOOL_SCOPES.LISTAR_OFERTAS],
    });

    await assert.rejects(
        verifyAssistantToolDelegationToken(
            token,
            ASSISTANT_TOOL_SCOPES.PAUSAR_OFERTAS
        ),
        /sem permissão/
    );
});

test("rejeita delegação expirada", async () => {
    const token = await createAssistantToolDelegationToken({
        userId: "usuario-1",
        sessionVersion: 1,
        expiresIn: "-1s",
    });

    await assert.rejects(
        verifyAssistantToolDelegationToken(
            token,
            ASSISTANT_TOOL_SCOPES.LISTAR_OFERTAS
        ),
        /exp|JWT/i
    );
});

test("rejeita alteração do usuário dentro do token", async () => {
    const token = await createAssistantToolDelegationToken({
        userId: "usuario-1",
        sessionVersion: 1,
    });
    const [header, payload, signature] = token.split(".");
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    claims.sub = "usuario-2";
    const forgedPayload = Buffer.from(JSON.stringify(claims)).toString("base64url");

    await assert.rejects(
        verifyAssistantToolDelegationToken(
            `${header}.${forgedPayload}.${signature}`,
            ASSISTANT_TOOL_SCOPES.LISTAR_OFERTAS
        )
    );
});

test("não aceita userId enviado pelo navegador ou pelo agente", () => {
    assert.throws(
        () => parseDelegatedToolBody({
            delegationToken: "token",
            userId: "usuario-2",
        }),
        /userId não é aceito/
    );
});

test("aceita somente os tokens previstos no contrato delegado", () => {
    assert.deepEqual(
        parseDelegatedToolBody({
            delegationToken: "delegacao",
            confirmationToken: "confirmacao",
        }),
        {
            delegationToken: "delegacao",
            confirmationToken: "confirmacao",
        }
    );
});
