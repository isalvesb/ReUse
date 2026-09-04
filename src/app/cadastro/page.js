"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import Button from "@/components/Button";
import { signUp } from "./actions";

const initialState = { error: null };

export default function Cadastro() {
    const [state, formAction, pending] = useActionState(signUp, initialState);

    return (
        <main className="flex min-h-screen">

            {/* IMAGEM */}
            <section className="hidden w-1/2 md:block">
                <Image
                    src="/images/login/jeans.png"
                    width={754}
                    height={1024}
                    alt="Calças jeans"
                    className="h-full w-full object-cover"
                />
            </section>

            {/* CADASTRO */}
            <section className="flex min-h-screen w-full items-center justify-center bg-reuse-brown px-8 md:w-1/2">

                <div className="w-full max-w-md">

                    {/* LOGO */}
                    <div className="mb-8 flex justify-center">
                        <Image
                            src="/images/logo/Reuse-rosa.png"
                            width={188}
                            height={26}
                            alt="ReUse logo rosa"
                        />
                    </div>

                    {/* FORMULÁRIO */}
                    <form action={formAction}>

                        {/* NOME */}
                        <label className="mb-2 block text-sm font-bold text-reuse-cream">
                            Nome
                        </label>

                        <input
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            className="h-12 w-full rounded-3xl bg-reuse-white px-4 outline-none"
                        />

                        {/* E-MAIL */}
                        <label className="mb-2 mt-3 block text-sm font-bold text-reuse-cream">
                            E-mail
                        </label>

                        <input
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="h-12 w-full rounded-3xl bg-reuse-white px-4 outline-none"
                        />

                        {/* SENHA */}
                        <label className="mb-2 mt-3 block text-sm font-bold text-reuse-cream">
                            Senha
                        </label>

                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            className="h-12 w-full rounded-3xl bg-reuse-white px-4 outline-none"
                        />

                        {/* CONFIRMAR SENHA */}
                        <label className="mb-2 mt-3 block text-sm font-bold text-reuse-cream">
                            Confirmar senha
                        </label>

                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            autoComplete="new-password"
                            className="h-12 w-full rounded-3xl bg-reuse-white px-4 outline-none"
                        />

                        {/* ERRO */}
                        {state?.error && (
                            <p className="mt-3 text-sm font-medium text-red-300">
                                {state.error}
                            </p>
                        )}

                        {/* LINKS */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-reuse-cream">
                                Já tem uma conta?

                                <Link
                                    href="/login"
                                    className="ml-2 font-medium text-reuse-pink"
                                >
                                    Entrar
                                </Link>
                            </p>
                        </div>

                        {/* BOTÃO CRIAR CONTA */}
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={pending}
                            className="mt-8 h-12 w-full rounded-3xl"
                        >
                            {pending ? "Criando conta..." : "Criar conta"}
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
