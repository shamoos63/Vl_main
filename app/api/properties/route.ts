import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { properties, propertyTranslations } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { type PropertyWithTranslation, convertToCurrentPropertyFormat } from '@/lib/db/utils';
import { ensurePropertyHomeDisplayColumn, ensurePropertyDldUrlColumn, ensurePropertyUniteNumberColumn } from '@/lib/db/migrations';

// GET - Fetch all properties
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const db = getDb();
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.isActive, true))
      .orderBy(desc(properties.isFeatured), desc(properties.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: properties.id })
      .from(properties)
      .where(eq(properties.isActive, true));

    const formattedProperties = result.map(convertToCurrentPropertyFormat);

    return NextResponse.json({
      success: true,
      data: formattedProperties,
      pagination: {
        page,
        limit,
        total: totalResult.length,
        totalPages: Math.ceil(totalResult.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST - Create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Ensure schema is compatible before attempting insert
    await ensurePropertyHomeDisplayColumn();
    await ensurePropertyDldUrlColumn();
    await ensurePropertyUniteNumberColumn();
    
    // Validate required fields (no top-level title/description; use translations.en)
    const requiredFields = ['price', 'bedrooms', 'bathrooms', 'area', 'type'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    // Require English translation
    const enTranslation = body?.translations?.en;
    if (!enTranslation || !enTranslation.title || !enTranslation.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required English translation (title and description)' },
        { status: 400 }
      );
    }
    // Need a base location to satisfy DB constraint: use EN locationDisplayName or fallback to legacy location
    const baseLocation: string | undefined = enTranslation.locationDisplayName || body.location;
    if (!baseLocation || String(baseLocation).trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Missing required English location (locationDisplayName)' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Generate a slug from English title
    const slug = enTranslation.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug))
      .limit(1);

    const finalSlug = existingProperty.length > 0 ? `${slug}-${Date.now()}` : slug;

    // Parse area to get square feet
    const areaMatch = body.area.match(/[\d,]+/);
    const squareArea = areaMatch ? parseFloat(areaMatch[0].replace(/,/g, '')) : 1000;

    // Create property data
    const propertyData = {
      slug: finalSlug,
      type: body.type,
      photoUrl: body.image || '/placeholder.svg?height=300&width=400&text=Property%20Image',
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      squareArea,
      location: baseLocation,
      price: parseFloat(body.price.replace(/[^0-9.]/g, '')),
      currency: 'AED',
      pricePerSqFt: Math.round(parseFloat(body.price.replace(/[^0-9.]/g, '')) / squareArea),
      features: JSON.stringify(body.features || []),
      amenities: JSON.stringify(body.amenities || []),
      highlights: JSON.stringify(body.highlights || []),
      images: JSON.stringify(body.images || [body.image || '/placeholder.svg']),
      status: body.status || 'For Sale',
      isActive: true,
      isFeatured: body.featured || false,
      viewCount: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      agentName: 'Victoria Lancaster',
      agentPhone: '+971 4 2794 800 50 123 4567',
      agentEmail: 'victoria.lancaster@selectproperty.ae'
    };
    // Optional year built
    if (body.yearBuilt !== undefined && body.yearBuilt !== null && body.yearBuilt !== '') {
      (propertyData as any).yearBuilt = parseInt(body.yearBuilt);
    }
    // Optional parking spaces
    if (body.parkingSpaces !== undefined && body.parkingSpaces !== null && body.parkingSpaces !== '') {
      (propertyData as any).parkingSpaces = parseInt(body.parkingSpaces);
    }
    // Optional DLD URL
    if (body.dldUrl) {
      (propertyData as any).dldUrl = body.dldUrl;
    }
    // Optional unite number
    const rawUnite = body.uniteNumber ?? body.unite_number;
    if (rawUnite !== undefined && rawUnite !== null && String(rawUnite).trim() !== '') {
      (propertyData as any).uniteNumber = String(rawUnite).trim();
    }

    // Insert property (with auto-migration fallback for missing column)
    let result;
    result = await db.insert(properties).values(propertyData).returning();
    const newProperty = result[0];

    // Persist provided translations (including amenities/features/highlights)
    if (body.translations && typeof body.translations === 'object') {
      for (const [language, tr] of Object.entries<any>(body.translations)) {
        if (!tr || typeof tr !== 'object') continue;
        const payload: any = {
          title: tr.title || enTranslation.title || '',
          description: tr.description || enTranslation.description || '',
          locationDisplayName: tr.locationDisplayName || body.location || '',
          featuresTranslated: JSON.stringify(tr.featuresTranslated || []),
          amenitiesTranslated: JSON.stringify(tr.amenitiesTranslated || []),
          highlightsTranslated: JSON.stringify(tr.highlightsTranslated || []),
          updatedAt: new Date(),
        };

        const existing = await db
          .select()
          .from(propertyTranslations)
          .where(and(
            eq(propertyTranslations.propertyId, newProperty.id),
            eq(propertyTranslations.language, language)
          ))
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(propertyTranslations)
            .set(payload)
            .where(and(
              eq(propertyTranslations.propertyId, newProperty.id),
              eq(propertyTranslations.language, language)
            ));
        } else {
          await db.insert(propertyTranslations).values({
            propertyId: newProperty.id,
            language,
            ...payload,
          });
        }
      }
    }

    // Return formatted property
    const formattedProperty = convertToCurrentPropertyFormat({
      ...newProperty,
      title: enTranslation.title,
      description: enTranslation.description,
      locationDisplayName: body.location
    } as PropertyWithTranslation);

    return NextResponse.json({
      success: true,
      data: formattedProperty
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
