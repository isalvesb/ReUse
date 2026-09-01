import Header from "@/components/Header";
import ProfileItemCard from "@/components/ProfileItemCard";
import { products } from "@/data/products";


export default function Vitrine({ loggedIn = false }) {
    return (
        <>
            <Header loggedIn={loggedIn} />

            <main className="mx-auto max-w-7xl px-6 py-10">

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
                    {products.map((product) => (
                        <ProfileItemCard
                            key={product.id}
                            {...product}
                        />
                    ))}
                </div>
            </main>
        </>
    );
}