import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { properties, propertyTranslations } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { type PropertyWithTranslation, convertToCurrentPropertyFormat } from '@/lib/db/utils';

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
    
    // Validate required fields
    const requiredFields = ['title', 'location', 'price', 'bedrooms', 'bathrooms', 'area', 'type', 'description'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const db = getDb();

    // Generate a slug from title
    const slug = body.title
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
      location: body.location,
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

    // Insert property
    const result = await db.insert(properties).values(propertyData).returning();
    const newProperty = result[0];

    // Insert English translation
    await db.insert(propertyTranslations).values({
      propertyId: newProperty.id,
      language: 'en',
      title: body.title,
      description: body.description,
      locationDisplayName: body.location
    });

    // Return formatted property
    const formattedProperty = convertToCurrentPropertyFormat({
      ...newProperty,
      title: body.title,
      description: body.description,
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
