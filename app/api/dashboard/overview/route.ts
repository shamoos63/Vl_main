import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { properties, propertyTranslations, blogs, blogTranslations, contactMessages, welcomeInquiries, propertyEvaluations } from '@/lib/db/schema'
import { and, desc, eq, sql } from 'drizzle-orm'

export async function GET(_request: NextRequest) {
  try {
    const db = getDb()

    // Counts
    const [evalCountRow] = await db.select({ c: sql`COUNT(*)` }).from(propertyEvaluations)
    const [welcomeCountRow] = await db.select({ c: sql`COUNT(*)` }).from(welcomeInquiries)
    const [contactCountRow] = await db.select({ c: sql`COUNT(*)` }).from(contactMessages)
    const [propertiesCountRow] = await db.select({ c: sql`COUNT(*)` }).from(properties)

    const evaluationsCount = Number(evalCountRow?.c ?? 0)
    const welcomeCount = Number(welcomeCountRow?.c ?? 0)
    const contactCount = Number(contactCountRow?.c ?? 0)
    const propertiesCount = Number(propertiesCountRow?.c ?? 0)

    // Top properties by viewCount
    const topProperties = await db
      .select({
        id: properties.id,
        slug: properties.slug,
        viewCount: properties.viewCount,
        photoUrl: properties.photoUrl,
        location: properties.location,
        title: propertyTranslations.title,
      })
      .from(properties)
      .leftJoin(
        propertyTranslations,
        and(eq(propertyTranslations.propertyId, properties.id), eq(propertyTranslations.language, 'en'))
      )
      .orderBy(desc(properties.viewCount))
      .limit(5)

    // Top blogs by viewCount
    const topBlogs = await db
      .select({
        id: blogs.id,
        slug: blogs.slug,
        type: blogs.type,
        viewCount: blogs.viewCount,
        featuredImageUrl: blogs.featuredImageUrl,
        title: blogTranslations.title,
      })
      .from(blogs)
      .leftJoin(
        blogTranslations,
        and(eq(blogTranslations.blogId, blogs.id), eq(blogTranslations.language, 'en'))
      )
      .orderBy(desc(blogs.viewCount))
      .limit(5)

    // Count messages per property (source contains propertyId as string)
    const contactSources = await db.select({ source: contactMessages.source }).from(contactMessages)
    const propCountsMap = new Map<number, number>()
    for (const row of contactSources) {
      const s = (row as any).source as string | null
      if (!s) continue
      if (/^\d+$/.test(s)) {
        const pid = Number(s)
        propCountsMap.set(pid, (propCountsMap.get(pid) || 0) + 1)
      }
    }

    // Prepare top properties by messages
    const propCountsArr = Array.from(propCountsMap.entries())
      .map(([propertyId, count]) => ({ propertyId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const topMessageProps: Array<{ propertyId: number; count: number; slug: string; title: string | null }> = []
    for (const item of propCountsArr) {
      const rows = await db
        .select({ id: properties.id, slug: properties.slug, title: propertyTranslations.title })
        .from(properties)
        .leftJoin(propertyTranslations, and(eq(propertyTranslations.propertyId, properties.id), eq(propertyTranslations.language, 'en')))
        .where(eq(properties.id, item.propertyId))
        .limit(1)
      if (rows.length) {
        topMessageProps.push({
          propertyId: item.propertyId,
          count: item.count,
          slug: rows[0].slug,
          title: rows[0].title,
        })
      }
    }

    return NextResponse.json({
      stats: {
        evaluations: evaluationsCount,
        welcomes: welcomeCount,
        contacts: contactCount,
        properties: propertiesCount,
      },
      topBlogs,
      topProperties,
      topPropertyMessages: topMessageProps,
    })
  } catch (error) {
    console.error('Error building dashboard overview:', error)
    return NextResponse.json({ error: 'Failed to fetch overview' }, { status: 500 })
  }
}


