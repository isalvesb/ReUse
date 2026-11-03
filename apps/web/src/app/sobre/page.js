import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import Image from "next/image";
import { Syne } from "next/font/google";
import Link from "next/link";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const syne = Syne({ subsets: ["latin"], weight: "800", display: "swap" });

export const metadata = {
    title: "Sobre | ReUse",
    description: "Conheça o ReUse e descubra como comprar, trocar, doar e reutilizar itens.",
};

const STEPS = [
    {
        title: "Publique",
        description: "Cadastre um item que ainda pode continuar em uso.",
    },
    {
        title: "Encontre",
        description: "Explore a Vitrine e encontre itens para comprar, trocar ou receber por doação.",
    },
    {
        title: "Converse",
        description: "Entre em contato com outras pessoas para combinar os detalhes.",
    },
    {
        title: "Reutilize",
        description: "Dê continuidade à história de um produto em vez de descartá-lo.",
    },
];

const BENEFITS = [
    "Reduzir o descarte desnecessário",
    "Economizar ao encontrar itens que continuam úteis",
    "Prolongar a vida útil dos objetos",
    "Facilitar a circulação de itens entre pessoas",
    "Estimular escolhas de consumo mais conscientes",
];

export default async function Sobre() {
    const user = await getCurrentUser();
    const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

    return (
        <>
            <Header
                loggedIn={!!user}
                avatarUrl={user?.avatarUrl}
                avatarKey={user?.id}
                unreadCount={unreadCount}
            />

            <main className="bg-reuse-cream">
                <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
                    <div className="max-w-2xl">
                        <h1 className={`${syne.className} text-[clamp(2.5rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.055em] text-reuse-brown`}>
                            ReUse
                        </h1>
                        <p className="mt-6 text-2xl font-semibold leading-9 text-reuse-brown md:text-3xl md:leading-10">
                            Dê novos ciclos ao que ainda tem muito para oferecer.
                        </p>
                        <p className="mt-5 max-w-xl text-base leading-7 text-reuse-brown-light">
                            O ReUse conecta pessoas interessadas em comprar, trocar e doar itens que ainda podem continuar em uso.
                        </p>
                        <Button href="/vitrine" className="mt-8">
                            Explorar a Vitrine
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-[32px] bg-reuse-brown px-8 py-10 text-reuse-cream md:px-10 md:py-12">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-reuse-pink">
                                Comprar · Trocar · Doar
                            </p>
                            <p className="mt-8 max-w-sm text-2xl font-semibold leading-9 md:text-3xl md:leading-10">
                                Itens mudam de mãos e continuam fazendo parte de novas rotinas.
                            </p>
                            <p className="mt-6 text-sm leading-6 text-reuse-cream/80">
                                Uma forma simples de encontrar novos usos para objetos que ainda têm valor.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-reuse-white/60">
                    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:px-10 md:py-18 lg:grid-cols-[minmax(0,1fr)_minmax(220px,290px)] lg:items-stretch lg:gap-14">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-reuse-brown">O que é o ReUse</h2>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-reuse-brown-light">
                                O ReUse é uma plataforma para colocar itens usados novamente em circulação. Pessoas podem anunciar, comprar, trocar ou doar produtos, prolongando sua vida útil e se conectando diretamente com quem tem interesse neles.
                            </p>
                        </div>
                        <div className="relative mx-auto min-h-[180px] w-full max-w-[290px] lg:min-h-[230px]">
                            <Image
                                src="/images/cta/ImpactoColetivo.png"
                                alt=""
                                fill
                                sizes="(max-width: 1024px) 290px, 290px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
                    <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-reuse-beige">
                                Passo a passo
                            </p>
                            <h2 className="mt-3 text-3xl font-bold text-reuse-brown">
                                Como funciona
                            </h2>
                        </div>
                        <Image
                            src="/images/cta/SucessModal.png"
                            alt=""
                            width={300}
                            height={170}
                            loading="eager"
                            className="h-auto w-full max-w-[260px]"
                        />
                    </div>

                    <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {STEPS.map((step, index) => (
                            <li
                                key={step.title}
                                className="rounded-3xl border border-reuse-brown/10 bg-reuse-white p-6"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-reuse-pink text-sm font-bold text-reuse-brown">
                                    {index + 1}
                                </span>
                                <h3 className="mt-6 text-xl font-bold text-reuse-brown">
                                    {step.title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-reuse-brown-light">
                                    {step.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="bg-[#F3E8D2]">
                    <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] lg:items-stretch lg:gap-16">
                        <div className="flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-reuse-brown">Por que reutilizar?</h2>
                            <p className="mt-5 max-w-xl text-base leading-7 text-reuse-brown-light">
                                Reutilizar ajuda produtos em bom estado a continuarem úteis e torna mais simples encontrar alternativas antes de comprar algo novo ou descartar o que já existe.
                            </p>
                            <ul className="mt-7 space-y-4">
                                {BENEFITS.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-3 text-reuse-brown">
                                        <CheckCircle2 aria-hidden="true" size={21} strokeWidth={2} className="mt-0.5 shrink-0 text-reuse-brown" />
                                        <span className="leading-6">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative min-h-[230px] w-full overflow-hidden rounded-3xl bg-reuse-brown p-6 lg:min-h-[360px]">
                            <Image
                                src="/images/cta/HeroBannerCTA.png"
                                alt=""
                                fill
                                sizes="(max-width: 1024px) 100vw, 480px"
                                className="object-contain p-6"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-[#F3E8D2] px-6 py-16 md:px-10 md:py-24">
                    <div className="mx-auto max-w-7xl rounded-[32px] bg-reuse-brown px-6 py-10 text-center md:px-10 md:py-14">
                        <h2 className="text-3xl font-bold text-reuse-cream">
                            Tem algo parado que ainda pode ser útil?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl leading-7 text-reuse-cream/80">
                            Explore o que já está disponível ou publique um item para que ele encontre um novo caminho.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button href="/vitrine">
                                Explorar a Vitrine
                            </Button>
                            <Link
                                href="/perfil#publicar-item"
                                className="inline-flex items-center justify-center rounded-3xl border border-reuse-cream px-5 py-3 text-sm font-medium text-reuse-cream transition hover:bg-reuse-cream hover:text-reuse-brown"
                            >
                                Publicar item
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
