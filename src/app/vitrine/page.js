import Header from "@/components/Header";
import ProfileItemCard from "@/components/ProfileItemCard";

const products = [
    {
        id: 1,
        name: "Cadeira de madeira",
        condition: "Usado • Bom estado",
        distance: "2 km de você",
        type: "Venda",
        image: "/images/itens/cadeira.jpg",
    },
    {
        id: 2,
        name: "Teclado gamer",
        condition: "Usado • Bom estado",
        distance: "2 km de você",
        type: "Doação",
        image: "/images/itens/teclado.jpg",
    },
    {
        id: 3,
        name: "Câmera vintage",
        condition: "Bom estado",
        distance: "3 km de você",
        type: "Venda",
        image: "/images/itens/camera-vintage.jpg",
        category: "vendas",
    },
    {
        id: 4,
        name: "Iphone 17",
        condition: "Usado • Ótimo estado",
        distance: "2 km de você",
        type: "Venda",
        image: "/images/itens/iphone17.png",
    },
    {
        id: 5,
        name: "Jaqueta de couro",
        condition: "Usado • Tam 40",
        distance: "1,4 km de você",
        type: "Troca",
        image: "/images/itens/jaqueta.jpg",
    },
    {
        id: 6,
        name: "Tênis Adidas Pink",
        condition: "Usado • Bom estado",
        distance: "2 km de você",
        type: "Venda",
        image: "/images/itens/tenis-adidas.png",
    },
];

export default function Vitrine() {
    return (
        <>
            <Header />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <h1 className="text-3xl font-bold">
                    Vitrine
                </h1>

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