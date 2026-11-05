import { assistantRequest } from "@/lib/assistant-runtime";
export const runtime = "nodejs";
export async function POST(request) { return assistantRequest(request, "selection"); }
