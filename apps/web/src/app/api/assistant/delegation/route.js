import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createAssistantToolDelegationToken } from "@/lib/assistant-tool-auth.mjs";

export async function POST() {
    const session = await getSession();

    if (!session) {
        return NextResponse.json(
            { error: "Faça login para usar o assistente." },
            { status: 401 }
        );
    }

    const delegationToken = await createAssistantToolDelegationToken({
        userId: session.userId,
        sessionVersion: session.sessionVersion,
    });

    return NextResponse.json(
        { delegationToken },
        { headers: { "Cache-Control": "no-store" } }
    );
}
