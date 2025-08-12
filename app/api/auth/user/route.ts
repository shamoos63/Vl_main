import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { admins } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      username, // current username (identifier)
      newUsername,
      currentPassword,
      newPassword,
    } = body as {
      username?: string
      newUsername?: string
      currentPassword?: string
      newPassword?: string
    }

    if (!username) {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 })
    }

    if (!newUsername && !newPassword) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const db = getDb()

    // Find user
    const users = await db.select().from(admins).where(eq(admins.username, username)).limit(1)
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const user = users[0]

    // Prepare updates
    const updates: any = { updatedAt: new Date() }

    // Handle username change
    if (newUsername && newUsername !== user.username) {
      // Ensure uniqueness
      const existing = await db.select().from(admins).where(eq(admins.username, newUsername)).limit(1)
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
      }
      updates.username = newUsername
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required' }, { status: 400 })
      }
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
      }
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(newPassword, salt)
      updates.passwordHash = hash
    }

    if (Object.keys(updates).length > 1) {
      await db.update(admins).set(updates).where(eq(admins.id, user.id))
    }

    const updatedUser = {
      id: user.id,
      username: updates.username || user.username,
      email: user.email,
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}


