/**
 * Cloudflare R2 Media Service (Legacy Cloudinary compatibility bridge)
 * All uploads and validations are now 100% powered by Cloudflare R2.
 */

import { uploadToR2, isValidR2Url, isR2Configured } from './cloudflareR2Config.js';

export { uploadToR2, isValidR2Url, isR2Configured };

/**
 * Upload file to Cloudflare R2
 * Compatible drop-in replacement for all legacy uploadToCloudinary callers.
 */
export async function uploadToCloudinary(file, options = {}) {
  const result = await uploadToR2(file, options);
  return {
    name: result.name || file.name,
    mimeType: result.mimeType || file.type,
    size: result.size || file.size,
    type: result.type || (file.type?.startsWith('video/') ? 'video' : 'image'),
    url: result.url,
    secure_url: result.secure_url || result.url,
    publicId: result.publicId || result.key,
    public_id: result.publicId || result.key,
    key: result.key,
    storage: 'cloudflare-r2',
    r2Response: result,
  };
}

export const uploadMedia = uploadToCloudinary;

export function isValidCloudinaryUrl(url) {
  return isValidR2Url(url);
}

export function getCloudinaryConfig() {
  return {
    storage: 'cloudflare-r2',
    uploadUrl: '/api/media/upload',
  };
}

export function maskCloudinaryUrl(url) {
  return url || '';
}

export function maskAllCloudinaryUrls(obj) {
  return obj;
}

export default {
  uploadToCloudinary,
  uploadToR2,
  isValidCloudinaryUrl,
  isValidR2Url,
  isR2Configured,
};
