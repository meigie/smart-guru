import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { Department } from "@/types"
import { DEPARTMENTS } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, department } = await request.json()

    // Validation
    if (!name || !email || !password || !department) {
      return NextResponse.json(
        { error: "Name, email, password, and department are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Validate department
    if (!DEPARTMENTS.includes(department as Department)) {
      return NextResponse.json(
        { error: "Invalid department selected" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER", // Default role for new users
        department
      }
    })

    // Return success (don't return the password)
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(
      { 
        message: "User created successfully",
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 