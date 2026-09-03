import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import SellerCard from "@/components/SellerCard";
import { MapPin, ArrowLeft } from "lucide-react";
import { products } from "@/data/products";
import { notFound } from "next/navigation";
import Link from "next/link";


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

                {/* Voltar */}
                <Link
                    href="/vitrine"
                    className="-ml-8 mb-8 inline-flex items-center gap-2 text-1rem font-medium text-[#342a2a]"
                >
                    <ArrowLeft size={20} />
                    Voltar
                </Link>


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

                            <p className="mb-3 text-sm font-medium text-reuse-brown-light">
                                {product.category}
                            </p>

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

                                {product.price && (
                                    <p className="mt-5 text-3xl font-bold text-reuse-brown">
                                        {product.price}
                                    </p>
                                )}


                                <span className=" rounded-full bg-[#FFE4A1] w-fit h-8 px-4 py-1 text-sm font-medium text-[#78350F]">
                                    {product.type}
                                </span>



                            </div>

                        </div>

                        {/* DESCRIÇÃO */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-reuse-brown">
                                Descrição do item
                            </h2>

                            <p className="mt-3 mb-9 w-[491px] whitespace-pre-line leading-7 text-reuse-brown-light">
                                {product.description}
                            </p>
                        </div>

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