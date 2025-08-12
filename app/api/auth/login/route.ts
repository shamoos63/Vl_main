import { NextRequest, NextResponse } from "next/server"
import { getDb, admins } from "@/lib/db/index"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      )
    }

    // Check if database is available
    try {
      const db = getDb()
      
      // Query the admin table for the user
      const adminUser = await db
        .select()
        .from(admins)
        .where(admins.username === username)
        .limit(1)

      if (adminUser.length === 0) {
        return NextResponse.json(
          { message: "Invalid username or password" },
          { status: 401 }
        )
      }

      const user = adminUser[0]

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid username or password" },
          { status: 401 }
        )
      }

      // Check if user is active
      if (!user.isActive) {
        return NextResponse.json(
          { message: "Account is deactivated. Please contact administrator." },
          { status: 403 }
        )
      }

      // Generate a simple token (in production, use JWT)
      const token = `vl_${user.id}_${Date.now()}_${Math.random().toString(36).substring(2)}`

      // Update last login time
      await db
        .update(admins)
        .set({ lastLoginAt: new Date() })
        .where(admins.id === user.id)

      // Return success response
      return NextResponse.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: true,
        },
        token,
      })

    } catch (dbError) {
      console.error("Database error:", dbError)
      
      return NextResponse.json(
        { message: "Authentication service unavailable. Please try again later." },
        { status: 503 }
      )
    }

  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
