/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/adapter-better-sqlite3", "better-sqlite3"],
  },
};

export default nextConfig;
