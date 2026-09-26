import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-reuse-brown px-8 py-12 text-reuse-cream">
            <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">

                {/* Logo */}
                <div>
                    <Image
                        src="/images/logo/ReUse-creme.png"
                        alt="ReUse"
                        width={187}
                        height={23}
                    />
                </div>

                {/* Categorias */}
                <div>
                    <h3 className="mb-4 font-bold">
                        Categorias
                    </h3>

                    <ul className="space-y-3 text-sm text-reuse-white">
                        <li>
                            <Link href="/vitrine?q=vintage">Peças raras</Link>
                        </li>

                        <li>
                            <Link href="/vitrine?categoria=sapatos">Sapatos</Link>
                        </li>

                        <li>
                            <Link href="/vitrine?categoria=moveis">Móveis</Link>
                        </li>

                        <li>
                            <Link href="/vitrine?categoria=eletronicos">Eletrônicos</Link>
                        </li>

                        <li>
                            <Link href="/vitrine?categoria=livros">Livros</Link>
                        </li>
                    </ul>
                </div>

                {/* Conta */}
                <div>
                    <h3 className="mb-4 font-bold">
                        Minha Conta
                    </h3>

                    <ul className="space-y-3 text-sm text-reuse-white">
                        <li>
                            <Link href="/perfil">
                                Minha Vitrine
                            </Link>
                        </li>

                        <li>
                            <Link href="/vitrine?tipo=TROCA">
                                Explorar trocas
                            </Link>
                        </li>

                        <li>
                            <Link href="/perfil">
                                Perfil
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Sobre */}
                <div>
                    <h3 className="mb-4 font-bold">
                        Consumo consciente
                    </h3>

                    <p className="text-sm leading-6 text-reuse-white">
                        Doe, troque ou venda itens para prolongar sua vida útil e reduzir desperdícios.
                    </p>
                </div>

            </div>

            <div className="mx-auto mt-12 max-w-7xl border-t border-reuse-cream pt-6 text-center text-xs text-reuse-cream">
                ReUse © 2026 - Todos os direitos reservados
            </div>
        </footer>
    );
}
