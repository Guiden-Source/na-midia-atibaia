/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
  typescript: {
    ignoreBuildErrors: true, // Temporário para deploy
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporário para deploy
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      // Supabase Storage (substitua pelo seu projeto)
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: '*.vtexassets.com' },
      { protocol: 'https', hostname: 'http2.mlstatic.com' }, // Mercado Livre
    ],
  },
};

export default nextConfig;
