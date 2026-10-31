import { NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getObjectFromR2, isR2Configured } from '../../../lib/r2Client.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Allowed formats for Sharp transformation
const VALID_FORMATS = new Set(['webp', 'avif', 'jpeg', 'jpg', 'png']);

/**
 * GET /api/media/resize
 * Dynamic Sharp Image Transformation and Resizing Endpoint
 *
 * Query Params:
 *  - url: string (required) - source image URL or relative path
 *  - w: number (optional) - target width (10 to 3840)
 *  - h: number (optional) - target height (10 to 3840)
 *  - q: number (optional, default 80) - quality (20 to 100)
 *  - fit: string (optional, default 'inside') - 'inside' | 'cover' | 'contain' | 'fill'
 *  - format: string (optional, default 'webp') - 'webp' | 'avif' | 'jpeg' | 'png' | 'auto'
 */
export async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required via ?url=' }, { status: 400 });
    }

    const width = searchParams.get('w') ? Math.min(3840, Math.max(10, parseInt(searchParams.get('w'), 10))) : null;
    const height = searchParams.get('h') ? Math.min(3840, Math.max(10, parseInt(searchParams.get('h'), 10))) : null;
    const quality = searchParams.get('q') ? Math.min(100, Math.max(20, parseInt(searchParams.get('q'), 10))) : 80;
    const fit = searchParams.get('fit') || 'inside';
    let format = (searchParams.get('format') || 'webp').toLowerCase();

    // Auto-negotiate WebP / AVIF based on browser Accept header
    if (format === 'auto') {
      const accept = request.headers.get('accept') || '';
      if (accept.includes('image/avif')) {
        format = 'avif';
      } else {
        format = 'webp';
      }
    }

    let imageBuffer;
    let contentType = 'image/webp';

    // 1. Fetch source image buffer (Direct R2, Local file vs Remote URL)
    if (imageUrl.includes('/api/media/file/') && isR2Configured()) {
      const r2Key = imageUrl.split('/api/media/file/')[1]?.split('?')[0];
      if (r2Key) {
        try {
          const r2Obj = await getObjectFromR2({ key: decodeURIComponent(r2Key) });
          const stream = r2Obj.Body;
          const chunks = [];
          for await (const chunk of stream) {
            chunks.push(chunk);
          }
          imageBuffer = Buffer.concat(chunks);
        } catch (r2Err) {
          console.warn(`R2 direct read failed for ${r2Key}, trying fetch fallback:`, r2Err?.message);
        }
      }
    }
    if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
      const cleanPath = imageUrl.replace(/^\/+/, '');
      const localFilePath = path.join(process.cwd(), 'public', cleanPath);

      if (fs.existsSync(localFilePath)) {
        imageBuffer = fs.readFileSync(localFilePath);
      } else {
        // Fallback to fetching via origin
        const origin = request.nextUrl.origin;
        const res = await fetch(`${origin}/${cleanPath}`);
        if (!res.ok) {
          return NextResponse.json({ error: 'Local image not found' }, { status: 404 });
        }
        imageBuffer = Buffer.from(await res.arrayBuffer());
      }
    } else {
      // Remote URL (Cloudflare R2, Cloudinary, S3, etc.)
      const res = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'GOLO-Sharp-Mediator/1.0',
        },
      });

      if (!res.ok) {
        return NextResponse.json({ error: `Failed to fetch source image: ${res.status}` }, { status: res.status });
      }

      imageBuffer = Buffer.from(await res.arrayBuffer());
    }

    // 2. Inspect with Sharp
    const sharpInstance = sharp(imageBuffer);
    const metadata = await sharpInstance.metadata();

    // If SVG, return original SVG vector directly
    if (metadata.format === 'svg') {
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // If animated GIF with multiple frames, return original to preserve animation
    if (metadata.format === 'gif' && (metadata.pages || 0) > 1) {
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 3. Apply Transformations with Sharp
    let pipeline = sharpInstance.rotate(); // Auto-rotate mobile photos

    if (width || height) {
      pipeline = pipeline.resize({
        width: width || undefined,
        height: height || undefined,
        fit: ['inside', 'cover', 'contain', 'fill'].includes(fit) ? fit : 'inside',
        withoutEnlargement: true,
      });
    }

    // Format & Quality configuration
    if (format === 'avif') {
      pipeline = pipeline.avif({ quality, effort: 4 });
      contentType = 'image/avif';
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality, compressionLevel: 8 });
      contentType = 'image/png';
    } else if (format === 'jpeg' || format === 'jpg') {
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      contentType = 'image/jpeg';
    } else {
      // Default to WebP
      pipeline = pipeline.webp({ quality, effort: 4, smartSubsample: true });
      contentType = 'image/webp';
    }

    const transformedBuffer = await pipeline.toBuffer();

    return new Response(transformedBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'ETag': `"${metadata.format || 'img'}-${width || 0}-${height || 0}-${quality}-${transformedBuffer.length}"`,
        'Vary': 'Accept',
        'X-Mediator': 'Sharp-Vips',
      },
    });
  } catch (error) {
    console.error('Sharp Image Resize Error:', error);
    return NextResponse.json(
      { error: 'Image processing failed: ' + (error?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
