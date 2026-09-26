export const ASSISTANT_INTENTS = Object.freeze({
  PAUSAR: "PAUSAR",
  RETOMAR: "RETOMAR",
  RESUMIR: "RESUMIR",
  ORIENTAR_PUBLICACAO: "ORIENTAR_PUBLICACAO",
  DESCONHECIDO: "DESCONHECIDO",
});

export function normalizeAssistantText(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function detectLocalIntent(message) {
  const text = normalizeAssistantText(message);

  if (/\b(retom|reativ|reabr|ativar)/.test(text)) {
    return ASSISTANT_INTENTS.RETOMAR;
  }

  if (/\b(paus|arquiv|desativ|ocult)/.test(text)) {
    return ASSISTANT_INTENTS.PAUSAR;
  }

  if (/(resum|quant|status|situacao|vitrine)/.test(text)) {
    return ASSISTANT_INTENTS.RESUMIR;
  }

  if (/(publicar|cadastrar|anunciar|novo item|nova oferta)/.test(text)) {
    return ASSISTANT_INTENTS.ORIENTAR_PUBLICACAO;
  }

  return ASSISTANT_INTENTS.DESCONHECIDO;
}

const WATSON_INTENT_MAP = Object.freeze({
  pausar: ASSISTANT_INTENTS.PAUSAR,
  pausar_ofertas: ASSISTANT_INTENTS.PAUSAR,
  pausar_anuncios: ASSISTANT_INTENTS.PAUSAR,
  retomar: ASSISTANT_INTENTS.RETOMAR,
  retomar_ofertas: ASSISTANT_INTENTS.RETOMAR,
  reativar_anuncios: ASSISTANT_INTENTS.RETOMAR,
  resumir: ASSISTANT_INTENTS.RESUMIR,
  resumir_vitrine: ASSISTANT_INTENTS.RESUMIR,
  consultar_vitrine: ASSISTANT_INTENTS.RESUMIR,
  orientar_publicacao: ASSISTANT_INTENTS.ORIENTAR_PUBLICACAO,
  publicar_item: ASSISTANT_INTENTS.ORIENTAR_PUBLICACAO,
  como_publicar: ASSISTANT_INTENTS.ORIENTAR_PUBLICACAO,
});

export function mapWatsonIntent(intentName) {
  const key = normalizeAssistantText(intentName).replace(/ /g, "_");
  return WATSON_INTENT_MAP[key] ?? ASSISTANT_INTENTS.DESCONHECIDO;
}
