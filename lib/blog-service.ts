import { getDb } from './db';
import { blogs, blogTranslations, admins } from './db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import type { Blog } from './db/schema';

export interface BlogPost {
  id: number;
  slug: string;
  type: string;
  readingMinutes: number;
  authorName: string;
  featuredImageUrl: string | null;
  isPublished: boolean;
  publishedAt: Date | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  type: string;
  readingMinutes: number;
  authorName: string;
  featuredImageUrl: string | null;
  publishedAt: Date | null;
  viewCount: number;
  title: string;
  excerpt: string | null;
  isPublished: boolean;
}

export class BlogService {
  private db = getDb();

  // Helper function to convert database timestamps to Date objects
  private convertTimestamp(timestamp: any): Date | null {
    if (!timestamp) return null;
    // If it's already a Date object, return it
    if (timestamp instanceof Date) return timestamp;
    // Convert to number and multiply by 1000 to convert from seconds to milliseconds
    const numTimestamp = Number(timestamp);
    return isNaN(numTimestamp) ? null : new Date(numTimestamp * 1000);
  }

  async getBlogTranslationsBySlug(slug: string): Promise<{
    en: { title: string; excerpt: string | null; content: string; metaTitle: string | null; metaDescription: string | null } | null,
    ar: { title: string; excerpt: string | null; content: string; metaTitle: string | null; metaDescription: string | null } | null,
    ru: { title: string; excerpt: string | null; content: string; metaTitle: string | null; metaDescription: string | null } | null,
  }> {
    try {
      // Find blog ID by slug
      const blogRow = await this.db
        .select({ id: blogs.id })
        .from(blogs)
        .where(eq(blogs.slug, slug))
        .limit(1);
      if (blogRow.length === 0) {
        throw new Error('Blog post not found');
      }
      const blogId = blogRow[0].id;

      const rows = await this.db
        .select({
          language: blogTranslations.language,
          title: blogTranslations.title,
          content: blogTranslations.content,
          excerpt: blogTranslations.excerpt,
          metaTitle: blogTranslations.metaTitle,
          metaDescription: blogTranslations.metaDescription,
        })
        .from(blogTranslations)
        .where(eq(blogTranslations.blogId, blogId));

      const map: any = { en: null, ar: null, ru: null };
      for (const row of rows) {
        if (row.language === 'en' || row.language === 'ar' || row.language === 'ru') {
          map[row.language] = {
            title: (row.title || '') as string,
            content: (row.content || '') as string,
            excerpt: row.excerpt || null,
            metaTitle: row.metaTitle || null,
            metaDescription: row.metaDescription || null,
          };
        }
      }

      return map;
    } catch (error) {
      console.error('Error fetching blog translations:', error);
      throw new Error('Failed to fetch blog translations');
    }
  }

  async getAllPublishedBlogs(language: string = 'en'): Promise<BlogPostSummary[]> {
    try {
      const result = await this.db
        .select({
          id: blogs.id,
          slug: blogs.slug,
          type: blogs.type,
          readingMinutes: blogs.readingMinutes,
          authorName: admins.username,
          featuredImageUrl: blogs.featuredImageUrl,
          publishedAt: blogs.publishedAt,
          viewCount: blogs.viewCount,
          title: blogTranslations.title,
          excerpt: blogTranslations.excerpt,
          isPublished: blogs.isPublished,
        })
        .from(blogs)
        .leftJoin(admins, eq(blogs.authorId, admins.id))
        .leftJoin(blogTranslations, and(
          eq(blogs.id, blogTranslations.blogId),
          eq(blogTranslations.language, language)
        ))
        .where(eq(blogs.isPublished, true))
        .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));

