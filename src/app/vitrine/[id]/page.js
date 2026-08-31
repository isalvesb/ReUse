import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import SellerCard from "@/components/SellerCard";
import { MapPin } from "lucide-react";

export default function DetalheProduto() {
    return (
        <>
            <Header loggedIn />

            <main className="mx-auto max-w-6xl px-6 py-20">

                <div className="grid gap-10 md:grid-cols-2">

                    {/* GALERIA */}
                    <ProductGallery
                        mainImage="/images/itens/cadeira.png"
                        mainAlt="Cadeira de madeira"
                        thumbnails={[
                            "/images/itens/cadeira.png",
                            "/images/itens/cadeira-2.png",
                        ]}
                    />

                    {/* INFORMAÇÕES */}
                    <section>

                        {/* INFORMAÇÕES DO PRODUTO */}
                        <div className="mb-8 w-[343px]">

                            <h1 className="text-2xl font-bold text-reuse-brown">
                                Cadeira de madeira
                            </h1>

                            <p className="mt-2 text-sm text-[#584C4C]">
                                Usado - Bom estado
                            </p>

                            <p className="mt-2 flex gap-1 text-sm text-[#584C4C]">
                                <MapPin size={20} />
                                1 km de você
                            </p>

                            <div className="mt-4 flex items-center justify-between">

                                <span className="rounded-full bg-[#FFE4A1] px-4 py-1 text-xs font-medium text-[#78350F]">
                                    Venda
                                </span>

                                <span className="text-base font-bold text-reuse-brown">
                                    R$ 350
                                </span>

                            </div>

                        </div>

                        {/* DESCRIÇÃO */}
                        <p className="mb-12.5 w-[343px] text-base leading-5 text-reuse-brown">
                            Cadeira de madeira maciça em excelente estado de
                            conservação. Perfeita para sala de jantar ou
                            escritório. O assento é confortável e o design
                            clássico combina com diversos estilos de decoração.
                        </p>

                        {/* VENDEDOR */}
                        <SellerCard
                            name="Maria Silva"
                            image="/images/perfil/maria-silva.png"
                            itemsCount={12}
                            rating={4.8}
                        />

                    </section>

                </div>

            </main>

            <Footer />
        </>
    );
}