import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { propertyEvaluations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body as { status?: 'pending' | 'in_review' | 'completed' };

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    const db = getDb();
    const result = await db
      .update(propertyEvaluations)
      .set({ status, updatedAt: new Date() })
      .where(eq(propertyEvaluations.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
    }

    return NextResponse.json({ evaluation: result[0] });
  } catch (error) {
    console.error('Error updating evaluation:', error);
    return NextResponse.json({ error: 'Failed to update evaluation' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = getDb();
    const result = await db
      .delete(propertyEvaluations)
      .where(eq(propertyEvaluations.id, Number(id)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting evaluation:', error);
    return NextResponse.json({ error: 'Failed to delete evaluation' }, { status: 500 });
  }
}


