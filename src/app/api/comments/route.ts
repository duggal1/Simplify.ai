import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogSlug = searchParams.get('blogSlug');
    const sortBy = (searchParams.get('sort') || 'newest') as 'newest' | 'oldest' | 'mostLiked';

    if (!blogSlug) {
      return NextResponse.json({ error: 'Blog slug is required' }, { status: 400 });
    }

    const comments = await dbService.getComments(blogSlug, sortBy);
    return NextResponse.json(comments);
  } catch (error: any) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch comments',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { blogSlug, content, parentId } = body;

    if (!blogSlug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await dbService.createComment({
      blogSlug,
      content,
      userId,
      parentId,
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
} 