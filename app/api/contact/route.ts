import { NextRequest, NextResponse } from 'next/server';
import { createContactMessage } from '@/lib/db/utils';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Contact API endpoint called');
    const body = await request.json();
    console.log('📝 Received contact form data:', { ...body, email: '[REDACTED]' });
    
    // Extract and validate form data
    const {
      firstName,
      lastName,
      email,
      phone,
      budget,
      message,
      source
    } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create contact message with contact_us source
    console.log('💾 Attempting to save to database...');
    const contactMessage = await createContactMessage({
      firstName,
      lastName,
      phoneNumber: phone || 'Not provided',
      email,
      budgetRange: budget,
      messageDetails: message,
      preferredContactMethod: 'email',
      source: source || 'contact_us', // Use property ID if provided, otherwise default to 'contact_us'
      ipAddress,
      userAgent
    });
    console.log('✅ Successfully saved to database:', contactMessage.id);

    return NextResponse.json({
      success: true,
      message: 'Contact message sent successfully',
      data: {
        id: contactMessage.id,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error submitting contact message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send contact message' },
      { status: 500 }
    );
  }
}
