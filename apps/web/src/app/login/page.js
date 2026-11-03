"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import { signIn } from "./actions";

const initialState = { error: null };

function OAuthErrorBanner() {
    const searchParams = useSearchParams();
    const oauthError = searchParams.get("oauthError");

    if (!oauthError) {
        return null;
    }

    return (
        <p role="alert" className="mb-4 text-center text-sm font-medium text-red-300">
            {oauthError}
        </p>
    );
}

export default function Login() {
    const [state, formAction, pending] = useActionState(signIn, initialState);

    return (
        <main className="flex min-h-screen">

            {/* IMAGEM */}
            <section className="hidden w-1/2 md:block">
                <Image
                    src="/images/login/jeans.png"
                    width={754}
                    height={1024}
                    alt="Calças jeans"
                    loading="eager"
                    className="h-full w-full object-cover"
                />
            </section>

            {/* LOGIN */}
            <section className="relative flex min-h-screen w-full items-center justify-center bg-reuse-brown px-8 md:w-1/2">

                <Link
                    href="/"
                    className="absolute right-6 top-6 text-sm text-reuse-cream/75 underline-offset-4 transition hover:text-reuse-pink hover:underline sm:right-8 sm:top-8"
                >
                    Pular login
                </Link>

                {/* CAIXA DO LOGIN */}
                <div className="w-full max-w-md">

                    {/* LOGO */}
                    <div className="mb-8 flex justify-center">
                        <Image
                            src="/images/logo/ReUse-rosa.png"
                            width={188}
                            height={26}
                            alt="ReUse logo rosa"
                            loading="eager"
                        />
                    </div>

                    <Suspense fallback={null}>
                        <OAuthErrorBanner />
                    </Suspense>

                    {/* FORMULÁRIO */}
                    <form action={formAction}>

                        {/* E-MAIL */}
                        <label htmlFor="email" className="mb-2 block text-sm font-bold text-reuse-cream">
                            E-mail
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            maxLength={254}
                            autoComplete="email"
                            className="h-12 w-full rounded-3xl bg-reuse-white px-4 outline-none"
                        />

                        {/* SENHA */}
                        <label htmlFor="password" className="mb-2 mt-3 block text-sm font-bold text-reuse-cream">
                            Senha
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            maxLength={128}
                            autoComplete="current-password"
                            className="h-12 w-full rounded-3xl bg-reuse-white px-4 outline-none"
                        />

                        {/* ERRO */}
                        {state?.error && (
                            <p id="login-error" role="alert" className="mt-3 text-sm font-medium text-red-300">
                                {state.error}
                            </p>
                        )}

                        {/* LINKS */}
                        <div className="mt-6 text-center">

                            <p className="text-sm text-reuse-cream">
                                Não tem uma conta?

                                <Link
                                    href="/cadastro"
                                    className="ml-2 font-medium text-reuse-pink"
                                >
                                    Criar conta
                                </Link>
                            </p>

                            <Link
                                href="/recuperar-senha"
                                className="mt-3 block text-sm text-reuse-cream"
                            >
                                Esqueceu a senha?
                            </Link>

                        </div>

                        {/* BOTÃO ENTRAR */}
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={pending}
                            className="mt-8 h-12 w-full rounded-3xl"
                        >
                            {pending ? "Entrando..." : "Entrar"}
                        </Button>

                    </form>

                    {/* OU */}
                    <div className="my-8 flex items-center gap-4">

                        <div className="h-px flex-1 bg-reuse-pink" />

                        <span className="text-sm text-reuse-pink">
                            ou
                        </span>

                        <div className="h-px flex-1 bg-reuse-pink" />

                    </div>

                    {/* GOOGLE */}
                    <a
                        href="/api/auth/google"
                        className="flex h-12 w-full items-center justify-center rounded-3xl border border-reuse-pink text-sm font-medium text-reuse-cream transition-all duration-200 hover:scale-105 hover:bg-reuse-brown-light"
                    >
                        <Image
                            src="/images/logo/Icon-google.png"
                            width={21}
                            height={20}
                            alt="Ícone do Google"
                            className="mr-3"
                        />

                        Continuar com Google
                    </a>

                    {/* FACEBOOK */}
                    <a
                        href="/api/auth/facebook"
                        className="mt-4 flex h-12 w-full items-center justify-center rounded-3xl border border-reuse-pink text-sm font-medium text-reuse-cream transition-all duration-200 hover:scale-105 hover:bg-reuse-brown-light"
                    >
                        <Image
                            src="/images/logo/Icon-facebook.png"
                            width={20}
                            height={20}
                            alt="Ícone do Facebook"
                            className="mr-3"
                        />

                        Continuar com Facebook
                    </a>

                </div>

            </section>

        </main>
    );
}
