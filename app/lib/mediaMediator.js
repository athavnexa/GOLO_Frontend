/**
 * Media Mediator Service
 * Central pipeline bridging user media uploads (Images, Videos, Documents) and Cloudflare R2.
 * Powered by `sharp` for native C++ image optimization, format conversion, and compression.
 */

import { uploadBufferToR2, getR2PublicUrl } from './r2Client.js';

// Configuration limits
export const MEDIA_LIMITS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,   // 10MB
  MAX_VIDEO_SIZE: 50 * 1024 * 1024,   // 50MB
  MAX_DOC_SIZE: 20 * 1024 * 1024,     // 20MB
  MAX_IMAGE_DIMENSION: 1920,          // 1920px max width/height
  WEBP_QUALITY: 82,                   // Optimal quality/size balance
};

/**
 * Process and optimize images using `sharp`
 * - Auto-orients mobile camera EXIF rotation
 * - Resizes dimensions within max bounds (1920px) without distortion
 * - Converts to modern WebP with optimal compression
 * - Strips heavy camera metadata while preserving color profile
 */
export async function processImageWithSharp(inputBuffer, options = {}) {
  const { default: sharp } = await import('sharp');
  const maxDim = options.maxDimension || MEDIA_LIMITS.MAX_IMAGE_DIMENSION;
  const quality = options.quality || MEDIA_LIMITS.WEBP_QUALITY;

  const sharpInstance = sharp(inputBuffer);
  const metadata = await sharpInstance.metadata();

  // If SVG, return unchanged to preserve crisp vector rendering
  if (metadata.format === 'svg') {
    return {
      buffer: inputBuffer,
      mimeType: 'image/svg+xml',
      extension: 'svg',
      width: metadata.width || null,
      height: metadata.height || null,
      format: 'svg',
      originalSize: inputBuffer.length,
      optimizedSize: inputBuffer.length,
      savedPercent: '0%',
    };
  }

  // Preserve animated GIFs
  if (metadata.format === 'gif' && (metadata.pages || 0) > 1) {
    return {
      buffer: inputBuffer,
      mimeType: 'image/gif',
      extension: 'gif',
      width: metadata.width,
      height: metadata.height,
      format: 'gif',
      originalSize: inputBuffer.length,
      optimizedSize: inputBuffer.length,
      savedPercent: '0%',
    };
  }

  // Process standard images (JPEG, PNG, HEIC, WebP, etc.)
  const pipeline = sharpInstance
    .rotate() // Automatically rotate based on EXIF tag (mobile camera photos)
    .resize({
      width: maxDim,
      height: maxDim,
      fit: 'inside', // Keep aspect ratio, scale down if larger than 1920px
      withoutEnlargement: true,
    })
    .webp({
      quality,
      effort: 4, // Balances CPU speed and compression efficiency
      smartSubsample: true,
    });

  const optimizedBuffer = await pipeline.toBuffer();
  const optimizedMeta = await sharp(optimizedBuffer).metadata();

  const originalSize = inputBuffer.length;
  const optimizedSize = optimizedBuffer.length;
  const savedBytes = Math.max(0, originalSize - optimizedSize);
  const savedPercent = originalSize > 0
    ? `${((savedBytes / originalSize) * 100).toFixed(1)}%`
    : '0%';

  return {
    buffer: optimizedBuffer,
    mimeType: 'image/webp',
    extension: 'webp',
    width: optimizedMeta.width,
    height: optimizedMeta.height,
    format: 'webp',
    originalSize,
    optimizedSize,
    savedBytes,
    savedPercent,
  };
}

/**
 * Validate and prepare video for Cloudflare R2 streaming
 * Sets appropriate MIME types, byte-range friendly metadata, and sanitizes filenames
 */
export function processVideoMetadata(file, buffer) {
  const rawType = (file.type || '').toLowerCase();
  let mimeType = 'video/mp4';

  if (rawType.includes('webm')) {
    mimeType = 'video/webm';
  } else if (rawType.includes('quicktime') || file.name.endsWith('.mov')) {
    // QuickTime MOV: serve as MP4 container friendly for HTML5 players
    mimeType = 'video/mp4';
  } else if (rawType.includes('mp4')) {
    mimeType = 'video/mp4';
  }

  const cleanName = (file.name || 'video.mp4')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  const extension = mimeType === 'video/webm' ? 'webm' : 'mp4';

  return {
    buffer,
    mimeType,
    extension,
    cleanName,
    size: buffer.length,
    isStreamable: true,
  };
}

