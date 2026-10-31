/**
 * Cloudflare CDN, R2 & Sharp Next.js Image Loader
 * 100% powered by Cloudflare R2 and high-performance server-side Sharp optimization.
 */

const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || '').replace(/\/+$/, '');
const USE_IMAGE_RESIZING = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_RESIZING === 'true';

export default function cloudflareLoader({ src, width, quality = 75 }) {
  if (!src) return '';

  // Skip vector SVGs and inline data URIs
  if (src.endsWith('.svg') || src.startsWith('data:')) {
    return src;
  }

  // Cloudflare R2 & Media Storage
  const isR2Url = Boolean(R2_PUBLIC_URL && src.startsWith(R2_PUBLIC_URL));
  const isMediaUrl =
    src.startsWith('/api/media/file/') ||
    src.startsWith('/api/media/') ||
    src.startsWith('/uploads/') ||
    src.includes('.r2.dev') ||
    src.includes('.cloudflarestorage.com') ||
    isR2Url;

  if (isMediaUrl) {
    if (USE_IMAGE_RESIZING && (isR2Url || src.includes('.r2.dev'))) {
      const cleanSrc = src.replace(/^https?:\/\/[^/]+/, '');
      const domain = R2_PUBLIC_URL || src.split('/').slice(0, 3).join('/');
      return `${domain}/cdn-cgi/image/width=${width},quality=${quality},format=auto${cleanSrc}`;
    }

    return `/api/media/resize?url=${encodeURIComponent(src)}&w=${width}&q=${quality}&format=webp`;
  }

  // Local assets (static icons, banners)
  if (src.startsWith('/')) {
    return `/api/media/resize?url=${encodeURIComponent(src)}&w=${width}&q=${quality}&format=webp`;
  }

  return `/api/media/resize?url=${encodeURIComponent(src)}&w=${width}&q=${quality}&format=webp`;
}
