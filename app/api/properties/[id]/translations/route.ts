import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/index';
import { propertyTranslations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET - Fetch all translations for a property
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
    const translations = await db
      .select()
      .from(propertyTranslations)
      .where(eq(propertyTranslations.propertyId, propertyId));

    // Format translations by language
    const translationsByLanguage = translations.reduce((acc, translation) => {
      acc[translation.language] = {
        title: translation.title,
        description: translation.description,
        locationDisplayName: translation.locationDisplayName,
        featuresTranslated: translation.featuresTranslated ? JSON.parse(translation.featuresTranslated) : [],
        amenitiesTranslated: translation.amenitiesTranslated ? JSON.parse(translation.amenitiesTranslated) : [],
        highlightsTranslated: translation.highlightsTranslated ? JSON.parse(translation.highlightsTranslated) : []
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      data: translationsByLanguage
    });
  } catch (error) {
    console.error('Error fetching property translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property translations' },
      { status: 500 }
    );
  }
}

// POST - Save translations for a property
export async function POST(
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
    const { translations } = body;

    if (!translations || typeof translations !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Translations data is required' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Save each language translation
    for (const [language, translationData] of Object.entries(translations)) {
      if (!translationData || typeof translationData !== 'object') continue;

      const data = translationData as any;
      
      // Check if translation exists
      const existingTranslation = await db
        .select()
        .from(propertyTranslations)
        .where(
          and(
            eq(propertyTranslations.propertyId, propertyId),
            eq(propertyTranslations.language, language)
          )
        )
        .limit(1);

      const translationPayload = {
        title: data.title || '',
        description: data.description || '',
        locationDisplayName: data.locationDisplayName || '',
        featuresTranslated: JSON.stringify(data.featuresTranslated || []),
        amenitiesTranslated: JSON.stringify(data.amenitiesTranslated || []),
        highlightsTranslated: JSON.stringify(data.highlightsTranslated || []),
        updatedAt: Math.floor(Date.now() / 1000) // Unix timestamp in seconds
      };

      if (existingTranslation.length > 0) {
        // Update existing translation
        await db
          .update(propertyTranslations)
          .set(translationPayload)
          .where(
            and(
              eq(propertyTranslations.propertyId, propertyId),
              eq(propertyTranslations.language, language)
            )
          );
      } else {
        // Create new translation
        await db.insert(propertyTranslations).values({
          propertyId,
          language,
          ...translationPayload
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Translations saved successfully'
    });
  } catch (error) {
    console.error('Error saving property translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save property translations' },
      { status: 500 }
    );
  }
}
