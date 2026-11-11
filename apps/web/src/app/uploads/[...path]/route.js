import { readFile } from "node:fs/promises";
import path from "node:path";
import { isLocalDemo } from "@/lib/local-demo.mjs";
import { localUploadSegments } from "@/lib/local-upload-path.mjs";
export const runtime = "nodejs";
export async function GET(_request, { params }) {
    if (!isLocalDemo()) return new Response(null, { status: 404 });
    const segments = localUploadSegments((await params).path);
    if (!segments) return new Response(null, { status: 404 });
    try {
        const bytes = await readFile(path.join(process.cwd(), "public/uploads", segments.folder, segments.filename));
        return new Response(bytes, { headers: { "Content-Type": segments.mime, "X-Content-Type-Options": "nosniff", "Cache-Control": "private, max-age=3600" } });
    } catch { return new Response(null, { status: 404 }); }
}
