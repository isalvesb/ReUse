import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
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
      <Header loggedIn={!!user} avatarUrl={user?.avatarUrl} avatarKey={user?.id} unreadCount={unreadCount} />

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

      </main>

      <Footer />
    </>
  );
}
