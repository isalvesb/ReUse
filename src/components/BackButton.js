"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const PREVIOUS_PATH_KEY = "reuse.previousPath";
const CURRENT_PATH_KEY = "reuse.currentPath";

function safeInternalPath(path, origin) {
    if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
    try {
        const url = new URL(path, origin);
        return url.origin === origin ? `${url.pathname}${url.search}${url.hash}` : null;
    } catch {
        return null;
    }
}

export default function BackButton({ fallback = "/vitrine", className = "", children = "Voltar" }) {
    const router = useRouter();

    function handleBack(event) {
        const origin = window.location.origin;
        const currentPath = `${window.location.pathname}${window.location.search}`;
        const trackedCurrent = sessionStorage.getItem(CURRENT_PATH_KEY);
        const previousPath = safeInternalPath(sessionStorage.getItem(PREVIOUS_PATH_KEY), origin);

        // Só usa a origem rastreada quando ela pertence à navegação atual.
        // Nunca usa history.back(), que poderia retornar a uma página externa.
        if (trackedCurrent === currentPath && previousPath && previousPath !== currentPath) {
            event.preventDefault();
            sessionStorage.removeItem(PREVIOUS_PATH_KEY);
            router.push(previousPath);
        }
        // Caso contrário, o href nativo garante o fallback, mesmo sem JavaScript.
    }

    return (
        <Link
            href={fallback}
            onClick={handleBack}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-reuse-brown/10 bg-reuse-pink/55 px-4 py-2 text-reuse-brown shadow-sm transition duration-150 hover:bg-reuse-pink/85 active:scale-[0.97] active:bg-reuse-pink ${className}`.trim()}
        >
            <ArrowLeft size={20} aria-hidden="true" />
            {children}
        </Link>
    );
}
