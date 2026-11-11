import { ASSISTANT_INTENTS, mapWatsonIntent } from "@/lib/assistant-intents.mjs";

const DEFAULT_WATSON_VERSION = "2024-08-25";

export function isWatsonConfigured() {
    return Boolean(
        process.env.IBM_WATSON_API_KEY
        && process.env.IBM_WATSON_ASSISTANT_ID
        && process.env.IBM_WATSON_SERVICE_URL
    );
}

async function getIamToken(apiKey) {
    const body = new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: apiKey,
    });

    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Falha na autenticação do IBM Cloud (${response.status}).`);
    }

    const data = await response.json();
    if (!data.access_token) {
        throw new Error("O IBM Cloud não retornou um token de acesso.");
    }

    return data.access_token;
}

function getTextResponse(output) {
    return output?.generic
        ?.filter((entry) => entry.response_type === "text" && entry.text)
        .map((entry) => entry.text)
        .join("\n") || null;
}

function getIntentResponse(output) {
    const rawIntent = output?.intents?.[0]?.intent
        || output?.user_defined?.reuse_intent
        || null;

    return {
        rawIntent,
        intent: rawIntent
            ? mapWatsonIntent(rawIntent)
            : ASSISTANT_INTENTS.DESCONHECIDO,
    };
}

export async function sendMessageToWatson(message) {
    const apiKey = process.env.IBM_WATSON_API_KEY;
    const assistantId = process.env.IBM_WATSON_ASSISTANT_ID;
    const serviceUrl = process.env.IBM_WATSON_SERVICE_URL?.replace(/\/$/, "");
    const version = process.env.IBM_WATSON_API_VERSION || DEFAULT_WATSON_VERSION;

    if (!apiKey || !assistantId || !serviceUrl) {
        throw new Error("IBM Watson Assistant não configurado.");
    }

    const token = await getIamToken(apiKey);
    const baseUrl = `${serviceUrl}/v2/assistants/${assistantId}`;
    const authHeaders = { Authorization: `Bearer ${token}` };
    const sessionResponse = await fetch(
        `${baseUrl}/sessions?version=${encodeURIComponent(version)}`,
        {
            method: "POST",
            headers: authHeaders,
            cache: "no-store",
        }
    );

    if (!sessionResponse.ok) {
        throw new Error(`Não foi possível iniciar a sessão Watson (${sessionResponse.status}).`);
    }

    const session = await sessionResponse.json();
    if (!session.session_id) {
        throw new Error("O Watson não retornou um identificador de sessão.");
    }

    const sessionUrl = `${baseUrl}/sessions/${session.session_id}`;

    try {
        const messageResponse = await fetch(
            `${sessionUrl}/message?version=${encodeURIComponent(version)}`,
            {
                method: "POST",
                headers: {
                    ...authHeaders,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: {
                        message_type: "text",
                        text: message,
                    },
                }),
                cache: "no-store",
            }
        );

        if (!messageResponse.ok) {
            throw new Error(`O Watson não processou a mensagem (${messageResponse.status}).`);
        }

        const data = await messageResponse.json();
        const result = getIntentResponse(data.output);

        return {
            ...result,
            text: getTextResponse(data.output),
        };
    } finally {
        await fetch(`${sessionUrl}?version=${encodeURIComponent(version)}`, {
            method: "DELETE",
            headers: authHeaders,
            cache: "no-store",
        }).catch(() => null);
    }
}
