import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */

const APP_BASE_PATH =
  process.env.NEXT_PUBLIC_APP_BASE_PATH?.trim() || '';

const FRONTEND_ROOT = fileURLToPath(new URL('.', import.meta.url));

const nextConfig = {
  output: 'standalone',
  basePath: APP_BASE_PATH || undefined,
  reactCompiler: true,
  distDir: '.next',
  turbopack: {
    root: FRONTEND_ROOT,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  images: {
    loader: 'custom',
    loaderFile: './app/lib/cloudflareLoader.js',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const backendUrl = (
      process.env.INTERNAL_BACKEND_URL ||
      process.env.BACKEND_INTERNAL_URL ||
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3002'
    ).trim().replace(/\/+$/, '');

    return [
      {
        // Cloudflare R2 media streaming proxy
        source: '/media/:path*',
        destination: '/api/media/file/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: `${backendUrl}/socket.io/:path*`,
      },
      {
        source: '/chat/:path*',
        destination: `${backendUrl}/chat/:path*`,
      },
      {
        source: '/calls/:path*',
        destination: `${backendUrl}/calls/:path*`,
      },
    ];
  },
};

export default nextConfig;
