const remotePatterns = [
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
  },
  {
    protocol: "https",
    hostname: "platform-lookaside.fbsbx.com",
  },
  {
    protocol: "https",
    hostname: "**.fbcdn.net",
  },
];

if (process.env.SUPABASE_URL) {
  const supabaseUrl = new URL(process.env.SUPABASE_URL);

  remotePatterns.push({
    protocol: supabaseUrl.protocol.replace(":", ""),
    hostname: supabaseUrl.hostname,
    port: supabaseUrl.port,
    pathname: "/storage/v1/object/public/**",
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  reactCompiler: true,

  experimental: {
    serverActions: {
      // Formulário de publicar item envia até 5 fotos
      bodySizeLimit: "15mb",
    },
  },

  images: {
    remotePatterns,
  },

  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    if (process.env.NODE_ENV === "production") {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
