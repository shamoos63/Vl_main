import { eq, and, desc, asc, gte, lte, like, sql } from 'drizzle-orm';
import { getDb, properties, propertyTranslations, Property, contactMessages, propertyEvaluations, welcomeInquiries } from './index';
import type { Property as CurrentProperty } from '../properties-data';

// ============================================================================
// PROPERTY DATABASE OPERATIONS
// ============================================================================

export interface PropertyFilters {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  status?: string;
  language?: 'en' | 'ar' | 'ru';
}

export interface PropertyWithTranslation extends Property {
  title?: string;
  description?: string;
  locationDisplayName?: string;
}

/**
 * Get all properties with optional filtering and pagination
 */
export async function getProperties(filters?: PropertyFilters, limit?: number, offset?: number): Promise<PropertyWithTranslation[]> {
  try {
    const conditions = [];
    
    // Add filters
    if (filters?.type) {
      conditions.push(eq(properties.type, filters.type));
    }
    if (filters?.location) {
      conditions.push(like(properties.location, `%${filters.location}%`));
    }
    if (filters?.minPrice) {
      conditions.push(gte(properties.price, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(properties.price, filters.maxPrice));
    }
    if (filters?.bedrooms) {
      conditions.push(eq(properties.bedrooms, filters.bedrooms));
    }
    if (filters?.status) {
      conditions.push(eq(properties.status, filters.status));
    }
    
    // Always filter for active properties
    conditions.push(eq(properties.isActive, true));

    const db = getDb();
    let query = db
      .select()
      .from(properties)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(properties.isFeatured), desc(properties.createdAt));

    if (limit) {
      query = query.limit(limit) as any;
    }
    if (offset) {
      query = query.offset(offset) as any;
    }

    const result = await query;
    
    // Get translations if language is specified
    if (filters?.language && filters.language !== 'en') {
      const propertiesWithTranslations = await Promise.all(
        result.map(async (property) => {
          const translation = await getDb()
            .select()
            .from(propertyTranslations)
            .where(
              and(
                eq(propertyTranslations.propertyId, property.id),
                eq(propertyTranslations.language, filters.language!)
              )
            )
            .limit(1);

          return {
            ...property,
            title: translation[0]?.title,
            description: translation[0]?.description,
            locationDisplayName: translation[0]?.locationDisplayName,
          } as PropertyWithTranslation;
        })
      );
      return propertiesWithTranslations;
    }

    return result;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw new Error('Failed to fetch properties');
  }
}

/**
 * Get a single property by ID
 */
export async function getPropertyById(id: number, language?: 'en' | 'ar' | 'ru') {
  try {
    const db = getDb();
    const property = await db
      .select()
      .from(properties)
      .where(and(eq(properties.id, id), eq(properties.isActive, true)))
      .limit(1);

    if (!property[0]) {
      return null;
    }

    // Increment view count for ID-based fetches as well
    await db
      .update(properties)
      .set({ viewCount: sql`${properties.viewCount} + 1` })
      .where(eq(properties.id, id));

    // Get translation if language is specified
    if (language && language !== 'en') {
      const translation = await getDb()
        .select()
        .from(propertyTranslations)
        .where(
          and(
            eq(propertyTranslations.propertyId, id),
            eq(propertyTranslations.language, language)
          )
        )
        .limit(1);

      return {
        ...property[0],
        title: translation[0]?.title,
        description: translation[0]?.description,
        locationDisplayName: translation[0]?.locationDisplayName,
      } as PropertyWithTranslation;
    }

    return property[0];
  } catch (error) {
    console.error('Error fetching property:', error);
    throw new Error('Failed to fetch property');
  }
}

/**
 * Get a property by slug
 */
export async function getPropertyBySlug(slug: string, language?: 'en' | 'ar' | 'ru'): Promise<PropertyWithTranslation | null> {
  try {
    const db = getDb();
    const property = await db
      .select()
      .from(properties)
      .where(and(eq(properties.slug, slug), eq(properties.isActive, true)))
      .limit(1);

    if (!property[0]) {
      return null;
    }

    // Increment view count
    await db
      .update(properties)
      .set({ viewCount: sql`${properties.viewCount} + 1` })
      .where(eq(properties.id, property[0].id));

    // Get translation if language is specified
    if (language && language !== 'en') {
      const translation = await getDb()
        .select()
        .from(propertyTranslations)
        .where(
          and(
            eq(propertyTranslations.propertyId, property[0].id),
            eq(propertyTranslations.language, language)
          )
        )
        .limit(1);

      return {
        ...property[0],
        title: translation[0]?.title,
        description: translation[0]?.description,
        locationDisplayName: translation[0]?.locationDisplayName,
      } as PropertyWithTranslation;
    }

    return property[0];
  } catch (error) {
    console.error('Error fetching property by slug:', error);
    throw new Error('Failed to fetch property');
  }
}

