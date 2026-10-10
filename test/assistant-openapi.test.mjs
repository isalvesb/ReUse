import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const assistantSpec = JSON.parse(
    await readFile(new URL("../assistant/reuse-openapi.json", import.meta.url), "utf8")
);
const orchestrateSpec = await readFile(
    new URL("../watsonx-orchestrate/reuse-tools-openapi.yaml", import.meta.url),
    "utf8"
);
const assistantDefinition = JSON.parse(
    await readFile(new URL("../assistant/rebot-action-v3.json", import.meta.url), "utf8")
);

test("OpenAPI do web chat aponta para produção e não aceita userId", () => {
    assert.equal(assistantSpec.servers[0].url, "https://re-use-web-bay.vercel.app");
    assert.ok(assistantSpec.components.schemas.DelegatedToolRequest);
    assert.equal(JSON.stringify(assistantSpec).includes("userId"), false);
});

test("OpenAPI do Orchestrate exige delegação e não aceita userId", () => {
    assert.match(orchestrateSpec, /required: \[delegationToken\]/);
    assert.doesNotMatch(orchestrateSpec, /\buserId\b/);
});

test("ações IBM usam delegação e confirmação nas três mutações", () => {
    const serialized = JSON.stringify(assistantDefinition);
    assert.equal(serialized.includes("user_id"), false);
    assert.match(serialized, /tool_delegation_token/);

    for (const title of [
        "Quero pausar minhas ofertas",
        "Reativar minhas ofertas",
        "Marcar notificações como lidas",
    ]) {
        const action = assistantDefinition.workspace.actions.find(
            (candidate) => candidate.title === title
        );
        const mappings = action.steps.flatMap(
            (step) => step.resolver?.callout?.request_mapping?.body ?? []
        );

        assert.ok(mappings.some((mapping) => mapping.parameter === "delegationToken"));
        assert.ok(mappings.some((mapping) => mapping.parameter === "confirmationToken"));
    }
});
