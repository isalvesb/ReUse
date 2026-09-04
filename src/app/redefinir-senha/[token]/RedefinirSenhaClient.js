"use client";

import Image from "next/image";
import { useActionState } from "react";
import { Lock } from "lucide-react";
import Button from "@/components/Button";
import { resetPassword } from "./actions";

const initialState = { error: null };

export default function RedefinirSenhaClient({ token }) {
    const [state, formAction, pending] = useActionState(resetPassword, initialState);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-reuse-cream px-6">

            <section className="w-full max-w-md text-center">

                <div className="mb-6 flex justify-center">
                    <Image
                        src="/images/cta/security-shield.png"
                        width={180}
                        height={185}
                        alt="Escudo de segurança"
                    />
                </div>

                <h1 className="text-2xl font-medium text-reuse-brown">
                    Criar nova senha
                </h1>

                <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-reuse-brown">
                    Escolha uma nova senha para acessar sua conta ReUse!.
                </p>

                <form action={formAction} className="mt-7 text-left">
                    <input type="hidden" name="token" value={token} />

                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-reuse-brown"
                    >
                        Nova senha
                    </label>

                    <div className="relative">
                        <Lock
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AF]"
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
                            className="h-12 w-full rounded-3xl border border-[#99A1AF] bg-reuse-white pl-11 pr-2 text-sm text-reuse-brown outline-none transition focus:border-reuse-pink"
                        />
                    </div>

                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 mt-4 block text-sm font-medium text-reuse-brown"
                    >
                        Confirmar nova senha
                    </label>

                    <div className="relative">
                        <Lock
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AF]"
                        />

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
                            className="h-12 w-full rounded-3xl border border-[#99A1AF] bg-reuse-white pl-11 pr-2 text-sm text-reuse-brown outline-none transition focus:border-reuse-pink"
                        />
                    </div>

                    {state?.error && (
                        <p className="mt-3 text-sm font-medium text-red-600">
                            {state.error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={pending}
                        className="mt-6 h-12 w-full rounded-xl"
                    >
                        {pending ? "Salvando..." : "Salvar nova senha"}
                    </Button>
                </form>

            </section>

        </main>
    );
}
