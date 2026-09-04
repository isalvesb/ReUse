import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import SellerCard from "@/components/SellerCard";
import { MapPin, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { CONDITION_LABELS, TYPE_LABELS, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DetalheProduto({ params }) {
    const { id } = await params;

    const [product, viewer] = await Promise.all([
        prisma.item.findUnique({
            where: { id },
            include: {
                images: { orderBy: { position: "asc" } },
                category: true,
                seller: true,
            },
        }),
        getCurrentUser(),
    ]);

    if (!product) {
        notFound();
    }

    const sellerItemsCount = await prisma.item.count({
        where: { sellerId: product.sellerId, status: "ATIVO" },
    });

    const unreadCount = viewer ? await getUnreadNotificationCount(viewer.id) : 0;

    const isOwnItem = viewer?.id === product.sellerId;

    return (
        <>
            <Header loggedIn={!!viewer} avatarUrl={viewer?.avatarUrl} unreadCount={unreadCount} />

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
                        mainImage={product.images[0]?.url ?? "/images/itens/cadeira.png"}
                        mainAlt={product.title}
                        thumbnails={product.images.map((image) => image.url)}
                    />

                    {/* INFORMAÇÕES */}
                    <section>

                        {/* INFORMAÇÕES DO PRODUTO */}
                        <div className="mb-8 w-[343px]">

                            <p className="mb-3 text-sm font-medium text-reuse-brown-light">
                                {product.category.name}
                            </p>

                            <h1 className="text-2xl font-bold text-reuse-brown">
                                {product.title}
                            </h1>

                            <p className="mt-2 text-sm text-[#584C4C]">
                                {CONDITION_LABELS[product.condition] ?? product.condition}
                            </p>

                            {product.location && (
                                <p className="mt-2 flex gap-1 text-sm text-[#584C4C]">
                                    <MapPin size={20} />
                                    {product.location}
                                </p>
                            )}

                            <div className="mt-4 flex items-center justify-between">

                                {product.type === "VENDA" && product.price && (
                                    <p className="mt-5 text-3xl font-bold text-reuse-brown">
                                        {formatPrice(product.price)}
                                    </p>
                                )}


                                <span className=" rounded-full bg-[#FFE4A1] w-fit h-8 px-4 py-1 text-sm font-medium text-[#78350F]">
                                    {TYPE_LABELS[product.type] ?? product.type}
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
                        {!isOwnItem && (
                            <SellerCard
                                name={product.seller.name}
                                image={product.seller.avatarUrl || "/images/perfil/avatar.png"}
                                itemsCount={sellerItemsCount}
                                rating={product.seller.rating.toFixed(1)}
                                href={viewer ? `/chat-anunciante?itemId=${product.id}` : "/login"}
                            />
                        )}

                    </section>

                </div>

            </main>

            <Footer />
        </>
    );
}
