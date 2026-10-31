import { NextResponse } from 'next/server';
import { getObjectFromR2, isR2Configured } from '../../../../lib/r2Client.js';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MIME_MAP = {
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  pdf: 'application/pdf',
};

function getMimeType(filename) {
  const ext = (filename || '').split('.').pop()?.toLowerCase();
  return MIME_MAP[ext] || 'application/octet-stream';
}

export async function GET(request, context) {
  try {
    const params = await context.params;
    const pathParts = params?.path || [];
    const key = Array.isArray(pathParts) ? pathParts.join('/') : pathParts;

    if (!key) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    const rangeHeader = request.headers.get('range') || undefined;

    // 1. Try reading from Cloudflare R2 if configured
    if (isR2Configured()) {
      try {
        const r2Object = await getObjectFromR2({ key, range: rangeHeader });

        const headers = new Headers();
        const detectedMime = r2Object.ContentType || getMimeType(key);
        headers.set('Content-Type', detectedMime);
        headers.set('Accept-Ranges', 'bytes');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        if (r2Object.ETag) {
          headers.set('ETag', r2Object.ETag);
        }
        if (r2Object.ContentLength !== undefined) {
          headers.set('Content-Length', String(r2Object.ContentLength));
        }
        if (r2Object.ContentRange) {
          headers.set('Content-Range', r2Object.ContentRange);
          return new Response(r2Object.Body, {
            status: 206,
            headers,
          });
        }

        return new Response(r2Object.Body, {
          status: 200,
          headers,
        });
      } catch (r2Error) {
        if (r2Error?.name === 'NoSuchKey' || r2Error?.$metadata?.httpStatusCode === 404) {
          // Fall through to local fallback check
        } else {
          console.error(`R2 Fetch Error for key ${key}:`, r2Error);
        }
      }
    }

    // 2. Local Fallback Check (public/uploads/)
    const localFilePath = path.join(process.cwd(), 'public', 'uploads', key);
    if (fs.existsSync(localFilePath)) {
      const stat = fs.statSync(localFilePath);
      const totalSize = stat.size;
      const detectedMime = getMimeType(key);

      if (rangeHeader) {
        const parts = rangeHeader.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
        const chunkSize = end - start + 1;

        const fileStream = fs.createReadStream(localFilePath, { start, end });
        return new Response(fileStream, {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': String(chunkSize),
            'Content-Type': detectedMime,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }

      const fileStream = fs.createReadStream(localFilePath);
      return new Response(fileStream, {
        status: 200,
        headers: {
          'Content-Length': String(totalSize),
          'Content-Type': detectedMime,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  } catch (err) {
    console.error('Media File Proxy Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal media streaming error' },
      { status: 500 }
    );
  }
}
