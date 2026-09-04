import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { formatItemForCard } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();

  const items = await prisma.item.findMany({
    where: { status: "ATIVO" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const products = items.map(formatItemForCard);

  const unreadCount = user ? await getUnreadNotificationCount(user.id) : 0;

  return (
    <>
      <Header loggedIn={!!user} avatarUrl={user?.avatarUrl} unreadCount={unreadCount} />

      <main className="min-h-screen w-full bg-reuse-cream pb-20">

        <Hero />

        {/* CATEGORIAS */}
        <section className="mx-auto mt-16 w-full max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-reuse-brown">
            Descubra por categorias
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <CategoryCard
              title="Peças raras"
              description="Se apaixone por peças clássicas"
              image="/images/categorias/camera.png"
              href="/pecas-raras"
            />

            <CategoryCard
              title="Sapatos para todos os gostos"
              description="Encontre seu par perfeito"
              image="/images/categorias/tenis.png"
              href="/sapatos"
            />

            <CategoryCard
              title="Eletrônicos"
              description="Usados sim, mas continuam tinindo"
              image="/images/categorias/notebook.png"
              href="/eletronicos"
            />

            <CategoryCard
              title="Para sua casa"
              description="Decoração com estilo único para você inovar"
              image="/images/categorias/sofa.png"
              href="/moveis"
            />
          </div>
        </section>

        {/* PRODUTOS */}
        <section className="mx-auto mt-16 w-full max-w-7xl px-6">

          <h2 className="text-2xl font-bold text-reuse-brown">
            Produtos perto de você
          </h2>

          <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-2">

            {products.map((product) => (
              <Link key={product.id} href={`/produto/${product.id}`}>
                <ProductCard
                  name={product.name}
                  condition={product.condition}
                  distance={product.distance}
                  type={product.type}
                  image={product.image}
                />
              </Link>
            ))}

            {products.length === 0 && (
              <p className="text-sm text-reuse-brown-light">
                Nenhum item publicado ainda.
              </p>
            )}

          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/vitrine"
              className="rounded-xl bg-reuse-pink px-8 py-3 text-sm font-semibold text-reuse-brown transition hover:scale-105"
            >
              Ver mais
            </Link>
          </div>

        </section>

        {/* BANNER APP */}

        <section id="reuse" className="relative mx-auto mt-30 flex h-64 w-full max-w-275 items-center overflow-visible rounded-2xl bg-reuse-pink">

          {/* Conteúdo */}
          <div className="absolute left-27.25 top-1/2 flex w-96 -translate-y-1/2 flex-col items-start gap-2">

            {/* Logo */}
            < Image
              src="/images/logo/ReUse-marrom.png"
              alt="ReUse"
              width={351}
              height={39}
              className="h-auto w-351 object-contain"
            />

            {/* Título */}
            <h2 className="font-(--font-krona) text-3xl leading-9 text-reuse-brown">
              BAIXE AGORA O APP
            </h2>

            {/* Texto */}
            <p className="font-(--font-krona) text-base leading-6 text-reuse-brown">
              <span className="font-bold">+ 1.240 itens</span>{" "}
              ganharam um novo destino este mês.
            </p>


          </div>

          {/* Imagem */}
          <Image
            src="/images/app/celular.png"
            alt="Aplicativo ReUse"
            width={395}
            height={298}
            className="absolute right-12 bottom-0 h-298px w-auto object-contain"
          />

        </section>
      </main>

      <Footer />
    </>
  );
}