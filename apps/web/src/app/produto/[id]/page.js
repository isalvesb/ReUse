import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import SellerCard from "@/components/SellerCard";
import BackButton from "@/components/BackButton";
import { MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CatalogUnavailable from "@/components/CatalogUnavailable";
import { readCatalog } from "@/lib/catalog-availability.mjs";
import { catalogDetail } from "@/lib/catalog-domain.mjs";
import { getCurrentUser, getUnreadNotificationCount } from "@/lib/current-user";
import { CONDITION_LABELS, TYPE_LABELS, formatPrice } from "@/lib/format";
import { getItemImage } from "@/lib/item-image.mjs";

export const dynamic = "force-dynamic";

const TYPE_BADGE_CLASSES = {
  VENDA: "bg-[#ffe4a1] text-[#78350f]",
  TROCA: "bg-[#e0c3fc] text-[#4a1d96]",
  DOACAO: "bg-[#d9ead3] text-[#285430]",
};

export default async function DetalheProduto({ params }) {
  const { id } = await params;

  const viewer = await getCurrentUser();
  let result;
  try {
    result = await readCatalog(() => catalogDetail(prisma, id, viewer?.id));
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  if (!result.available)
    return (
      <>
        <Header loggedIn={!!viewer} />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <CatalogUnavailable />
        </main>
        <Footer />
      </>
    );
  const dto = result.items;
  const product = {
    ...dto,
    images: dto.images.map((url) => ({ url })),
    sellerId: dto.seller.id,
  };
  const sellerItemsCount = dto.seller.activeItemsCount;

  const unreadCount = viewer ? await getUnreadNotificationCount(viewer.id) : 0;

  const isOwnItem = viewer?.id === product.sellerId;

  return (
    <>
      <Header
        loggedIn={!!viewer}
        avatarUrl={viewer?.avatarUrl}
        avatarKey={viewer?.id}
        unreadCount={unreadCount}
      />

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        {/* Voltar */}
        <BackButton
          fallback="/vitrine"
          className="mb-8 inline-flex items-center gap-2 text-base font-medium text-[#342a2a] md:-ml-8"
        >
          Voltar
        </BackButton>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,487px)_minmax(0,1fr)] lg:items-stretch lg:gap-12">
          <ProductGallery
            mainImage={getItemImage(product)}
            mainAlt={product.title}
            thumbnails={product.images.map((image) => image.url)}
            ribbonLabel={TYPE_LABELS[product.type] ?? product.type}
            ribbonClasses={
              TYPE_BADGE_CLASSES[product.type] ??
              "bg-reuse-cream text-reuse-brown"
            }
          />

          <section className="flex min-w-0 flex-col lg:min-h-[487px]">
            <div>
              <p className="text-sm font-medium text-reuse-brown-light">
                {product.category.name}
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-reuse-brown">
                {product.title}
              </h1>

              {product.type === "VENDA" && product.price && (
                <p className="mt-4 text-2xl font-bold text-reuse-brown">
                  {formatPrice(product.price)}
                </p>
              )}

              <p className="mt-4 text-sm text-reuse-brown-light">
                {CONDITION_LABELS[product.condition] ?? product.condition}
              </p>
              {product.location && (
                <p className="mt-2 flex items-start gap-2 text-sm text-reuse-brown-light">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="break-words">{product.location}</span>
                </p>
              )}
            </div>

            <section
              aria-labelledby="product-description-title"
              className="mt-6 rounded-2xl border border-reuse-brown/15 bg-reuse-white/65 px-5 py-4"
            >
              <h2
                id="product-description-title"
                className="text-base font-semibold text-reuse-brown"
              >
                Descrição do item
              </h2>
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-reuse-brown-light">
                {product.description}
              </p>
            </section>

            {isOwnItem && (
              <a
                href={`/perfil/anuncios/${product.id}`}
                className="mt-5 inline-block rounded-xl bg-reuse-pink p-4"
              >
                Editar anúncio
              </a>
            )}
            {!isOwnItem && (
              <div className="mt-auto pt-5">
                <SellerCard
                  name={product.seller.name}
                  image={product.seller.avatarUrl}
                  itemsCount={sellerItemsCount}
                  rating={product.seller.rating.toFixed(1)}
                  sellerId={product.seller.id}
                  href={viewer ? `/chat?itemId=${product.id}` : "/login"}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
