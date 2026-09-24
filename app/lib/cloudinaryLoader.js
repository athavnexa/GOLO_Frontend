export default function cloudinaryLoader({ src, width, quality }) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dkiagrvnp';
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`].join(',');

  // Handle paths that were masked by our API layer (e.g., /media/image/upload/v123/file.jpg)
  if (src.startsWith('/media/')) {
    const pathWithoutMedia = src.replace('/media/', '');
    // Insert transformation params after /upload/
    if (pathWithoutMedia.includes('/upload/')) {
      return `https://res.cloudinary.com/${cloudName}/${pathWithoutMedia.replace('/upload/', `/upload/${params}/`)}`;
    }
    return `https://res.cloudinary.com/${cloudName}/${pathWithoutMedia}`;
  }

  // Handle absolute Cloudinary URLs
  if (src.includes('res.cloudinary.com')) {
    if (src.includes('/upload/')) {
      // Don't inject params if they already exist (basic check)
      if (src.includes('/upload/v') || !src.match(/\/upload\/[a-z_0-9]+,/)) {
        return src.replace('/upload/', `/upload/${params}/`);
      }
    }
    return src;
  }

  // For local files or other domains, return the original source
  return src;
}
