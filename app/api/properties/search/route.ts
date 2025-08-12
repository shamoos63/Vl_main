import { NextRequest, NextResponse } from 'next/server';
import { PropertyService } from '@/lib/properties-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract search parameters
    const query = searchParams.get('query') || '';
    const propertyType = searchParams.get('propertyType') || '';
    const location = searchParams.get('location') || '';
    const priceRange = searchParams.get('priceRange') || '';
    const bedrooms = searchParams.get('bedrooms') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    console.log('🔍 Property search request:', {
      query,
      propertyType,
      location,
      priceRange,
      bedrooms,
      minPrice,
      maxPrice,
      page,
      limit
    });

    // Get all properties first
    let properties = await PropertyService.getAllProperties();

    // Apply text search filter (searches in title, description, location)
    if (query.trim()) {
      const searchQuery = query.toLowerCase().trim();
      properties = properties.filter(property => 
        property.title?.toLowerCase().includes(searchQuery) ||
        property.description?.toLowerCase().includes(searchQuery) ||
        property.location?.toLowerCase().includes(searchQuery) ||
        property.type?.toLowerCase().includes(searchQuery)
      );
    }

    // Apply property type filter
    if (propertyType) {
      properties = properties.filter(property => 
        property.type?.toLowerCase() === propertyType.toLowerCase()
      );
    }

    // Apply location filter
    if (location) {
      properties = properties.filter(property => 
        property.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Apply bedroom filter
    if (bedrooms) {
      if (bedrooms === '4+') {
        properties = properties.filter(property => 
          property.bedrooms && property.bedrooms >= 4
        );
      } else {
        const bedroomCount = parseInt(bedrooms);
        if (!isNaN(bedroomCount)) {
          properties = properties.filter(property => 
            property.bedrooms === bedroomCount
          );
        }
      }
    }

    // Apply price range filter
    if (priceRange) {
      properties = properties.filter(property => {
        const price = typeof property.price === 'number' 
          ? property.price 
          : parseFloat(property.price?.toString().replace(/[^0-9.-]+/g, '') || '0');
        
        switch (priceRange) {
          case '500k-1m':
            return price >= 500000 && price < 1000000;
          case '1m-2m':
            return price >= 1000000 && price < 2000000;
          case '2m-5m':
            return price >= 2000000 && price < 5000000;
          case '5m+':
            return price >= 5000000;
          default:
            return true;
        }
      });
    }

    // Apply custom min/max price filters
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        properties = properties.filter(property => {
          const price = typeof property.price === 'number' 
            ? property.price 
            : parseFloat(property.price?.toString().replace(/[^0-9.-]+/g, '') || '0');
          return price >= min;
        });
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        properties = properties.filter(property => {
          const price = typeof property.price === 'number' 
            ? property.price 
            : parseFloat(property.price?.toString().replace(/[^0-9.-]+/g, '') || '0');
          return price <= max;
        });
      }
    }

    // Calculate pagination
    const total = properties.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = properties.slice(startIndex, endIndex);

    // Calculate search metadata
    const searchMetadata = {
      hasSearch: !!(query || propertyType || location || priceRange || bedrooms || minPrice || maxPrice),
      searchQuery: query,
      filters: {
        propertyType,
        location,
        priceRange,
        bedrooms,
        minPrice,
        maxPrice
      }
    };

    console.log(`✅ Found ${total} properties matching search criteria`);

    return NextResponse.json({
      success: true,
      data: {
        properties: paginatedProperties,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        metadata: searchMetadata
      }
    });

  } catch (error) {
    console.error('❌ Error searching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search properties' },
      { status: 500 }
    );
  }
}
