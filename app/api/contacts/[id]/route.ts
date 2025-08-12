import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { contactMessages, welcomeInquiries } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Update status (read / replied) for contact messages or welcome inquiries
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { source, status } = body as { source: 'contact' | 'welcome', status: 'new' | 'read' | 'replied' };
    const id = Number(params.id);

    if (!source || !status) {
      return NextResponse.json({ error: 'Missing source or status' }, { status: 400 });
    }

    const db = getDb();
    if (source === 'contact') {
      const updates: any = { updatedAt: new Date() };
      if (status === 'new') { updates.isRead = false; updates.isReplied = false; }
      if (status === 'read') { updates.isRead = true; updates.isReplied = false; }
      if (status === 'replied') { updates.isRead = true; updates.isReplied = true; }
      const result = await db.update(contactMessages).set(updates).where(eq(contactMessages.id, id)).returning();
      if (!result.length) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
      return NextResponse.json({ contact: result[0] });
    } else {
      const updates: any = { updatedAt: new Date(), isRead: status !== 'new' };
      const result = await db.update(welcomeInquiries).set(updates).where(eq(welcomeInquiries.id, id)).returning();
      if (!result.length) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
      return NextResponse.json({ inquiry: result[0] });
    }
  } catch (error) {
    console.error('Error updating contact/inquiry:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source'); // 'contact' | 'welcome'
    const id = Number(params.id);
    if (!source) return NextResponse.json({ error: 'Missing source' }, { status: 400 });
    const db = getDb();
    if (source === 'contact') {
      const result = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
      if (!result.length) return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    } else {
      const result = await db.delete(welcomeInquiries).where(eq(welcomeInquiries.id, id)).returning();
      if (!result.length) return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact/inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}