/**
 * Central Media Mediator:
 * Receives incoming file -> Processes through Sharp / Video Pipeline -> Uploads to Cloudflare R2
 *
 * @param {File} file - File received from form upload
 * @param {Object} options - Custom options { folder, maxDimension, quality }
 * @returns {Promise<Object>} Formatted media response with URLs, keys, and optimization metrics
 */
export async function mediateAndUpload(file, options = {}) {
  if (!file || typeof file === 'string') {
    throw new Error('A valid file object is required for upload');
  }

  const mimeType = file.type || 'application/octet-stream';
  const isVideo = mimeType.startsWith('video/');
  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf' || file.name.endsWith('.pdf');

  // 1. File Size Validation
  if (isVideo && file.size > MEDIA_LIMITS.MAX_VIDEO_SIZE) {
    throw new Error(`Video exceeds maximum size limit of ${MEDIA_LIMITS.MAX_VIDEO_SIZE / (1024 * 1024)}MB`);
  }
  if (isImage && file.size > MEDIA_LIMITS.MAX_IMAGE_SIZE) {
    throw new Error(`Image exceeds maximum size limit of ${MEDIA_LIMITS.MAX_IMAGE_SIZE / (1024 * 1024)}MB`);
  }
  if (!isVideo && !isImage && file.size > MEDIA_LIMITS.MAX_DOC_SIZE) {
    throw new Error(`Document exceeds maximum size limit of ${MEDIA_LIMITS.MAX_DOC_SIZE / (1024 * 1024)}MB`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  let finalBuffer = rawBuffer;
  let finalMimeType = mimeType;
  let finalExtension = (file.name || 'file').split('.').pop() || 'bin';
  let targetFolder = options.folder || (isVideo ? 'videos' : isImage ? 'images' : isPdf ? 'documents' : 'files');
  let optimizationDetails = {};

  // 2. Image Pipeline: Sharp optimization
  if (isImage) {
    try {
      const processed = await processImageWithSharp(rawBuffer, options);
      finalBuffer = processed.buffer;
      finalMimeType = processed.mimeType;
      finalExtension = processed.extension;
      optimizationDetails = {
        width: processed.width,
        height: processed.height,
        format: processed.format,
        originalSize: processed.originalSize,
        optimizedSize: processed.optimizedSize,
        savedPercent: processed.savedPercent,
      };
    } catch (sharpError) {
      console.warn('Sharp optimization bypassed, uploading original buffer:', sharpError?.message);
    }
  }

  // 3. Video Pipeline: Validation & Container Normalization
  else if (isVideo) {
    const videoData = processVideoMetadata(file, rawBuffer);
    finalBuffer = videoData.buffer;
    finalMimeType = videoData.mimeType;
    finalExtension = videoData.extension;
    optimizationDetails = {
      isStreamable: true,
      originalSize: rawBuffer.length,
      optimizedSize: rawBuffer.length,
    };
  }

  // 4. Construct S3 Key & Upload to Cloudflare R2
  const baseName = (file.name || 'media')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const key = `${targetFolder}/${timestamp}_${randomSuffix}_${baseName}.${finalExtension}`;

  const r2Result = await uploadBufferToR2({
    buffer: finalBuffer,
    key,
    contentType: finalMimeType,
    metadata: {
      originalName: file.name,
      processedBy: isImage ? 'sharp-libvips' : 'media-mediator',
      optimized: isImage ? 'true' : 'false',
    },
  });

  return {
    success: true,
    name: file.name,
    mimeType: finalMimeType,
    size: finalBuffer.length,
    type: isImage ? 'image' : isVideo ? 'video' : 'file',
    url: r2Result.url,
    secure_url: r2Result.url,
    publicId: r2Result.key,
    public_id: r2Result.key,
    key: r2Result.key,
    bucket: r2Result.bucket,
    storage: r2Result.storage || 'cloudflare-r2',
    optimization: optimizationDetails,
  };
}
