export const CONDITION_LABELS = {
    NOVO: "Novo",
    USADO_COMO_NOVO: "Usado • Como novo",
    USADO_BOM_ESTADO: "Usado • Bom estado",
    USADO_ESTADO_REGULAR: "Usado • Estado regular",
};

export const TYPE_LABELS = {
    VENDA: "Venda",
    TROCA: "Troca",
    DOACAO: "Doação",
};

export function formatPrice(price) {
    if (price === null || price === undefined) {
        return null;
    }

    const value = typeof price === "object" && "toNumber" in price
        ? price.toNumber()
        : Number(price);

    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function formatItemForCard(item) {
    return {
        id: item.id,
        name: item.title,
        category: item.category?.name ?? "",
        condition: CONDITION_LABELS[item.condition] ?? item.condition,
        distance: item.location ?? "Combinar com o anunciante",
        type: TYPE_LABELS[item.type] ?? item.type,
        price: item.type === "VENDA" ? formatPrice(item.price) : null,
        image: item.images?.[0]?.url ?? "/images/itens/cadeira.png",
    };
}
