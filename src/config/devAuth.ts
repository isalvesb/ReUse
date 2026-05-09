// Controle temporário para desenvolvimento.
// Quando EXPO_PUBLIC_DEV_SKIP_AUTH for "true", o app pula o fluxo de login/cadastro e abre direto as telas internas.

export const DEV_SKIP_AUTH =
  process.env.EXPO_PUBLIC_DEV_SKIP_AUTH === "false";