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
};

export default nextConfig;
