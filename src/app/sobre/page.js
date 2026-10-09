import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";

export const dynamic = "force-dynamic";

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
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-reuse-beige">
                            Sobre o ReUse
                        </p>
                        <h1 className="mt-4 font-(--font-krona) text-5xl leading-tight text-reuse-brown md:text-6xl">
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

                    <div className="relative overflow-hidden rounded-[32px] bg-reuse-brown px-8 py-10 text-reuse-cream md:px-10 md:py-12">
                        <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-reuse-pink/20" />
                        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-reuse-beige/20" />
                        <div className="relative">
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
                    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:px-10 md:py-18 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
                        <h2 className="text-3xl font-bold text-reuse-brown">
                            O que é o ReUse
                        </h2>
                        <p className="max-w-3xl text-lg leading-8 text-reuse-brown-light">
                            O ReUse é uma plataforma para colocar itens usados novamente em circulação. Pessoas podem anunciar, comprar, trocar ou doar produtos, prolongando sua vida útil e se conectando diretamente com quem tem interesse neles.
                        </p>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 md:py-20">
                    <div className="max-w-2xl">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-reuse-beige">
                            Passo a passo
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-reuse-brown">
                            Como funciona
                        </h2>
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

                <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 pb-16 md:px-10 md:pb-20 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-reuse-beige">
                            Escolhas com continuidade
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-reuse-brown">
                            Por que reutilizar
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-7 text-reuse-brown-light">
                            Reutilizar ajuda produtos em bom estado a continuarem úteis e torna mais simples encontrar alternativas antes de comprar algo novo ou descartar o que já existe.
                        </p>
                    </div>

                    <ul className="space-y-3 rounded-3xl bg-reuse-pink/30 p-6 md:p-8">
                        {BENEFITS.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-3 text-reuse-brown">
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-reuse-brown" />
                                <span className="leading-6">{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="px-6 pb-16 md:px-10 md:pb-24">
                    <div className="mx-auto max-w-7xl rounded-[32px] bg-reuse-pink px-6 py-10 text-center md:px-10 md:py-14">
                        <h2 className="text-3xl font-bold text-reuse-brown">
                            Tem algo parado que ainda pode ser útil?
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl leading-7 text-reuse-brown-light">
                            Explore o que já está disponível ou publique um item para que ele encontre um novo caminho.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button href="/vitrine" variant="secondary">
                                Explorar a Vitrine
                            </Button>
                            <Button href="/perfil#publicar-item" variant="outline">
                                Publicar item
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