/**
 * Get featured properties
 */
export async function getFeaturedProperties(limit = 6, language?: 'en' | 'ar' | 'ru'): Promise<PropertyWithTranslation[]> {
  try {
    const db = getDb();
    const targetLanguage = language || 'en';
    
    console.log(`🌟 Fetching featured properties (limit: ${limit}, language: ${targetLanguage})`);
    
    const results = await db
      .select({
        id: properties.id,
        slug: properties.slug,
        type: properties.type,
        photoUrl: properties.photoUrl,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        squareArea: properties.squareArea,
        location: properties.location,
        price: properties.price,
        currency: properties.currency,
        pricePerSqFt: properties.pricePerSqFt,
        yearBuilt: properties.yearBuilt,
        parkingSpaces: properties.parkingSpaces,
        furnished: properties.furnished,
        petFriendly: properties.petFriendly,
        features: properties.features,
        amenities: properties.amenities,
        highlights: properties.highlights,
        images: properties.images,
        latitude: properties.latitude,
        longitude: properties.longitude,
        status: properties.status,
        isActive: properties.isActive,
        isFeatured: properties.isFeatured,
        viewCount: properties.viewCount,
        lastUpdated: properties.lastUpdated,
        agentName: properties.agentName,
        agentPhone: properties.agentPhone,
        agentEmail: properties.agentEmail,
        createdAt: properties.createdAt,
        updatedAt: properties.updatedAt,
        // Translations
        title: propertyTranslations.title,
        description: propertyTranslations.description,
        locationDisplayName: propertyTranslations.locationDisplayName,
      })
      .from(properties)
      .leftJoin(propertyTranslations, eq(properties.id, propertyTranslations.propertyId))
      .where(
        and(
          eq(properties.isActive, true),
          eq(properties.isFeatured, true), // Only get featured properties
          eq(propertyTranslations.language, targetLanguage)
        )
      )
      .orderBy(desc(properties.updatedAt))
      .limit(limit);

    console.log(`✅ Found ${results.length} featured properties`);
    
    return results.map(result => ({
      ...result,
      title: result.title,
      description: result.description,
      locationDisplayName: result.locationDisplayName,
    } as PropertyWithTranslation));
    
  } catch (error) {
    console.error('❌ Error fetching featured properties:', error);
    return [];
  }
}

/**
 * Convert database property to the current Property interface format
 */
export function convertToCurrentPropertyFormat(dbProperty: PropertyWithTranslation): CurrentProperty {
  const images = dbProperty.images ? JSON.parse(dbProperty.images) : [dbProperty.photoUrl];
  
  return {
    id: dbProperty.id,
    title: dbProperty.title || `${dbProperty.type} in ${dbProperty.location}`,
    description: dbProperty.description || '',
    location: dbProperty.locationDisplayName || dbProperty.location,
    price: dbProperty.price,
    bedrooms: dbProperty.bedrooms,
    bathrooms: dbProperty.bathrooms,
    area: `${dbProperty.squareArea?.toLocaleString()} sq ft`,
    squareFeet: dbProperty.squareArea,
    type: dbProperty.type as any,
    status: (dbProperty.status || 'For Sale') as any,
    image: dbProperty.photoUrl,
    featured: dbProperty.isFeatured,
    features: dbProperty.features ? JSON.parse(dbProperty.features) : [],
    amenities: dbProperty.amenities ? JSON.parse(dbProperty.amenities) : [],
    highlights: dbProperty.highlights ? JSON.parse(dbProperty.highlights) : [],
    images: images,
    videoId: dbProperty.videoId || "",
    yearBuilt: dbProperty.yearBuilt || 2020,
    parkingSpaces: dbProperty.parkingSpaces || 0,
    furnished: dbProperty.furnished || false,
    petFriendly: dbProperty.petFriendly || false,
    pricePerSqFt: dbProperty.pricePerSqFt || Math.round(dbProperty.price / dbProperty.squareArea),
    lastUpdated: dbProperty.lastUpdated || new Date().toISOString().split('T')[0],
    viewCount: dbProperty.viewCount || 0,
    dldUrl: (dbProperty as any).dldUrl || undefined,
    agent: {
      name: dbProperty.agentName || 'Victoria Lancaster',
      phone: dbProperty.agentPhone || '+971 4 2794 800 50 123 4567',
      email: dbProperty.agentEmail || 'victoria.lancaster@selectproperty.ae',
    },
    coordinates: dbProperty.latitude && dbProperty.longitude 
      ? { lat: dbProperty.latitude, lng: dbProperty.longitude }
      : undefined,
    nearbyPlaces: {
      schools: ['Dubai International School', 'GEMS Modern Academy'],
      hospitals: ['Dubai Hospital', 'Mediclinic City Hospital'],
      shopping: ['Dubai Mall', 'Marina Mall'],
      transport: ['Dubai Metro', 'Dubai Tram']
    }
  };
}

