type SearchableItem = { title: string; category: string; description?: string };
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
export function filterCatalog<T extends SearchableItem>(items: T[], query: string, category: string): T[] {
  const terms = normalize(query.trim()).split(/\s+/).filter(Boolean);
  const selected = normalize(category);
  return items.filter(item => {
    const group = normalize(item.category);
    const categoryMatch = !selected || (selected === "infantil" ? /bebe|crianca|infantil|brinquedo/.test(group) : group.includes(selected));
    const haystack = normalize(`${item.title} ${item.category} ${item.description || ""}`);
    return categoryMatch && terms.every(term => haystack.includes(term));
  });
}
