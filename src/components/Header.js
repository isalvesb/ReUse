import Link from "next/link";
import Image from "next/image";
import { Search, Bell, ShoppingBag } from "lucide-react";
import Button from "@/components/Button";

export default function Header({ loggedIn = false }) {
    return (
        <header className="w-full bg-reuse-brown px-6 py-3 shrink-0">
            <div className="mx-auto flex h-[46px] max-w-[1344px] items-center justify-between gap-6">

                {/* Logo */}
                <Link href="/">
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
                <div className="hidden w-[350px] md:flex">
                    <div className="flex h-10 w-full items-center rounded-2xl bg-reuse-cream px-4">
                        <input
                            type="text"
                            placeholder="Busque sapato, poltrona, notebook..."
                            className="w-full bg-transparent text-sm text-reuse-brown outline-none placeholder:text-reuse-brown-light"
                        />

                        <Search
                            size={20}
                            strokeWidth={2}
                            className="text-reuse-brown"
                        />
                    </div>
                </div>

                {/* Navegação */}
                <nav className="hidden items-center gap-8 text-sm text-reuse-white lg:flex">

                    <Link
                        href="/eletronicos"
                        className="hover:text-reuse-pink transition"
                    >
                        Eletrônicos
                    </Link>

                    <Link
                        href="/roupas"
                        className="hover:text-reuse-pink transition"
                    >
                        Roupas
                    </Link>

                    <Link
                        href="/moveis"
                        className="hover:text-reuse-pink transition"
                    >
                        Móveis
                    </Link>

                    <Link
                        href="/livros"
                        className="hover:text-reuse-pink transition"
                    >
                        Livros
                    </Link>

                    {loggedIn && (
                        <Link
                            href="/vitrine"
                            className="font-bold hover:text-reuse-pink transition"
                        >
                            Minha Vitrine
                        </Link>
                    )}
                </nav>

                {/* Área do usuário */}
                {loggedIn ? (
                    <div className="flex items-center gap-7">

                        {/* Notificações */}
                        <Link
                            href="/notificacoes"
                            className="relative text-reuse-white hover:text-reuse-pink transition"
                            aria-label="Notificações"
                        >
                            <Bell size={22} strokeWidth={1.8} />

                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-reuse-pink text-[9px] font-bold text-reuse-brown">
                                1
                            </span>
                        </Link>

                        {/* Sacola */}
                        <Link
                            href="/vitrine"
                            className="text-reuse-white hover:text-reuse-pink transition"
                            aria-label="Minha sacola"
                        >
                            <ShoppingBag
                                size={21}
                                strokeWidth={1.8}
                            />
                        </Link>

                        {/* Foto do usuário */}
                        <Link
                            href="/perfil"
                            aria-label="Meu perfil"
                        >
                            <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                <Image
                                    src="/images/perfil/maria-silva.png"
                                    alt="Meu perfil"
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                />
                            </div>
                        </Link>

                    </div>
                ) : (
                    <Button href="/login">
                        Entrar
                    </Button>
                )}
            </div>
        </header>
    );
}