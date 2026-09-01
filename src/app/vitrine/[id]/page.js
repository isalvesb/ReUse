import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import SellerCard from "@/components/SellerCard";
import { MapPin } from "lucide-react";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

export default async function DetalheProduto({ params }) {
    const { id } = await params;

    const product = products.find(
        (item) => item.id === Number(id)
    );

    if (!product) {
        notFound();
    }

    return (
        <>
            <Header loggedIn />

            <main className="mx-auto max-w-6xl px-6 py-20">

                <div className="grid gap-10 md:grid-cols-2">

                    {/* GALERIA */}
                    <ProductGallery
                        mainImage={product.image}
                        mainAlt={product.name}
                        thumbnails={product.thumbnails}
                    />

                    {/* INFORMAÇÕES */}
                    <section>

                        {/* INFORMAÇÕES DO PRODUTO */}
                        <div className="mb-8 w-[343px]">

                            <h1 className="text-2xl font-bold text-reuse-brown">
                                {product.name}
                            </h1>

                            <p className="mt-2 text-sm text-[#584C4C]">
                                {product.condition}
                            </p>

                            <p className="mt-2 flex gap-1 text-sm text-[#584C4C]">
                                <MapPin size={20} />
                                {product.distance}
                            </p>

                            <div className="mt-4 flex items-center justify-between">

                                <span className="rounded-full bg-[#FFE4A1] px-4 py-1 text-xs font-medium text-[#78350F]">
                                    {product.type}
                                </span>

                                <span className="text-base font-bold text-reuse-brown">
                                    {product.price}
                                </span>

                            </div>

                        </div>

                        {/* DESCRIÇÃO */}
                        <p className="mb-12.5 w-[343px] text-base leading-5 text-reuse-brown">
                            {product.description}
                        </p>

                        {/* VENDEDOR */}
                        <SellerCard
                            name={product.seller.name}
                            image={product.seller.image}
                            itemsCount={product.seller.itemsCount}
                            rating={product.seller.rating}
                        />

                    </section>

                </div>

            </main>

            <Footer />
        </>
    );
}