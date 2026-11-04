/**
 * Cloudflare CDN, R2 & Sharp Next.js Image Loader
 * 100% powered by Cloudflare R2 and high-performance server-side Sharp optimization.
 */

const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim().replace(/\/+$/, '');
const USE_IMAGE_RESIZING = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_RESIZING === 'true';

export default function cloudflareLoader({ src, width, quality = 75 }) {
  if (!src) return '';

  // Skip vector SVGs and inline data URIs
  if (src.endsWith('.svg') || src.startsWith('data:')) {
    return src;
  }

  let targetSrc = src;

  // If URL points to local streaming proxy (/api/media/file/) or uploads, resolve to public URL directly
  if (R2_PUBLIC_URL && !R2_PUBLIC_URL.includes('your-r2-public-domain')) {
    if (targetSrc.includes('/api/media/file/')) {
      const key = targetSrc.split('/api/media/file/')[1]?.split('?')[0]?.replace(/^\/+/, '');
      if (key) targetSrc = `${R2_PUBLIC_URL}/${key}`;
    } else if (targetSrc.includes('/api/media/')) {
      const key = targetSrc.split('/api/media/')[1]?.split('?')[0]?.replace(/^\/+/, '');
      if (key) targetSrc = `${R2_PUBLIC_URL}/${key}`;
    } else if (targetSrc.startsWith('/uploads/')) {
      const key = targetSrc.replace(/^\/uploads\//, '')?.split('?')[0]?.replace(/^\/+/, '');
      if (key) targetSrc = `${R2_PUBLIC_URL}/${key}`;
    }
  }

  // Cloudflare R2 & Media Storage
  const isR2Url = Boolean(R2_PUBLIC_URL && targetSrc.startsWith(R2_PUBLIC_URL));
  const isMediaUrl =
    targetSrc.startsWith('/api/media/file/') ||
    targetSrc.startsWith('/api/media/') ||
    targetSrc.startsWith('/uploads/') ||
    targetSrc.includes('.r2.dev') ||
    targetSrc.includes('.cloudflarestorage.com') ||
    isR2Url;

  if (isMediaUrl) {
    // If Cloudflare Image Resizing is enabled on custom domain / Cloudflare zone
    if (USE_IMAGE_RESIZING && (isR2Url || targetSrc.includes('.r2.dev'))) {
      const cleanSrc = targetSrc.replace(/^https?:\/\/[^/]+/, '');
      const domain = R2_PUBLIC_URL || targetSrc.split('/').slice(0, 3).join('/');
      return `${domain}/cdn-cgi/image/width=${width},quality=${quality},format=auto${cleanSrc}`;
    }

    // Direct Cloudflare R2 Public URL delivery:
    // When public URL is configured, deliver directly from Cloudflare R2 CDN
    if (isR2Url || targetSrc.includes('.r2.dev')) {
      return targetSrc;
    }

    // Fallback through local Sharp image resizer for local upload files
    return `/api/media/resize?url=${encodeURIComponent(targetSrc)}&w=${width}&q=${quality}&format=webp`;
  }

  // Local assets (static icons, banners)
  if (targetSrc.startsWith('/')) {
    return targetSrc;
  }

  return targetSrc;
}
