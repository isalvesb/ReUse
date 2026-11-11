import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ownItem } from "@/lib/item-write-domain.mjs";
import { redirect, notFound } from "next/navigation";
import SharedItemForm from "../../SharedItemForm";
export const dynamic = "force-dynamic";
export default async function EditItem({ params }) {
  const actor = await getSession();
  if (!actor) redirect("/login");
  let item;
  try {
    item = await ownItem(prisma, actor, (await params).id);
  } catch (e) {
    if (e.status === 404) notFound();
    throw e;
  }
  const images = item.images.map((i) => ({ id: i.id, url: i.url }));
  const initial = {
    id: item.id,
    title: item.title,
    description: item.description,
    category: { slug: item.category.slug },
    condition: item.condition,
    type: item.type,
    price: item.price?.toString() ?? null,
    location: item.location,
    status: item.status,
    updatedAt: item.updatedAt.toISOString(),
    images,
  };
  return (
    <main className="mx-auto max-w-xl p-6">
      <Link href="/perfil">Voltar ao perfil</Link>
      <h1 className="text-2xl font-bold">Editar anúncio</h1>
      <SharedItemForm initial={initial} />
    </main>
  );
}
