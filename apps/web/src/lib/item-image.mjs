const TITLE_FALLBACKS = [
    { pattern: /\b(iphone|smartphone|celular)\b/i, image: "/images/itens/iphone-17.jpg" },
    { pattern: /\b(tenis|sapato|sapatilha)\b/i, image: "/images/itens/tenis-adidas.png" },
];

const CATEGORY_FALLBACKS = {
    eletronicos: "/images/categorias/notebook.png",
    roupas: "/images/itens/jaqueta.jpg",
    moveis: "/images/categorias/sofa.png",
    livros: "/images/promo/livros.jpg",
    sapatos: "/images/categorias/tenis.png",
    outros: "/images/logo/ReUse-marrom.png",
};

function normalize(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

export function getItemImage(item) {
    const savedImage = item?.images?.[0]?.url?.trim();
    if (savedImage) return savedImage;

    const normalizedTitle = normalize(item?.title);
    const titleFallback = TITLE_FALLBACKS.find(({ pattern }) => pattern.test(normalizedTitle));
    if (titleFallback) return titleFallback.image;

    const categoryKey = normalize(item?.category?.slug || item?.category?.name);
    return CATEGORY_FALLBACKS[categoryKey] ?? "/images/logo/ReUse-marrom.png";
}
