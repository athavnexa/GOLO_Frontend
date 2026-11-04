/**
 * Cloudflare R2 Client & Helper Functions
 * Uses AWS S3 SDK (v3) configured for Cloudflare R2 S3-compatible endpoints.
 * Automatically supports local development storage if R2 keys are not yet configured.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

let s3ClientInstance = null;

/**
 * Checks whether valid Cloudflare R2 credentials have been provided
 */
export function isR2Configured() {
  const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim();
  const accessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim();
  const bucket = (process.env.CLOUDFLARE_R2_BUCKET_NAME || '').trim();

  return Boolean(
    accountId &&
    accessKeyId &&
    secretAccessKey &&
    bucket &&
    !accountId.includes('your_') &&
    !accessKeyId.includes('your_') &&
    !secretAccessKey.includes('your_')
  );
}

export function getR2Client() {
  if (s3ClientInstance) return s3ClientInstance;

  const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim();
  const accessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing Cloudflare R2 credentials. Please set CLOUDFLARE_R2_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, and CLOUDFLARE_R2_SECRET_ACCESS_KEY in .env.local'
    );
  }

  s3ClientInstance = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return s3ClientInstance;
}

export function getR2BucketName() {
  const bucket = (process.env.CLOUDFLARE_R2_BUCKET_NAME || '').trim();
  if (!bucket || bucket.includes('your_')) {
    return 'golo-media';
  }
  return bucket;
}

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
  // Fallback to local Next.js R2 streaming proxy route when public URL is not configured
  return `/api/media/file/${clean}`;
}

/**
 * Fetch an object directly from Cloudflare R2
 */
export async function getObjectFromR2({ key, range }) {
  const cleanKey = (key || '').replace(/^\/+/, '');
  const client = getR2Client();
  const bucket = getR2BucketName();

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
    Range: range || undefined,
  });

  return client.send(command);
}

/**
 * Upload a Buffer directly to Cloudflare R2 or local fallback
 */
export async function uploadBufferToR2({ buffer, key, contentType, metadata = {} }) {
  const cleanKey = (key || '').replace(/^\/+/, '');

  // 1. If R2 is properly configured, upload to Cloudflare R2 bucket
  if (isR2Configured()) {
    const client = getR2Client();
    const bucket = getR2BucketName();

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });

    await client.send(command);

    return {
      key: cleanKey,
      bucket,
      url: getR2PublicUrl(cleanKey),
      storage: 'cloudflare-r2',
    };
  }

  // 2. Development Fallback: Store in public/uploads until user pastes R2 keys
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', path.dirname(cleanKey));
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(process.cwd(), 'public', 'uploads', cleanKey);
    fs.writeFileSync(filePath, buffer);

    return {
      key: cleanKey,
      bucket: 'local-dev-storage',
      url: `/uploads/${cleanKey}`,
      storage: 'local-dev',
    };
  } catch (localErr) {
    console.error('Local fallback storage error:', localErr);
    throw new Error('Failed to persist media buffer to storage: ' + (localErr?.message || 'Unknown error'));
  }
}

/**
 * Generate a pre-signed PUT URL for direct browser-to-R2 upload
 */
export async function getPresignedR2UploadUrl({ key, contentType, expiresIn = 3600 }) {
  const cleanKey = (key || '').replace(/^\/+/, '');

  if (!isR2Configured()) {
    // Return standard upload endpoint when R2 is not yet configured
    return {
      uploadUrl: '/api/media/upload',
      key: cleanKey,
      publicUrl: `/uploads/${cleanKey}`,
      isDirectPresigned: false,
    };
  }

  const client = getR2Client();
  const bucket = getR2BucketName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn });

  return {
    uploadUrl,
    key: cleanKey,
    publicUrl: getR2PublicUrl(cleanKey),
    isDirectPresigned: true,
  };
}

/**
 * Delete an object from Cloudflare R2 or local storage
 */
export async function deleteFromR2(key) {
  const cleanKey = (key || '').replace(/^\/+/, '');

  if (isR2Configured()) {
    const client = getR2Client();
    const bucket = getR2BucketName();

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: cleanKey,
    });

    return client.send(command);
  }

  // Local fallback deletion
  try {
    const filePath = path.join(process.cwd(), 'public', 'uploads', cleanKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { success: true };
  } catch {
    return { success: false };
  }
}