      return result.map(row => ({
        ...row,
        publishedAt: this.convertTimestamp(row.publishedAt),
        authorName: row.authorName || 'Victoria Lancaster',
        title: (row.title || 'Untitled') as string,
        excerpt: row.excerpt || null,
      }));
    } catch (error) {
      console.error('Error fetching published blogs:', error);
      throw new Error('Failed to fetch blog posts');
    }
  }

  async getAllBlogs(language: string = 'en'): Promise<BlogPostSummary[]> {
    try {
      const result = await this.db
        .select({
          id: blogs.id,
          slug: blogs.slug,
          type: blogs.type,
          readingMinutes: blogs.readingMinutes,
          authorName: admins.username,
          featuredImageUrl: blogs.featuredImageUrl,
          publishedAt: blogs.publishedAt,
          viewCount: blogs.viewCount,
          title: blogTranslations.title,
          excerpt: blogTranslations.excerpt,
          isPublished: blogs.isPublished,
        })
        .from(blogs)
        .leftJoin(admins, eq(blogs.authorId, admins.id))
        .leftJoin(blogTranslations, and(
          eq(blogs.id, blogTranslations.blogId),
          eq(blogTranslations.language, language)
        ))
        .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));

      return result.map(row => ({
        ...row,
        publishedAt: this.convertTimestamp(row.publishedAt),
        authorName: row.authorName || 'Victoria Lancaster',
        title: (row.title || 'Untitled') as string,
        excerpt: row.excerpt || null,
      }));
    } catch (error) {
      console.error('Error fetching all blogs:', error);
      throw new Error('Failed to fetch blog posts');
    }
  }

  async getBlogBySlug(slug: string, language: string = 'en', incrementViewCount: boolean = false): Promise<BlogPost | null> {
    try {
      const result = await this.db
        .select({
          id: blogs.id,
          slug: blogs.slug,
          type: blogs.type,
          readingMinutes: blogs.readingMinutes,
          authorId: blogs.authorId,
          authorName: admins.username,
          featuredImageUrl: blogs.featuredImageUrl,
          isPublished: blogs.isPublished,
          publishedAt: blogs.publishedAt,
          viewCount: blogs.viewCount,
          createdAt: blogs.createdAt,
          updatedAt: blogs.updatedAt,
          title: blogTranslations.title,
          content: blogTranslations.content,
          excerpt: blogTranslations.excerpt,
          metaTitle: blogTranslations.metaTitle,
          metaDescription: blogTranslations.metaDescription,
        })
        .from(blogs)
        .leftJoin(admins, eq(blogs.authorId, admins.id))
        .leftJoin(blogTranslations, and(
          eq(blogs.id, blogTranslations.blogId),
          eq(blogTranslations.language, language)
        ))
        .where(eq(blogs.slug, slug))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const row = result[0];
      
      // Increment view count if requested
      if (incrementViewCount) {
        await this.incrementViewCount(row.id);
        row.viewCount += 1; // Update the returned count immediately
      }

      return {
        ...row,
        publishedAt: this.convertTimestamp(row.publishedAt),
        createdAt: this.convertTimestamp(row.createdAt) || new Date(),
        updatedAt: this.convertTimestamp(row.updatedAt) || new Date(),
        authorName: row.authorName || 'Victoria Lancaster',
        title: (row.title || 'Untitled') as string,
        content: (row.content || '') as string,
        excerpt: row.excerpt || null,
        metaTitle: row.metaTitle || null,
        metaDescription: row.metaDescription || null,
      };
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw new Error('Failed to fetch blog post');
    }
  }

  async incrementViewCount(blogId: number): Promise<void> {
    try {
      await this.db
        .update(blogs)
        .set({
          viewCount: sql`${blogs.viewCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, blogId));
      
      console.log(`✅ Incremented view count for blog ID: ${blogId}`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw error for view count increment failure
      // This ensures the blog can still be displayed even if view count fails
    }
  }

  async getBlogsByType(type: string, language: string = 'en'): Promise<BlogPostSummary[]> {
    try {
      const result = await this.db
        .select({
          id: blogs.id,
          slug: blogs.slug,
          type: blogs.type,
          readingMinutes: blogs.readingMinutes,
          authorName: admins.username,
          featuredImageUrl: blogs.featuredImageUrl,
          publishedAt: blogs.publishedAt,
          viewCount: blogs.viewCount,
          title: blogTranslations.title,
          excerpt: blogTranslations.excerpt,
          isPublished: blogs.isPublished,
        })
        .from(blogs)
        .leftJoin(admins, eq(blogs.authorId, admins.id))
        .leftJoin(blogTranslations, and(
          eq(blogs.id, blogTranslations.blogId),
          eq(blogTranslations.language, language)
        ))
        .where(and(
          eq(blogs.type, type),
          eq(blogs.isPublished, true)
        ))
        .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));

      return result.map(row => ({
        ...row,
        publishedAt: this.convertTimestamp(row.publishedAt),
        authorName: row.authorName || 'Victoria Lancaster',
        title: (row.title || 'Untitled') as string,
        excerpt: row.excerpt || null,
      }));
    } catch (error) {
      console.error('Error fetching blogs by type:', error);
      throw new Error('Failed to fetch blog posts by type');
    }
  }

  async searchBlogs(query: string, language: string = 'en'): Promise<BlogPostSummary[]> {
    try {
      const result = await this.db
        .select({
          id: blogs.id,
          slug: blogs.slug,
          type: blogs.type,
          readingMinutes: blogs.readingMinutes,
          authorName: admins.username,
          featuredImageUrl: blogs.featuredImageUrl,
          publishedAt: blogs.publishedAt,
          viewCount: blogs.viewCount,
          title: blogTranslations.title,
          excerpt: blogTranslations.excerpt,
          isPublished: blogs.isPublished,
        })
        .from(blogs)
        .leftJoin(admins, eq(blogs.authorId, admins.id))
        .leftJoin(blogTranslations, and(
          eq(blogs.id, blogTranslations.blogId),
          eq(blogTranslations.language, language)
        ))
        .where(and(
          eq(blogs.isPublished, true),
          sql`(${blogTranslations.title} LIKE ${`%${query}%`} OR ${blogTranslations.content} LIKE ${`%${query}%`} OR ${blogTranslations.excerpt} LIKE ${`%${query}%`})`
        ))
        .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt));

      return result.map(row => ({
        ...row,
        publishedAt: this.convertTimestamp(row.publishedAt),
        authorName: row.authorName || 'Victoria Lancaster',
        title: (row.title || 'Untitled') as string,
        excerpt: row.excerpt || null,
      }));
    } catch (error) {
      console.error('Error searching blogs:', error);
      throw new Error('Failed to search blog posts');
    }
  }

  async createBlog(blogData: {
    type: string;
    readingMinutes: number;
    featuredImageUrl?: string;
    isPublished?: boolean;
    translations: {
      en: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string }
      ar: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string }
      ru: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string }
    }
  }): Promise<BlogPost> {
    try {
      // Generate unique slug from English title (primary language)
      const slug = await this.generateUniqueSlug(blogData.translations.en.title);
      
      // Get the first admin user as author (you might want to make this configurable)
      const adminUser = await this.db.select().from(admins).limit(1);
      if (adminUser.length === 0) {
        throw new Error('No admin user found to assign as author');
      }

      // Insert blog
      const insertedBlog = await this.db.insert(blogs).values({
        slug,
        type: blogData.type,
        readingMinutes: blogData.readingMinutes,
        authorId: adminUser[0].id,
        featuredImageUrl: blogData.featuredImageUrl,
        isPublished: blogData.isPublished || false,
        publishedAt: blogData.isPublished ? sql`(unixepoch())` : null,
        viewCount: 0,
      }).returning();

      // Insert translations for all languages
      const translationPromises = Object.entries(blogData.translations).map(([language, translation]) => {
        // Only insert if translation has content
        if (translation.title.trim() || translation.content.trim()) {
          return this.db.insert(blogTranslations).values({
            blogId: insertedBlog[0].id,
            language,
            title: translation.title || blogData.translations.en.title, // Fallback to English
            content: translation.content || blogData.translations.en.content,
            excerpt: translation.excerpt || blogData.translations.en.excerpt,
            metaTitle: translation.metaTitle || translation.title || blogData.translations.en.title,
            metaDescription: translation.metaDescription || translation.excerpt || blogData.translations.en.excerpt,
          });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(translationPromises);

      // Return the created blog with English translation data
      const createdBlog = await this.getBlogBySlug(slug, 'en');
      if (!createdBlog) {
        throw new Error('Failed to retrieve created blog');
      }

      return createdBlog;
    } catch (error) {
      console.error('Error creating blog:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('UNIQUE constraint failed: blogs.slug')) {
          throw new Error('A blog post with this title already exists. Please choose a different title.');
        }
        if (error.message.includes('No admin user found')) {
          throw new Error('No admin user found to assign as author. Please contact support.');
        }
        if (error.message.includes('Failed to retrieve created blog')) {
          throw new Error('Blog post was created but could not be retrieved. Please refresh the page.');
        }
      }
      
      throw new Error('Failed to create blog post. Please try again.');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = this.generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and increment counter until we find a unique one
    while (true) {
      const existingBlog = await this.db
        .select({ id: blogs.id })
        .from(blogs)
        .where(eq(blogs.slug, slug))
        .limit(1);

      if (existingBlog.length === 0) {
        // Slug is unique, we can use it
        break;
      }

      // Slug exists, try with counter
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  async getRelatedBlogs(blogId: number, type: string, language: string = 'en', limit: number = 3): Promise<BlogPostSummary[]> {
    try {
      const result = await this.db
        .select({
          id: blogs.id,
          slug: blogs.slug,
          type: blogs.type,
          readingMinutes: blogs.readingMinutes,
          authorName: admins.username,
          featuredImageUrl: blogs.featuredImageUrl,
          publishedAt: blogs.publishedAt,
          viewCount: blogs.viewCount,
          title: blogTranslations.title,
          excerpt: blogTranslations.excerpt,
          isPublished: blogs.isPublished,
        })
        .from(blogs)
        .leftJoin(admins, eq(blogs.authorId, admins.id))
        .leftJoin(blogTranslations, and(
          eq(blogs.id, blogTranslations.blogId),
          eq(blogTranslations.language, language)
        ))
        .where(and(
          eq(blogs.isPublished, true),
          eq(blogs.type, type),
          sql`${blogs.id} != ${blogId}` // Exclude current blog
        ))
        .orderBy(desc(blogs.publishedAt), desc(blogs.createdAt))
        .limit(limit);

      return result.map(row => ({
        ...row,
        publishedAt: this.convertTimestamp(row.publishedAt),
        authorName: row.authorName || 'Victoria Lancaster',
        title: (row.title || 'Untitled') as string,
        excerpt: row.excerpt || null,
      }));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
      return []; // Return empty array instead of throwing error
    }
  }

  async updateBlog(slug: string, updateData: {
    title: string;
    content: string;
    excerpt: string;
    type: string;
    readingMinutes: number;
    featuredImageUrl?: string;
    isPublished?: boolean;
  }): Promise<BlogPost> {
    try {
      // First get the blog to find its ID
      const existingBlog = await this.getBlogBySlug(slug, 'en');
      if (!existingBlog) {
        throw new Error('Blog post not found');
      }

      // Update the blog table
      await this.db
        .update(blogs)
        .set({
          type: updateData.type,
          readingMinutes: updateData.readingMinutes,
          featuredImageUrl: updateData.featuredImageUrl,
          isPublished: updateData.isPublished,
          publishedAt: updateData.isPublished ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(eq(blogs.id, existingBlog.id));

      // Update the translation
      await this.db
        .update(blogTranslations)
        .set({
          title: updateData.title,
          content: updateData.content,
          excerpt: updateData.excerpt,
          metaTitle: updateData.title,
          metaDescription: updateData.excerpt,
        })
        .where(and(
          eq(blogTranslations.blogId, existingBlog.id),
          eq(blogTranslations.language, 'en') // Default to English for now
        ));

      // Return the updated blog
      const updatedBlog = await this.getBlogBySlug(slug, 'en');
      if (!updatedBlog) {
        throw new Error('Failed to retrieve updated blog');
      }

      return updatedBlog;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw new Error('Failed to update blog post');
    }
  }

  async deleteBlog(slug: string): Promise<void> {
    try {
      // First get the blog to find its ID
      const existingBlog = await this.getBlogBySlug(slug, 'en');
      if (!existingBlog) {
        throw new Error('Blog post not found');
      }

      // Delete translations first (foreign key constraint)
      await this.db
        .delete(blogTranslations)
        .where(eq(blogTranslations.blogId, existingBlog.id));

      // Delete the blog
      await this.db
        .delete(blogs)
        .where(eq(blogs.id, existingBlog.id));

      console.log(`✅ Deleted blog with slug: ${slug}`);
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw new Error('Failed to delete blog post');
    }
  }
}

export const blogService = new BlogService();
