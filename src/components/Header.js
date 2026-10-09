"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SpriteImage from "@/components/SpriteImage";
import { getAvatarSource } from "@/lib/sprite";

import {
    Search,
    Bell,
    ShoppingBag,
    User,
    Package,
    MessageCircle,
    Settings,
    LogOut,
} from "lucide-react";

import Button from "@/components/Button";
import { signOut } from "@/app/login/actions";


export default function Header({
    loggedIn = false,
    avatarUrl,
    avatarKey,
    unreadCount = 0,
}) {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const profileButtonRef = useRef(null);
    const avatarSource = getAvatarSource(avatarUrl, avatarKey);

    // Fecha o menu quando clicar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!profileOpen) return;

        function handleMenuKeyDown(event) {
            if (event.key !== "Escape") return;

            event.preventDefault();
            setProfileOpen(false);
            profileButtonRef.current?.focus();
        }

        document.addEventListener("keydown", handleMenuKeyDown);

        return () => {
            document.removeEventListener("keydown", handleMenuKeyDown);
        };
    }, [profileOpen]);

    return (
        <header className="w-full shrink-0 bg-reuse-brown px-4 py-3 sm:px-6">
            <div className="mx-auto flex h-[46px] max-w-7xl items-center justify-between gap-4 sm:gap-6">

                {/* Logo */}
                <Link href="/" className="inline-flex rounded-md transition-opacity hover:opacity-75 active:opacity-60">
                    <Image
                        src="/images/logo/ReUse-creme.png"
                        width={130}
                        height={16}
                        alt="ReUse"
                        className="h-auto w-[130px]"
                        priority
                    />
                </Link>

                {/* Busca */}
                <form action="/vitrine" method="get" className="hidden w-[350px] md:flex">
                    <div className="flex h-10 w-full items-center rounded-2xl bg-reuse-cream px-4">
                        <input
                            type="text"
                            name="q"
                            maxLength={80}
                            placeholder="Busque sapato, poltrona, notebook..."
                            aria-label="Buscar na vitrine"
                            className="w-full bg-transparent text-sm text-reuse-brown outline-none placeholder:text-xs placeholder:text-reuse-brown-light placeholder:opacity-60"
                        />

                        <button type="submit" aria-label="Buscar" className="text-reuse-brown">
                            <Search size={20} strokeWidth={2} />
                        </button>
                    </div>
                </form>

                {/* Navegação */}
                <nav className="hidden items-center gap-7 text-sm text-reuse-white lg:flex">
                    <Link
                        href="/vitrine"
                        className="transition hover:text-reuse-pink"
                    >
                        Vitrine
                    </Link>

                    <Link
                        href="/#categorias"
                        className="transition hover:text-reuse-pink"
                    >
                        Categorias
                    </Link>

                    <Link
                        href="/sobre"
                        className="transition hover:text-reuse-pink"
                    >
                        Sobre
                    </Link>

                </nav>

                {/* Área do usuário */}
                {loggedIn ? (
                    <div className="flex items-center gap-4 sm:gap-7">

                        {/* Mensagens */}
                        <Link
                            href="/chat"
                            className="text-reuse-white transition hover:text-reuse-pink"
                            aria-label="Mensagens"
                        >
                            <MessageCircle size={22} strokeWidth={1.8} />
                        </Link>

                        {/* Notificações */}
                        <Link
                            href="/notificacoes"
                            className="relative text-reuse-white transition hover:text-reuse-pink"
                            aria-label="Notificações"
                        >
                            <Bell size={22} strokeWidth={1.8} />

                            {unreadCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-reuse-pink text-[9px] font-bold text-reuse-brown">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </Link>

                        {/* Sacola */}
                        <Link
                            href="/vitrine"
                            className="text-reuse-white transition hover:text-reuse-pink"
                            aria-label="Explorar vitrine"
                        >
                            <ShoppingBag
                                size={21}
                                strokeWidth={1.8}
                            />
                        </Link>

                        {/* Foto + Menu */}
                        <div
                            ref={profileRef}
                            className="relative"
                        >
                            <button
                                ref={profileButtonRef}
                                type="button"
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="relative h-8 w-8 overflow-hidden rounded-full transition hover:ring-2 hover:ring-reuse-pink"
                                aria-label={profileOpen ? "Fechar menu do perfil" : "Abrir menu do perfil"}
                                aria-expanded={profileOpen}
                                aria-controls="profile-menu"
                            >
                                <SpriteImage
                                    src={avatarSource}
                                    alt="Meu perfil"
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                />
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                <nav
                                    id="profile-menu"
                                    aria-label="Menu do perfil"
                                    className="absolute right-0 top-11 z-50 w-[260px] overflow-hidden rounded-2xl bg-reuse-cream shadow-xl"
                                >

                                    {/* Cabeçalho */}
                                    <Link
                                        href="/perfil"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-4 transition hover:bg-reuse-pink/20"
                                    >
                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                            <SpriteImage
                                                src={avatarSource}
                                                alt="Meu perfil"
                                                fill
                                                sizes="40px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-reuse-brown">
                                                Meu perfil
                                            </p>

                                            <p className="text-xs text-reuse-brown-light">
                                                Ver perfil
                                            </p>
                                        </div>
                                    </Link>

                                    <div className="h-px bg-reuse-brown/10" />

                                    {/* Opções principais */}
                                    <div className="p-2">

                                        <Link
                                            href="/perfil"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <User size={18} />
                                            <span>Meu perfil</span>
                                        </Link>

                                        <Link
                                            href="/perfil"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <Package size={18} />
                                            <span>Meus itens</span>
                                        </Link>

                                        <Link
                                            href="/notificacoes"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <Bell size={18} />
                                            <span>Notificações</span>

                                            {unreadCount > 0 && (
                                                <span className="ml-auto rounded-full bg-reuse-pink px-2 py-0.5 text-[10px] font-bold text-reuse-brown">
                                                    {unreadCount > 9
                                                        ? "9+"
                                                        : unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    </div>

                                    <div className="h-px bg-reuse-brown/10" />

                                    {/* Configurações */}
                                    <div className="p-2">

                                        <Link
                                            href="/perfil/editar"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                        >
                                            <Settings size={18} />
                                            <span>Configurações</span>
                                        </Link>

                                    </div>

                                    <div className="h-px bg-reuse-brown/10" />

                                    {/* Sair */}
                                    <form action={signOut}>
                                        <div className="p-2">
                                            <button
                                                type="submit"
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-reuse-brown transition hover:bg-reuse-pink/20"
                                            >
                                                <LogOut size={18} />
                                                <span>Sair</span>
                                            </button>
                                        </div>
                                    </form>

                                </nav>
                            )}
                        </div>
                    </div>
                ) : (
                    <Button href="/login">
                        Entrar
                    </Button>
                )}
            </div>

            <nav
                aria-label="Navegação principal"
                className="mx-auto mt-3 flex max-w-7xl items-center justify-center gap-7 border-t border-reuse-cream/15 pt-3 text-sm text-reuse-white lg:hidden"
            >
                <Link href="/vitrine" className="transition hover:text-reuse-pink">
                    Vitrine
                </Link>
                <Link href="/#categorias" className="transition hover:text-reuse-pink">
                    Categorias
                </Link>
                <Link href="/sobre" className="transition hover:text-reuse-pink">
                    Sobre
                </Link>
            </nav>
        </header >
    );
}
