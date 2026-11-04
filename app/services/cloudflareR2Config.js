/**
 * Cloudflare R2 Media Configuration & Upload Service
 * Manages Cloudflare R2 file uploads, URL generation, and fallback logic.
 * 100% Browser and Client Component Safe (No Node.js built-ins).
 */

const R2_CONFIG = {
  publicUrl: (process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim().replace(/\/+$/, ''),
  uploadApi: '/api/media/upload',
  presignApi: '/api/media/presign',
};

/**
 * Resolves any key, legacy streaming route, or upload path to the Cloudflare R2 Public URL.
 * Pure string manipulation - 100% client-safe (no Node.js fs/path dependencies).
 */
export function getR2PublicUrl(keyOrUrl) {
  if (!keyOrUrl) return '';
  const baseUrl = (process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim().replace(/\/+$/, '');

  let clean = String(keyOrUrl).trim();

  // If already full public URL with configured domain, return as-is
  if (baseUrl && clean.startsWith(baseUrl)) {
    return clean;
  }

  // Extract clean key from legacy streaming proxies, uploads, or r2.dev URLs
  if (clean.includes('/api/media/file/')) {
    clean = clean.split('/api/media/file/')[1];
  } else if (clean.includes('/api/media/')) {
    clean = clean.split('/api/media/')[1];
  } else if (clean.includes('.r2.dev/')) {
    clean = clean.split('.r2.dev/')[1];
  } else if (clean.startsWith('/uploads/')) {
    clean = clean.replace(/^\/uploads\//, '');
  }

  clean = clean.split('?')[0].replace(/^\/+/, '');

  if (baseUrl && !baseUrl.includes('your-r2-public-domain')) {
    return `${baseUrl}/${clean}`;
  }
  return `/api/media/file/${clean}`;
}

/**
 * Validate whether Cloudflare R2 configuration is available
 */
export function isR2Configured() {
  // Always true now that Cloudflare R2 is our primary storage system
  return true;
}

/**
 * Check if a URL points to Cloudflare R2 or CDN
 */
export function isValidR2Url(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('/api/media/file/') ||
    url.includes('/api/media/') ||
    url.includes('.r2.dev') ||
    url.includes('.cloudflarestorage.com') ||
    (R2_CONFIG.publicUrl && url.startsWith(R2_CONFIG.publicUrl)) ||
    url.startsWith('/uploads/')
  );
}

/**
 * Upload file to Cloudflare R2
 * Automatically routes through Next.js upload handler or presigned direct upload.
 *
 * @param {File} file - File object (Image, Video, Document, etc.)
 * @param {Object} options - Optional configuration { folder }
 * @returns {Promise<Object>} Object with url, secure_url, publicId, and file metadata
 */
export async function uploadToR2(file, options = {}) {
  if (!file) {
    throw new Error('File is required for upload');
  }

  const mimeType = file.type || 'application/octet-stream';
  const isVideo = mimeType.startsWith('video/');
  const isImage = mimeType.startsWith('image/');

  // Size validations matching backend limits
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_DOC_SIZE = 20 * 1024 * 1024;   // 20MB

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    throw new Error('Video file is too large. Maximum size is 50MB.');
  } else if (isImage && file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image file is too large. Maximum size is 10MB.');
  } else if (!isVideo && !isImage && file.size > MAX_DOC_SIZE) {
    throw new Error('Document file is too large. Maximum size is 20MB.');
  }

  // Large video files (> 20MB): use direct presigned PUT for optimal streaming if R2 is active
  if (file.size > 20 * 1024 * 1024 && isR2Configured()) {
    try {
      const folder = options.folder || (isVideo ? 'videos' : 'files');
      const presignRes = await fetch(R2_CONFIG.presignApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: mimeType,
          fileSize: file.size,
          folder,
        }),
      });

      if (!presignRes.ok) {
        throw new Error('Failed to get presigned upload URL');
      }

      const { uploadUrl, publicUrl, key } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': mimeType,
        },
      });

      if (!putRes.ok) {
        throw new Error(`Direct R2 upload failed with status ${putRes.status}`);
      }

      return {
        name: file.name,
        mimeType,
        size: file.size,
        type: isVideo ? 'video' : isImage ? 'image' : 'file',
        url: publicUrl,
        secure_url: publicUrl,
        publicId: key,
        key,
      };
    } catch (presignErr) {
      console.warn('Presigned upload failed, falling back to standard upload route:', presignErr);
    }
  }

  // Standard upload route (multipart/form-data via /api/media/upload)
  const formData = new FormData();
  formData.append('file', file);
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  const response = await fetch(R2_CONFIG.uploadApi, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.error || 'Failed to upload file to Cloudflare R2';
    throw new Error(errorMsg);
  }

  return {
    name: file.name,
    mimeType,
    size: file.size,
    type: data.type || (isImage ? 'image' : isVideo ? 'video' : 'file'),
    url: data.url,
    secure_url: data.secure_url || data.url,
    publicId: data.publicId || data.key,
    key: data.key,
    r2Response: data,
  };
}

export default R2_CONFIG;
