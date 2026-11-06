/**
 * Cloudflare CDN, R2 & Next.js Image Loader
 * High-performance direct delivery from Cloudflare R2 CDN edge.
 */

const CANONICAL_R2_PUBLIC_URL = 'https://pub-21e329eb32bd4d239fbb89a98ea331f9.r2.dev';

const R2_PUBLIC_URL = (
  process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL ||
  process.env.CLOUDFLARE_R2_PUBLIC_URL ||
  CANONICAL_R2_PUBLIC_URL
).trim().replace(/\/+$/, '');

const USE_IMAGE_RESIZING = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_RESIZING === 'true';

export default function cloudflareLoader({ src, width, quality = 75 }) {
  if (!src) return '';

  // Skip vector SVGs and inline data URIs
  if (src.endsWith('.svg') || src.startsWith('data:')) {
    return src;
  }

  const targetSrc = src.trim();

  // 1. Direct external CDN delivery (Cloudflare R2, Cloudinary, AWS S3, etc.)
  if (targetSrc.startsWith('http://') || targetSrc.startsWith('https://')) {
    // If Cloudflare Image Resizing is enabled on custom zone
    if (USE_IMAGE_RESIZING && (targetSrc.startsWith(R2_PUBLIC_URL) || targetSrc.includes('.r2.dev'))) {
      const cleanSrc = targetSrc.replace(/^https?:\/\/[^/]+/, '');
      const domain = R2_PUBLIC_URL || targetSrc.split('/').slice(0, 3).join('/');
      return `${domain}/cdn-cgi/image/width=${width},quality=${quality},format=auto${cleanSrc}`;
    }
    // Direct CDN delivery with zero serverless latency
    return targetSrc;
  }

  // 2. Resolve legacy streaming proxies (/api/media/file/) or uploads to public R2 CDN directly
  if (targetSrc.includes('/api/media/file/')) {
    const key = targetSrc.split('/api/media/file/')[1]?.split('?')[0]?.replace(/^\/+/, '');
    if (key) return `${R2_PUBLIC_URL}/${key}`;
  } else if (targetSrc.includes('/api/media/')) {
    const key = targetSrc.split('/api/media/')[1]?.split('?')[0]?.replace(/^\/+/, '');
    if (key) return `${R2_PUBLIC_URL}/${key}`;
  } else if (targetSrc.startsWith('/uploads/')) {
    const key = targetSrc.replace(/^\/uploads\//, '')?.split('?')[0]?.replace(/^\/+/, '');
    if (key) return `${R2_PUBLIC_URL}/${key}`;
  } else if (targetSrc.startsWith('uploads/')) {
    const key = targetSrc.split('?')[0]?.replace(/^\/+/, '');
    if (key) return `${R2_PUBLIC_URL}/${key}`;
  }

  // 3. Local static assets (e.g. /images/deal2.avif, /icons/favicon.ico)
  if (targetSrc.startsWith('/images/') || targetSrc.startsWith('/icons/') || targetSrc.startsWith('/placeholder')) {
    return targetSrc;
  }

  // 4. Default: resolve bare key directly to Cloudflare R2 CDN
  const cleanKey = targetSrc.replace(/^\/+/, '');
  return `${R2_PUBLIC_URL}/${cleanKey}`;
}
