"use client";

import { useEffect, useRef } from "react";

const SCRIPT_ID = "watson-assistant-chat-entry";


let scriptInjected = false;
let chatInstance = null;

async function requestDelegationToken() {
    const response = await fetch("/api/assistant/delegation", {
        method: "POST",
        cache: "no-store",
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error("Não foi possível validar a sessão do assistente.");
    }

    const data = await response.json();

    if (typeof data.delegationToken !== "string") {
        throw new Error("Delegação inválida recebida do servidor.");
    }

    return data.delegationToken;
}

async function handlePreSend(event) {
    const delegationToken = await requestDelegationToken();
    event.data.context = event.data.context || {};
    event.data.context.skills = event.data.context.skills || {};
    event.data.context.skills["actions skill"] =
        event.data.context.skills["actions skill"] || {};
    event.data.context.skills["actions skill"].skill_variables =
        event.data.context.skills["actions skill"].skill_variables || {};
    event.data.context.skills["actions skill"].skill_variables.tool_delegation_token =
        delegationToken;
}

function ensureScriptLoaded() {
    if (scriptInjected) {
        return;
    }

    scriptInjected = true;

    window.watsonAssistantChatOptions = {
        integrationID: "f6ddd1b0-9725-478f-bab7-724ae067b03b",
        region: "https://integrations.au-syd.assistant-builder.watson.appdomain.cloud",
        serviceInstanceID: "ab84fd02-c931-4269-a7f7-7a47ff870115",
        orchestrateUIAgentExtensions: false,
        namespace: "reuse-assistant",
        themeConfig: {
            carbonTheme: "white",
        },
        headerConfig: {
            showRestartButton: true,
        },
        onLoad: async (instance) => {
            chatInstance = instance;

            try {
                await instance.updateLocale("pt-br");
            } catch (error) {
                console.error("Não foi possível aplicar o idioma pt-br no web chat:", error);
            }

            try {
                await instance.updateCSSVariables({
                    "cds-background": "#f7efde", // --reuse-cream
                    "cds-text-primary": "#342a2a", // --reuse-brown
                    "cds-layer": "#ffffff", // --reuse-white (campo de mensagem, balões do assistente)
                    "cds-interactive": "#ebbbeb", // --reuse-pink (links, foco)
                    "cds-button-primary": "#ebbbeb", // --reuse-pink (botão de enviar, como o Button variant="primary" do site)
                    "cds-text-on-color": "#342a2a", // --reuse-brown (texto sobre o botão rosa)
                    "cds-border-subtle": "#75685433", // --reuse-beige com transparência
                });
            } catch (error) {
                console.error("Não foi possível aplicar as cores da ReUse no web chat:", error);
            }

            instance.on({ type: "pre:send", handler: handlePreSend });

            await instance.render();
        },
    };

    document.getElementById(SCRIPT_ID)?.remove();

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src =
        "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
        (window.watsonAssistantChatOptions.clientVersion || "latest") +
        "/WatsonAssistantChatEntry.js";
    script.addEventListener("error", () => {
        scriptInjected = false;
        script.remove();
    }, { once: true });
    document.head.appendChild(script);
}

export default function OrchestrateWebChat({ loggedIn }) {
    const previousLoggedIn = useRef(undefined);

    useEffect(() => {
        if (previousLoggedIn.current === loggedIn) {
            return;
        }

        previousLoggedIn.current = loggedIn;

        if (loggedIn) {
            ensureScriptLoaded();
            return;
        }

        if (chatInstance) {
            chatInstance.destroy?.();
            chatInstance = null;
            scriptInjected = false;
            document.getElementById(SCRIPT_ID)?.remove();
            delete window.watsonAssistantChatOptions;
        }
    }, [loggedIn]);

    return null;
}
