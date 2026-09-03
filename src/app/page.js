import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Cadeira de madeira",
    condition: "Usado • Bom estado",
    distance: "1 km de você",
    type: "Venda",
    image: "/images/itens/cadeira.jpg",
  },
  {
    id: 2,
    name: "Tênis Adidas Pink",
    condition: "Usado • Bom estado",
    distance: "2 km de você",
    type: "Venda",
    image: "/images/itens/tenis-adidas.png",
  },
  {
    id: 3,
    name: "Jaqueta de couro",
    condition: "Usado • Tam 40",
    distance: "1,4 km de você",
    type: "Troca",
    image: "/images/itens/jaqueta.jpg",
  },
  {
    id: 4,
    name: "iPhone 17 Pro",
    condition: "Usado • Ótimo estado",
    distance: "1,4 km de você",
    type: "Venda",
    image: "/images/itens/iphone17.png",
  },
  {
    id: 5,
    name: "Teclado gamer",
    condition: "Usado • Bom estado",
    distance: "2 km de você",
    type: "Doação",
    image: "/images/itens/teclado.jpg",
  },
  {
    id: 6,
    name: "Canon EOS 60D",
    condition: "Usado • Bom estado",
    distance: "2 km de você",
    type: "Venda",
    image: "/images/itens/canon.png",
  },
];


export default function Home() {
  return (
    <>
      <Header />

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

            <ProductCard
              name="Cadeira de madeira"
              condition="Usado • Bom estado"
              distance="1 km de você"
              type="Venda"
              image="/images/itens/cadeira.jpg"
            />

            <ProductCard
              name="Tênis Adidas Pink"
              condition="Usado • Bom estado"
              distance="2 km de você"
              type="Venda"
              image="/images/itens/tenis-adidas.png"
            />

            <ProductCard
              name="Jaqueta de couro"
              condition="Usado • Tam 40"
              distance="1,4 km de você"
              type="Troca"
              image="/images/itens/jaqueta.jpg"
            />

            <ProductCard
              name="Iphone 17 Pro"
              condition="Usado • Ótimo estado"
              distance="1,4 km de você"
              type="Venda"
              image="/images/itens/iphone17.png"
            />

            <ProductCard
              name="Teclado gamer"
              condition="Usado • Bom estado"
              distance="2 km de você"
              type="Doação"
              image="/images/itens/teclado.jpg"
            />

            <ProductCard
              name="Canon EOS 60D"
              condition="Usado • Bom estado"
              distance="2 km de você"
              type="Venda"
              image="/images/itens/canon.png"
            />

          </div>

          <div className="mt-10 flex justify-center">
            <button className="rounded-xl bg-reuse-pink px-8 py-3 text-sm font-semibold text-reuse-brown transition hover:scale-105">
              Ver mais
            </button>
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