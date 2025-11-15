import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { propertyEvaluations } from '@/lib/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { createPropertyEvaluation } from '@/lib/db/utils';

export async function POST(request: NextRequest) {
  try {
    
    const body = await request.json();
    
    
    // Extract and validate form data
    const {
      name,
      email,
      phone,
      propertyType,
      location,
      bedrooms,
      bathrooms,
      area,
      condition,
      yearBuilt,
      amenities,
      description
    } = body;

    // Basic validation
    if (!name || !email || !propertyType || !location || !area) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create property evaluation in dedicated table
    
    const created = await createPropertyEvaluation({
      contactName: name,
      contactEmail: email,
      contactPhoneNumber: phone || 'Not provided',
      propertyType,
      propertyLocation: location,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      squareArea: parseFloat(area) || 0,
      condition: condition || 'unknown',
      yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined,
      amenities,
      additionalDetails: description,
      ipAddress,
      userAgent
    });
    

    return NextResponse.json({
      success: true,
      message: 'Evaluation request submitted successfully',
      data: {
        id: created.id,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error submitting evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit evaluation request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status'); // 'pending' | 'in_review' | 'completed'
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = getDb();

    const conditions = [] as any[];
    if (search) {
      conditions.push(
        sql`(
          LOWER(${propertyEvaluations.contactName}) LIKE ${'%' + search.toLowerCase() + '%'} OR
          LOWER(${propertyEvaluations.contactEmail}) LIKE ${'%' + search.toLowerCase() + '%'} OR
          LOWER(${propertyEvaluations.propertyLocation}) LIKE ${'%' + search.toLowerCase() + '%'} OR
          LOWER(${propertyEvaluations.propertyType}) LIKE ${'%' + search.toLowerCase() + '%'}
        )`
      );
    }
    if (status) {
      conditions.push(eq(propertyEvaluations.status, status));
    }

    const rows = await db
      .select()
      .from(propertyEvaluations)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(propertyEvaluations.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ evaluations: rows });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluations' },
      { status: 500 }
    );
  }
}
