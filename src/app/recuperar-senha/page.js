"use client"

import Image from "next/image";
import Button from "@/components/Button";
import { Mail } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FIELD_LIMITS } from "@/lib/validation.mjs";

export default function RecuperarSenha() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        if (loading) return;

        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/recuperar-senha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setError(data?.error || 'Não foi possível enviar o e-mail.');
                return;
            }

            const normalizedEmail = email.trim().toLowerCase();
            router.push(`/email-enviado?email=${encodeURIComponent(normalizedEmail)}`);
        } catch {
            setError('Não foi possível enviar o e-mail. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }


    return (
        <main className="flex flex-col min-h-screen items-center justify-center bg-reuse-cream px-6">

            <section className="w-full max-w-md text-center">

                {/* ILUSTRAÇÃO */}
                <div className="mb-6 flex justify-center">
                    <Image
                        src='/images/cta/security-shield.png'
                        width={180}
                        height={185}
                        alt="Escudo de segurança"
                    />
                </div>

                {/* TÍTULO */}
                <h1 className="text-2xl font-medium text-reuse-brown">
                    Esqueceu a senha?
                </h1>


                {/* TEXTO */}
                <p className="mx-auto mt-6 max-w-sm text-sm leading-6 text-reuse-brown">
                    Não se preocupe! Digite seu e-mail e enviaremos um link para redefinir sua senha.
                </p>

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit} className="mt-7 text-left">

                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-reuse-brown">
                        E-mail
                    </label>

                    <div className="relative">

                        <Mail
                            size={20}
                            className="text-[#99A1AF] absolute left-4 top-1/2 -translate-y-1/2" />

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                if (error) setError('');
                            }}
                            placeholder="seu@email.com"
                            required
                            maxLength={FIELD_LIMITS.email}
                            autoComplete="email"
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? "recovery-error" : undefined}
                            className="h-12 w-full rounded-3xl border border-[#99A1AF] bg-reuse-white pl-11 pr-2 text-sm text-reuse-brown outline-none transition focus:border-reuse-pink"
                        />

                    </div>

                    {error && (
                        <p
                            id="recovery-error"
                            role="alert"
                            className="mt-3 text-sm font-medium text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="mt-3 h-12 w-full rounded-xl">
                        {loading ? 'Enviando...' : 'Enviar link para redefinir senha'}
                    </Button>

                </form>

            </section>

        </main>
    )
}
