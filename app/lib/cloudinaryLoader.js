export default function cloudinaryLoader({ src, width, quality }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`].join(',');

  // Handle paths masked by our API layer with cloud name included:
  // /media/<cloudname>/image/upload/v123/file.jpg
  //   → https://res.cloudinary.com/<cloudname>/image/upload/<params>/v123/file.jpg
  if (src.startsWith('/media/')) {
    const pathWithoutMedia = src.replace('/media/', ''); // e.g. "dkiagrvnp/image/upload/v1/abc.jpg"
    // Insert transformation params after /upload/
    if (pathWithoutMedia.includes('/upload/')) {
      return `https://res.cloudinary.com/${pathWithoutMedia.replace('/upload/', `/upload/${params}/`)}`;
    }
    return `https://res.cloudinary.com/${pathWithoutMedia}`;
  }

  // Handle absolute Cloudinary URLs — preserve the cloud name from the URL itself
  if (src.includes('res.cloudinary.com')) {
    if (src.includes('/upload/')) {
      // Only inject params if not already present
      if (src.includes('/upload/v') || !src.match(/\/upload\/[a-z_0-9]+,/)) {
        return src.replace('/upload/', `/upload/${params}/`);
      }
    }
    return src;
  }

  // For local files or other domains, return the original source
  return src;
}
