import { NextRequest, NextResponse } from 'next/server';
import { getSimilarProperties } from '@/lib/db/utils';
import { PropertyService } from '@/lib/properties-service';

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

    

    // Check if database is available
    if (!PropertyService.isDatabaseAvailable()) {
      console.warn('⚠️  Database not configured, returning empty similar properties');
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get the current property first
    const currentProperty = await PropertyService.getPropertyById(propertyId);
    
    if (!currentProperty) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Get similar properties
    const similarProperties = await getSimilarProperties({
      id: currentProperty.id,
      price: currentProperty.price,
      location: currentProperty.location,
      type: currentProperty.type
    }, 3);

    

    return NextResponse.json({
      success: true,
      data: similarProperties
    });

  } catch (error) {
    console.error('❌ Error fetching similar properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch similar properties' },
      { status: 500 }
    );
  }
}
