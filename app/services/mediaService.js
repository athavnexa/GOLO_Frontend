/**
 * Unified Media Service
 * Central service for all file and media uploads across GOLO Frontend.
 * 100% powered by Cloudflare R2 and Sharp.
 */

import { uploadToR2, isValidR2Url, isR2Configured } from './cloudflareR2Config.js';

/**
 * Upload a media file (Image, Video, or Document) to Cloudflare R2
 * @param {File} file
 * @param {Object} options
 * @returns {Promise<{ url: string, secure_url: string, publicId: string, name: string, size: number, type: string }>}
 */
export async function uploadMedia(file, options = {}) {
  return uploadToR2(file, options);
}

/**
 * Validates if a URL is hosted on Cloudflare R2
 */
export function isValidMediaUrl(url) {
  return isValidR2Url(url);
}

export { uploadToR2, isValidR2Url, isR2Configured };
export default uploadMedia;
