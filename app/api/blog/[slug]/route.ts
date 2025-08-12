import { NextRequest, NextResponse } from 'next/server';
import { blogService } from '@/lib/blog-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';
    const includeTranslations = searchParams.get('includeTranslations') === 'true';
    const shouldIncrement = searchParams.get('increment') === 'true';
    const includeRelated = searchParams.get('related') === 'true';

    const resolvedParams = await params;
    const blog = await blogService.getBlogBySlug(resolvedParams.slug, language);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Increment view count if requested
    if (shouldIncrement) {
      await blogService.incrementViewCount(blog.id);
    }

    let response: any = { blog };

    // Include related blogs if requested
    if (includeRelated) {
      const relatedBlogs = await blogService.getRelatedBlogs(blog.id, blog.type, language, 3);
      response.relatedBlogs = relatedBlogs;
    }

    // Include all translations for dashboard editing if requested
    if (includeTranslations) {
      const translations = await blogService.getBlogTranslationsBySlug(resolvedParams.slug);
      response.translations = translations;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { title, content, excerpt, type, readingMinutes, featuredImageUrl, isPublished } = body;

    // Validate required fields
    if (!title || !content || !type || !readingMinutes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update blog using the blog service
    const updatedBlog = await blogService.updateBlog(resolvedParams.slug, {
      title,
      content,
      excerpt,
      type,
      readingMinutes,
      featuredImageUrl,
      isPublished
    });

    return NextResponse.json({ blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const resolvedParams = await params;
    await blogService.deleteBlog(resolvedParams.slug);
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