/**
 * Search properties by text
 */
export async function searchProperties(searchTerm: string, language?: 'en' | 'ar' | 'ru'): Promise<PropertyWithTranslation[]> {
  try {
    const db = getDb();
    const results = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.isActive, true),
          sql`(
            ${properties.location} LIKE ${'%' + searchTerm + '%'} OR
            ${properties.type} LIKE ${'%' + searchTerm + '%'} OR
            ${properties.features} LIKE ${'%' + searchTerm + '%'} OR
            ${properties.amenities} LIKE ${'%' + searchTerm + '%'}
          )`
        )
      )
      .orderBy(desc(properties.isFeatured), desc(properties.createdAt));

    // Get translations if needed
    if (language && language !== 'en') {
      const propertiesWithTranslations = await Promise.all(
        results.map(async (property) => {
          const translation = await getDb()
            .select()
            .from(propertyTranslations)
            .where(
              and(
                eq(propertyTranslations.propertyId, property.id),
                eq(propertyTranslations.language, language)
              )
            )
            .limit(1);

          return {
            ...property,
            title: translation[0]?.title,
            description: translation[0]?.description,
            locationDisplayName: translation[0]?.locationDisplayName,
          } as PropertyWithTranslation;
        })
      );
      return propertiesWithTranslations;
    }

    return results;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw new Error('Failed to search properties');
  }
}

