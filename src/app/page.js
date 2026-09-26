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
              href="/vitrine?q=vintage"
            />

            <CategoryCard
              title="Sapatos para todos os gostos"
              description="Encontre seu par perfeito"
              image="/images/categorias/tenis.png"
              href="/vitrine?categoria=sapatos"
            />

            <CategoryCard
              title="Eletrônicos"
              description="Usados sim, mas continuam tinindo"
              image="/images/categorias/notebook.png"
              href="/vitrine?categoria=eletronicos"
            />

            <CategoryCard
              title="Para sua casa"
              description="Decoração com estilo único para você inovar"
              image="/images/categorias/sofa.png"
              href="/vitrine?categoria=moveis"
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

        <section
          id="reuse"
          className="relative mx-6 mt-20 flex min-h-64 max-w-275 overflow-hidden rounded-2xl bg-reuse-pink px-6 py-10 md:mx-auto md:mt-30 md:h-64 md:items-center md:overflow-visible md:px-0 md:py-0"
        >

          {/* Conteúdo */}
          <div className="relative z-10 flex w-full max-w-sm flex-col items-start gap-2 md:absolute md:left-27.25 md:top-1/2 md:w-96 md:-translate-y-1/2">

            {/* Logo */}
            <Image
              src="/images/logo/ReUse-marrom.png"
              alt="ReUse"
              width={351}
              height={39}
              className="h-auto w-full max-w-[351px] object-contain"
            />

            {/* Título */}
            <h2 className="font-(--font-krona) text-2xl leading-8 text-reuse-brown md:text-3xl md:leading-9">
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
            className="absolute bottom-0 right-12 hidden h-[298px] w-auto object-contain md:block"
          />

        </section>
      </main>

      <Footer />
    </>
  );
}
