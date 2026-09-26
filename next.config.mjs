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
        hostname: 'res.cloudinary.com',
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
    return [
      {
        // The cloud name is now part of the path, so any Cloudinary account's
        // images are proxied correctly: /media/<cloudname>/image/upload/...
        source: '/media/:path*',
        destination: 'https://res.cloudinary.com/:path*',
      },
    ];
  },
};

export default nextConfig;
