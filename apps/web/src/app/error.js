"use client";
import Link from "next/link";
export default function ErrorPage({ reset }) {
    return <main className="mx-auto max-w-xl px-6 py-20 text-reuse-brown" role="alert">
        <h1 className="text-2xl font-bold">Não foi possível abrir esta área</h1>
        <p className="my-5">Tente novamente em instantes. Seus dados não foram apagados.</p>
        <button onClick={reset} className="rounded-xl bg-reuse-pink px-5 py-3">Tentar novamente</button>
        <Link className="ml-5 underline" href="/">Voltar ao início</Link>
    </main>;
}
