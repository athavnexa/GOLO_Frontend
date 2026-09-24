import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

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
  images: {
    loader: 'custom',
    loaderFile: './app/lib/cloudinaryLoader.js',
    remotePatterns: [
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
    return [
      {
        source: '/media/:path*',
        destination: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkiagrvnp'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
