import { NextRequest, NextResponse } from "next/server"
import { getDb, welcomeInquiries } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, details } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required fields." },
        { status: 400 }
      )
    }

    // Get client information
    const ipAddress = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Get database instance
    const db = getDb()
    
    // Insert into database
    const result = await db.insert(welcomeInquiries).values({
      name: name.trim(),
      email: email.trim(),
      phoneNumber: phone?.trim() || "",
      question: details?.trim() || "",
      ipAddress,
      userAgent,
    }).returning()

    console.log("Welcome inquiry saved:", result[0])

    return NextResponse.json({ 
      message: "Thank you for your inquiry! Victoria will contact you soon.",
      success: true 
    })

  } catch (error) {
    console.error("Error saving welcome inquiry:", error)
    
    return NextResponse.json(
      { 
        message: "There was an error processing your request. Please try again.",
        success: false 
      },
      { status: 500 }
    )
  }
}