export async function getSimilarProperties(currentProperty: {
  id: number;
  price: number | string;
  location: string;
  type?: string;
}, limit: number = 3): Promise<PropertyWithTranslation[]> {
  try {
    const db = getDb();
    
    // Convert price to number for comparison
    const currentPrice = typeof currentProperty.price === 'number' 
      ? currentProperty.price 
      : parseFloat(currentProperty.price.replace(/[^0-9.-]+/g, '')) || 0;
    
    // Define price range (±20% of current property price)
    const priceRange = currentPrice * 0.2;
    const minPrice = currentPrice - priceRange;
    const maxPrice = currentPrice + priceRange;
    
  
    
    // First, try to find properties with similar location and price range
    let results = await db
      .select({
        id: properties.id,
        slug: properties.slug,
        type: properties.type,
        photoUrl: properties.photoUrl,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        squareArea: properties.squareArea,
        location: properties.location,
        price: properties.price,
        currency: properties.currency,
        pricePerSqFt: properties.pricePerSqFt,
        yearBuilt: properties.yearBuilt,
        parkingSpaces: properties.parkingSpaces,
        furnished: properties.furnished,
        petFriendly: properties.petFriendly,
        features: properties.features,
        amenities: properties.amenities,
        highlights: properties.highlights,
        images: properties.images,
        latitude: properties.latitude,
        longitude: properties.longitude,
        status: properties.status,
        isActive: properties.isActive,
        isFeatured: properties.isFeatured,
        viewCount: properties.viewCount,
        lastUpdated: properties.lastUpdated,
        agentName: properties.agentName,
        agentPhone: properties.agentPhone,
        agentEmail: properties.agentEmail,
        createdAt: properties.createdAt,
        updatedAt: properties.updatedAt,
        // Translations
        title: propertyTranslations.title,
        description: propertyTranslations.description,
        locationDisplayName: propertyTranslations.locationDisplayName,
      })
      .from(properties)
      .leftJoin(propertyTranslations, eq(properties.id, propertyTranslations.propertyId))
      .where(
        and(
          eq(properties.isActive, true),
          eq(propertyTranslations.language, 'en'),
          // Exclude current property
          sql`${properties.id} != ${currentProperty.id}`,
          // Similar location (case-insensitive contains)
          like(sql`LOWER(${properties.location})`, `%${currentProperty.location.toLowerCase()}%`),
          // Price range filter
          and(
            gte(properties.price, minPrice),
            lte(properties.price, maxPrice)
          )
        )
      )
      .limit(limit);
    
    // If we don't have enough results, expand search to just price range
    if (results.length < limit) {
      
      const additionalResults = await db
        .select({
          id: properties.id,
          slug: properties.slug,
          type: properties.type,
          photoUrl: properties.photoUrl,
          bedrooms: properties.bedrooms,
          bathrooms: properties.bathrooms,
          squareArea: properties.squareArea,
          location: properties.location,
          price: properties.price,
          currency: properties.currency,
          pricePerSqFt: properties.pricePerSqFt,
          yearBuilt: properties.yearBuilt,
          parkingSpaces: properties.parkingSpaces,
          furnished: properties.furnished,
          petFriendly: properties.petFriendly,
          features: properties.features,
          amenities: properties.amenities,
          highlights: properties.highlights,
          images: properties.images,
          latitude: properties.latitude,
          longitude: properties.longitude,
          status: properties.status,
          isActive: properties.isActive,
          isFeatured: properties.isFeatured,
          viewCount: properties.viewCount,
          lastUpdated: properties.lastUpdated,
          agentName: properties.agentName,
          agentPhone: properties.agentPhone,
          agentEmail: properties.agentEmail,
          createdAt: properties.createdAt,
          updatedAt: properties.updatedAt,
          // Translations
          title: propertyTranslations.title,
          description: propertyTranslations.description,
          locationDisplayName: propertyTranslations.locationDisplayName,
        })
        .from(properties)
        .leftJoin(propertyTranslations, eq(properties.id, propertyTranslations.propertyId))
        .where(
          and(
            eq(properties.isActive, true),
            eq(propertyTranslations.language, 'en'),
            // Exclude current property and already found properties
            sql`${properties.id} != ${currentProperty.id}`,
            results.length > 0 ? sql`${properties.id} NOT IN (${results.map(r => r.id).join(',')})` : sql`1=1`,
            // Price range filter
            and(
              gte(properties.price, minPrice),
              lte(properties.price, maxPrice)
            )
          )
        )
        .limit(limit - results.length);
      
      results = [...results, ...additionalResults];
    }
    
    // If still not enough, get properties from same location regardless of price
    if (results.length < limit) {
     
      const locationResults = await db
        .select({
          id: properties.id,
          slug: properties.slug,
          type: properties.type,
          photoUrl: properties.photoUrl,
          bedrooms: properties.bedrooms,
          bathrooms: properties.bathrooms,
          squareArea: properties.squareArea,
          location: properties.location,
          price: properties.price,
          currency: properties.currency,
          pricePerSqFt: properties.pricePerSqFt,
          yearBuilt: properties.yearBuilt,
          parkingSpaces: properties.parkingSpaces,
          furnished: properties.furnished,
          petFriendly: properties.petFriendly,
          features: properties.features,
          amenities: properties.amenities,
          highlights: properties.highlights,
          images: properties.images,
          latitude: properties.latitude,
          longitude: properties.longitude,
          status: properties.status,
          isActive: properties.isActive,
          isFeatured: properties.isFeatured,
          viewCount: properties.viewCount,
          lastUpdated: properties.lastUpdated,
          agentName: properties.agentName,
          agentPhone: properties.agentPhone,
          agentEmail: properties.agentEmail,
          createdAt: properties.createdAt,
          updatedAt: properties.updatedAt,
          // Translations
          title: propertyTranslations.title,
          description: propertyTranslations.description,
          locationDisplayName: propertyTranslations.locationDisplayName,
        })
        .from(properties)
        .leftJoin(propertyTranslations, eq(properties.id, propertyTranslations.propertyId))
        .where(
          and(
            eq(properties.isActive, true),
            eq(propertyTranslations.language, 'en'),
            // Exclude current property and already found properties
            sql`${properties.id} != ${currentProperty.id}`,
            results.length > 0 ? sql`${properties.id} NOT IN (${results.map(r => r.id).join(',')})` : sql`1=1`,
            // Similar location
            like(sql`LOWER(${properties.location})`, `%${currentProperty.location.toLowerCase()}%`)
          )
        )
        .limit(limit - results.length);
      
      results = [...results, ...locationResults];
    }
    
    // Convert to PropertyWithTranslation format - results now have flat structure
    const similarProperties = results.map(result => ({
      id: result.id,
      slug: result.slug,
      type: result.type,
      photoUrl: result.photoUrl,
      bedrooms: result.bedrooms,
      bathrooms: result.bathrooms,
      squareArea: result.squareArea,
      location: result.location,
      price: result.price,
      currency: result.currency,
      pricePerSqFt: result.pricePerSqFt,
      yearBuilt: result.yearBuilt,
      parkingSpaces: result.parkingSpaces,
      furnished: result.furnished,
      petFriendly: result.petFriendly,
      features: result.features,
      amenities: result.amenities,
      highlights: result.highlights,
      images: result.images,
      latitude: result.latitude,
      longitude: result.longitude,
      status: result.status,
      isActive: result.isActive,
      isFeatured: result.isFeatured,
      viewCount: result.viewCount,
      lastUpdated: result.lastUpdated,
      agentName: result.agentName,
      agentPhone: result.agentPhone,
      agentEmail: result.agentEmail,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      // Use translation fields directly
      title: result.title,
      description: result.description,
      locationDisplayName: result.locationDisplayName,
    } as PropertyWithTranslation));
    
    console.log(`✅ Found ${similarProperties.length} similar properties`);
    return similarProperties.map(convertToCurrentPropertyFormat);
    
  } catch (error) {
    console.error('❌ Error finding similar properties:', error);
    return [];
  }
}

