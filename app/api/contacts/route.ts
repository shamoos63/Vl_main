import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { contactMessages, welcomeInquiries } from '@/lib/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase();
    const status = searchParams.get('status'); // new | read | replied
    const type = searchParams.get('type'); // general | evaluation | welcome | all
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = getDb();

    // contact_messages
    const contactConditions: any[] = [];
    if (search) {
      contactConditions.push(
        sql`(
          LOWER(${contactMessages.firstName}) LIKE ${'%' + search + '%'} OR
          LOWER(${contactMessages.lastName}) LIKE ${'%' + search + '%'} OR
          LOWER(${contactMessages.email}) LIKE ${'%' + search + '%'} OR
          LOWER(${contactMessages.messageDetails}) LIKE ${'%' + search + '%'}
        )`
      );
    }
    if (status) {
      if (status === 'new') {
        contactConditions.push(and(eq(contactMessages.isRead, false), eq(contactMessages.isReplied, false)));
      } else if (status === 'read') {
        contactConditions.push(and(eq(contactMessages.isRead, true), eq(contactMessages.isReplied, false)));
      } else if (status === 'replied') {
        contactConditions.push(eq(contactMessages.isReplied, true));
      }
    }
    if (type && type !== 'all') {
      // Map requested type to source value where possible
      if (type === 'evaluation') {
        contactConditions.push(eq(contactMessages.source, 'evaluation'));
      } else if (type === 'general') {
        contactConditions.push(sql`${contactMessages.source} != 'evaluation'`);
      }
    }

    const contactRows = await db
      .select()
      .from(contactMessages)
      .where(contactConditions.length ? and(...contactConditions) : undefined)
      .orderBy(desc(contactMessages.createdAt))
      .limit(limit)
      .offset(offset);

    // welcome_inquiries
    const welcomeConditions: any[] = [];
    if (search) {
      welcomeConditions.push(
        sql`(
          LOWER(${welcomeInquiries.name}) LIKE ${'%' + search + '%'} OR
          LOWER(${welcomeInquiries.email}) LIKE ${'%' + search + '%'} OR
          LOWER(${welcomeInquiries.question}) LIKE ${'%' + search + '%'}
        )`
      );
    }
    if (status) {
      if (status === 'new') {
        welcomeConditions.push(eq(welcomeInquiries.isRead, false));
      } else if (status === 'read') {
        welcomeConditions.push(eq(welcomeInquiries.isRead, true));
      } else if (status === 'replied') {
        // welcome_inquiries does not track replied, treat as read
        welcomeConditions.push(eq(welcomeInquiries.isRead, true));
      }
    }
    if (type && type !== 'all' && type !== 'welcome') {
      // When filtering for non-welcome types, skip welcome inquiries
      welcomeConditions.push(sql`1 = 0`);
    }

    const welcomeRows = await db
      .select()
      .from(welcomeInquiries)
      .where(welcomeConditions.length ? and(...welcomeConditions) : undefined)
      .orderBy(desc(welcomeInquiries.createdAt))
      .limit(limit)
      .offset(offset);

    // Normalize and merge
    const normalized = [
      ...contactRows.map((r: any) => {
        const statusVal = r.isReplied ? 'replied' : (r.isRead ? 'read' : 'new');
        return {
          id: r.id,
          name: `${r.firstName} ${r.lastName}`.trim(),
          email: r.email,
          phone: r.phoneNumber,
          message: r.messageDetails,
          type: r.source === 'evaluation' ? 'evaluation' : 'general',
          date: r.createdAt,
          status: statusVal,
          _source: 'contact' as const,
        };
      }),
      ...welcomeRows.map((r: any) => {
        const statusVal = r.isRead ? 'read' : 'new';
        return {
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phoneNumber,
          message: r.question,
          type: 'welcome',
          date: r.createdAt,
          status: statusVal,
          _source: 'welcome' as const,
        };
      })
    ];

    // Sort by date desc after merge
    normalized.sort((a: any, b: any) => Number(b.date) - Number(a.date));

    return NextResponse.json({ contacts: normalized });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}


