/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      // Formulário de publicar item envia até 5 fotos; o padrão de 1MB
      // estoura fácil com fotos reais de celular/câmera.
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