// ============================================================================
// CONTACT & EVALUATION OPERATIONS
// ============================================================================

export async function createContactMessage(data: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  budgetRange?: string;
  messageDetails: string;
  preferredContactMethod?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    console.log('🔗 Getting database connection...');
    const db = getDb();
    console.log('📊 Database connection established, inserting data...');
    console.log('📝 Data to insert:', { ...data, email: '[REDACTED]', messageDetails: '[TRUNCATED]' });
    
    // Let the database handle createdAt with its default, but set updatedAt to current time
    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date() // This will be current timestamp
    };
    
    const result = await db.insert(contactMessages).values(dataWithTimestamp).returning();
    console.log('✅ Insert successful, result:', result.length ? 'Record created' : 'No result');
    return (result as any)[0];
  } catch (error) {
    console.error('❌ Error creating contact message:', error);
    throw new Error('Failed to create contact message');
  }
}

export async function updateContactMessage(id: number, updates: {
  isRead?: boolean;
  isReplied?: boolean;
  priority?: string;
}) {
  try {
    console.log('🔄 Updating contact message:', id);
    const db = getDb();
    
    // Always update the updatedAt timestamp
    const dataWithTimestamp = {
      ...updates,
      updatedAt: new Date()
    };
    
    const result = await db
      .update(contactMessages)
      .set(dataWithTimestamp)
      .where(eq(contactMessages.id, id))
      .returning();
      
    console.log('✅ Contact message updated successfully');
    return (result as any)[0];
  } catch (error) {
    console.error('❌ Error updating contact message:', error);
    throw new Error('Failed to update contact message');
  }
}

export async function createPropertyEvaluation(data: {
  contactName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  propertyType: string;
  propertyLocation: string;
  bedrooms: number;
  bathrooms: number;
  squareArea: number;
  condition: string;
  yearBuilt?: number;
  amenities?: string;
  additionalDetails?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const db = getDb();
    
    // Set updatedAt timestamp for consistency
    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date()
    };
    
    const result = await db.insert(propertyEvaluations).values(dataWithTimestamp).returning();
    return (result as any)[0];
  } catch (error) {
    console.error('Error creating property evaluation:', error);
    throw new Error('Failed to create property evaluation');
  }
}

export async function createWelcomeInquiry(data: {
  name: string;
  email: string;
  phoneNumber: string;
  question: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const db = getDb();
    
    // Set updatedAt timestamp for consistency
    const dataWithTimestamp = {
      ...data,
      updatedAt: new Date()
    };
    
    const result = await db.insert(welcomeInquiries).values(dataWithTimestamp).returning();
    return (result as any)[0];
  } catch (error) {
    console.error('Error creating welcome inquiry:', error);
    throw new Error('Failed to create welcome inquiry');
  }
}