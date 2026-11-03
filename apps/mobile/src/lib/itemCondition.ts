export type ItemCondition = "Novo" | "Usado • Como novo" | "Usado • Bom estado" | "Usado • Estado Regular";
const labels: Record<string, ItemCondition> = {
  novo:"Novo", como_novo:"Usado • Como novo", bom_estado:"Usado • Bom estado", regular:"Usado • Estado Regular",
  "usado • como novo":"Usado • Como novo", "usado • bom estado":"Usado • Bom estado", "usado • estado regular":"Usado • Estado Regular",
};
export function conditionForForm(value: string) { return labels[value?.toLowerCase()] || null; }
export function conditionLabel(value: string) { return conditionForForm(value) || value || "Condição não informada"; }
