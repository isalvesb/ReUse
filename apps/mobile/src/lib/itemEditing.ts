import type { Item } from "../Services/Items";
import { conditionForForm } from "./itemCondition";
export function prepareItemForEditing(item: Item | null, email: string | null) {
  if (!item || !email || item.user_email?.toLowerCase() !== email.toLowerCase()) {
    throw new Error("Não foi possível abrir um anúncio seu para edição.");
  }
  return {...item, condition:conditionForForm(item.item_condition)};
}
