import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const blogSlug = searchParams.get('blogSlug');

    if (!blogSlug) {
      return NextResponse.json({ error: 'Blog slug is required' }, { status: 400 });
    }

    const count = await dbService.getCommentCount(blogSlug);
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('GET /api/comments/count error:', error);
    return NextResponse.json({ 
      error: 'Failed to get comment count',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
} 