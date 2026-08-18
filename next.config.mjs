const isDev = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  // O App Router do Next.js injeta vários scripts inline por página (dados
  // do React Server Components, hidratação), cada um com conteúdo — e hash —
  // diferente a cada build/render. Bloquear inline scripts exigiria CSP por
  // nonce, mas isso força toda página a renderizar dinamicamente a cada
  // request (perde geração estática) — não vale a pena para um site de
  // conteúdo como este. 'unsafe-inline' ainda impede scripts REMOTOS
  // injetados por um atacante (a proteção mais importante do script-src).
  // Em dev, o Next também usa eval() para o Hot Module Reload.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
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
