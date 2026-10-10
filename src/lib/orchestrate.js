
const IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token";

let cachedToken = null;
let cachedTokenExpiresAt = 0;

function requireEnv(name) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Variável de ambiente ${name} não configurada.`);
    }

    return value;
}

async function getIamToken() {
    if (cachedToken && Date.now() < cachedTokenExpiresAt) {
        return cachedToken;
    }

    const apikey = requireEnv("ORCHESTRATE_APIKEY");

    const response = await fetch(IAM_TOKEN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body: new URLSearchParams({
            grant_type: "urn:ibm:params:oauth:grant-type:apikey",
            apikey,
        }),
    });

    if (!response.ok) {
        throw new Error(`Falha ao autenticar no IBM IAM (status ${response.status}).`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    cachedTokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return cachedToken;
}


export async function sendOrchestrateMessage({ history, userId }) {
    const token = await getIamToken();
    const baseUrl = requireEnv("ORCHESTRATE_CHAT_URL").replace(/\/$/, "");
    const agentId = requireEnv("ORCHESTRATE_AGENT_ID");
    const chatUrl = `${baseUrl}/v1/orchestrate/${agentId}/chat/completions`;

    const messages = [
        {
            role: "system",
            content: `ID do usuário logado na ReUse: ${userId}. Use esse valor sempre que precisar chamar uma ferramenta que peça userId, sem perguntar isso ao usuário.`,
        },
        ...history,
    ];

    const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages, stream: false }),
    });

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(
            `Falha ao conversar com o agente do watsonx Orchestrate (status ${response.status}): ${body}`
        );
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
}
