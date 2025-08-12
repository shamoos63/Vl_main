import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { properties, propertyTranslations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { type PropertyWithTranslation, convertToCurrentPropertyFormat } from '@/lib/db/utils';

// GET - Fetch single property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db
      .select()
      .from(properties)
      .where(and(eq(properties.id, propertyId), eq(properties.isActive, true)))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Get English translation
    const translation = await db
      .select()
      .from(propertyTranslations)
      .where(
        and(
          eq(propertyTranslations.propertyId, propertyId),
          eq(propertyTranslations.language, 'en')
        )
      )
      .limit(1);

    const propertyWithTranslation = {
      ...result[0],
      title: translation[0]?.title,
      description: translation[0]?.description,
      locationDisplayName: translation[0]?.locationDisplayName,
    } as PropertyWithTranslation;

    const formattedProperty = convertToCurrentPropertyFormat(propertyWithTranslation);

    return NextResponse.json({
      success: true,
      data: formattedProperty
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const db = getDb();

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Parse area to get square feet
    const areaMatch = body.area ? body.area.match(/[\d,]+/) : null;
    const squareArea = areaMatch ? parseFloat(areaMatch[0].replace(/,/g, '')) : existingProperty[0].squareArea;

    // Update property data
    const updateData: any = {
      updatedAt: new Date(),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (body.type) updateData.type = body.type;
    if (body.image) updateData.photoUrl = body.image;
    if (body.bedrooms) updateData.bedrooms = parseInt(body.bedrooms);
    if (body.bathrooms) updateData.bathrooms = parseInt(body.bathrooms);
    if (squareArea) updateData.squareArea = squareArea;
    if (body.location) updateData.location = body.location;
    if (body.price) {
      const priceValue = parseFloat(body.price.replace(/[^0-9.]/g, ''));
      updateData.price = priceValue;
      updateData.pricePerSqFt = Math.round(priceValue / squareArea);
    }
    if (body.status) updateData.status = body.status;
    if (body.featured !== undefined) updateData.isFeatured = body.featured;
    if (body.features) updateData.features = JSON.stringify(body.features);
    if (body.amenities) updateData.amenities = JSON.stringify(body.amenities);
    if (body.highlights) updateData.highlights = JSON.stringify(body.highlights);
    if (body.images) updateData.images = JSON.stringify(body.images);

    // Update property
    await db
      .update(properties)
      .set(updateData)
      .where(eq(properties.id, propertyId));

    // Update translation if title or description provided
    if (body.title || body.description || body.location) {
      const translationUpdate: any = {};
      if (body.title) translationUpdate.title = body.title;
      if (body.description) translationUpdate.description = body.description;
      if (body.location) translationUpdate.locationDisplayName = body.location;
      
      // Check if translation exists
      const existingTranslation = await db
        .select()
        .from(propertyTranslations)
        .where(
          and(
            eq(propertyTranslations.propertyId, propertyId),
            eq(propertyTranslations.language, 'en')
          )
        )
        .limit(1);

      if (existingTranslation.length > 0) {
        await db
          .update(propertyTranslations)
          .set(translationUpdate)
          .where(
            and(
              eq(propertyTranslations.propertyId, propertyId),
              eq(propertyTranslations.language, 'en')
            )
          );
      } else {
        await db.insert(propertyTranslations).values({
          propertyId,
          language: 'en',
          title: body.title || '',
          description: body.description || '',
          locationDisplayName: body.location || ''
        });
      }
    }

    // Fetch updated property
    const updatedProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    const translation = await db
      .select()
      .from(propertyTranslations)
      .where(
        and(
          eq(propertyTranslations.propertyId, propertyId),
          eq(propertyTranslations.language, 'en')
        )
      )
      .limit(1);

    const propertyWithTranslation = {
      ...updatedProperty[0],
      title: translation[0]?.title,
      description: translation[0]?.description,
      locationDisplayName: translation[0]?.locationDisplayName,
    } as PropertyWithTranslation;

    const formattedProperty = convertToCurrentPropertyFormat(propertyWithTranslation);

    return NextResponse.json({
      success: true,
      data: formattedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE - Delete property (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const propertyId = parseInt(id);
    
    if (isNaN(propertyId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await db
      .update(properties)
      .set({ 
        isActive: false,
        updatedAt: new Date()
      })
      .where(eq(properties.id, propertyId));

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
