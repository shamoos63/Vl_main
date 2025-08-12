import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/lib/blog-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';
    const all = searchParams.get('all') === 'true';
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let blogs;

    if (search) {
      blogs = await blogService.searchBlogs(search, language);
    } else if (type) {
      blogs = await blogService.getBlogsByType(type, language);
    } else if (all) {
      blogs = await blogService.getAllBlogs(language);
    } else {
      blogs = await blogService.getAllPublishedBlogs(language);
    }

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, readingMinutes, featuredImageUrl, isPublished, translations } = body;

    // Validate required fields
    if (!type || !readingMinutes || !translations) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that English translation has required fields
    if (!translations.en || !translations.en.title || !translations.en.content) {
      return NextResponse.json(
        { error: 'English translation with title and content is required' },
        { status: 400 }
      );
    }

    // Create new blog using the blog service
    const newBlog = await blogService.createBlog({
      type,
      readingMinutes,
      featuredImageUrl,
      isPublished,
      translations
    });

    return NextResponse.json({ blog: newBlog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
