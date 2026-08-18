const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Hash do script inline em app/layout.tsx (evita flash de tema claro/escuro).
  // Se esse script for editado, o hash precisa ser recalculado.
  // Em dev, o Next usa eval() para o Hot Module Reload — 'unsafe-eval' só
  // é liberado aqui, nunca em produção.
  `script-src 'self' 'sha256-iBb1ek/DZ7w8zddn0N9I0LOz7Et6YSA/6XHfrPP1MnE='${
    isDev ? " 'unsafe-eval'" : ""
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "media-src 'self' https:",
  // Em dev, o Next abre um WebSocket (ws:) na própria origem para o HMR.
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS só faz sentido (e só é seguro) em produção com HTTPS de verdade —
  // em localhost/HTTP ele faz o navegador "lembrar" de forçar HTTPS na
  // própria máquina, o que quebra o acesso ao servidor de dev depois.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
