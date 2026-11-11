// Same meaning as the Web profile: counts of listings, never completed trades.
// Accepts raw listings, Web cards or grouped Prisma rows.
export function itemStatistics(items) {
  const stats = {
    totalItems: 0,
    activeItems: 0,
    pausedItems: 0,
    donationItems: 0,
    tradeItems: 0,
    saleItems: 0,
  };
  for (const item of items) {
    const count = item._count?._all ?? 1;
    stats.totalItems += count;
    if (item.status === "ATIVO") stats.activeItems += count;
    if (item.status === "INATIVO") stats.pausedItems += count;
    const field = {
      DOACAO: "donationItems",
      TROCA: "tradeItems",
      VENDA: "saleItems",
    }[item.negotiationType || item.type];
    if (field) stats[field] += count;
  }
  return stats;
}
