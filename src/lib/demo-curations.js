// Curadorias explicitamente demonstrativas. Não representam geolocalização do visitante.
// A combinação de título, localização e anunciante evita capturar anúncios homônimos.
export const NEARBY_DEMO_ITEMS = [
  { title: "Fone bluetooth over-ear", location: "Bela Vista, São Paulo, SP", sellerEmails: ["paulosilva@reuse.com", "paulo.silva@email.com"] },
  { title: "Mesa lateral redonda", location: "Bela Vista, São Paulo, SP", sellerEmails: ["mariasilva@reuse.com", "maria.silva@email.com"] },
  { title: "Air fryer compacta", location: "Bela Vista, São Paulo, SP", sellerEmails: ["joaosouza@reuse.com", "joao.souza@email.com"] },
  { title: "Smartphone preto 256 GB", location: "Liberdade, São Paulo, SP", sellerEmails: ["joaosouza@reuse.com", "joao.souza@email.com"] },
  { title: "O Pequeno Príncipe", location: "Liberdade, São Paulo, SP", sellerEmails: ["luanamaranhao@reuse.com", "luana.maranhao@email.com"] },
  { title: "Caixa de transporte para pets", location: "Liberdade, São Paulo, SP", sellerEmails: ["paulosilva@reuse.com", "paulo.silva@email.com"] },
];

export const RARE_PIECES_DEMO_ITEMS = [
  { title: "Câmera vintage", sellerEmails: ["mariasilva@reuse.com", "maria.silva@email.com"] },
  { title: "Cadeira de Madeira Estilo Søborg Anos 50", sellerEmails: ["mariasilva@reuse.com", "maria.silva@email.com"] },
  { title: "Jaqueta de couro", sellerEmails: ["mariasilva@reuse.com", "maria.silva@email.com"] },
  { title: "Dom Casmurro", sellerEmails: ["joaosouza@reuse.com", "joao.souza@email.com"] },
];

export function demoItemFilter({ title, sellerEmails, location }) {
  return {
    title,
    ...(location ? { location } : {}),
    seller: { is: { email: { in: sellerEmails } } },
  };
}

export function demoItemOrderEntries(items) {
  return items.flatMap((item, index) =>
    item.sellerEmails.map((email) => [`${email}:${item.title}`, index])
  );
}
