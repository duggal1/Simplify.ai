import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fetchYouTubeTranscript from '@/utils/fetchYouTubeTranscript';
import { summarizeWithGemini} from '@/services/gemini';
import { fetchYouTubeMetadata } from '@/utils/fetchYouTubeMetadata';

interface YouTubeMetadata {
  thumbnail: string;
  views: string;
  likes: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
}

// Update success response to include metadata
interface SuccessResponse {
  blogPost: string;
  metadata: YouTubeMetadata;
}

interface ErrorResponse {
  error: string;
}

// More flexible URL validation
const RequestSchema = z.object({
  videoUrl: z.string()
    .url('Must be a valid URL')
    .refine(
      (url) => {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return pattern.test(url);
      },
      'Must be a valid YouTube URL'
    )
});

// Update these exports for Vercel serverless
export const runtime = 'edge';  // Use edge runtime for better performance
export const maxDuration = 25;  // Reduced to be safe
export const preferredRegion = 'auto';  // Let Vercel choose the best region
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    // Shorter timeout for Vercel
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 20000); // 20 seconds max
    });

    const responsePromise = (async () => {
      // Add early timeout check
      if (Date.now() - startTime > 18000) { // 18 seconds
        throw new Error('Time limit approaching');
      }

      const body = await req.json().catch(() => ({}));
      const result = RequestSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({
          error: `Invalid request: ${result.error.errors[0].message}`
        } as ErrorResponse, { status: 400 });
      }

      const videoId = extractVideoId(result.data.videoUrl);
      if (!videoId) {
        return NextResponse.json({
          error: 'Could not extract valid video ID from URL'
        }, { status: 400 });
      }

      // Sequential processing instead of parallel
      const transcript = await fetchYouTubeTranscript(videoId);
      
      // Check time again before heavy processing
      if (Date.now() - startTime > 15000) { // 15 seconds
        throw new Error('Insufficient time for processing');
      }

      const blogPost = await summarizeWithGemini(transcript);
      
      // Get metadata last since it's optional
      const metadata = await fetchYouTubeMetadata(videoId).catch(() => null);

      return NextResponse.json({
        blogPost,
        metadata: metadata || {
          thumbnail: '',
          views: '0',
          likes: '0',
          title: 'Title unavailable',
          channelTitle: 'Unknown Channel',
          publishedAt: new Date().toLocaleDateString()
        }
      } as SuccessResponse, { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, private',
          'Content-Type': 'application/json'
        }
      });
    })();

    return await Promise.race([responsePromise, timeoutPromise]);
  } catch (error) {
    // Improved error handling
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('API Error:', {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
      url: req.url
    });

    return NextResponse.json({
      error: errorMessage
    } as ErrorResponse, { status: 500 });
  }
}

function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    let videoId: string | null = null;

    // Handle different YouTube URL formats
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    }

    // Validate video ID format (11 characters)
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return videoId;
    }

    return null;
  } catch {
    return null;
  }
}


function isError(error: unknown): error is Error {
  return error instanceof Error;
}