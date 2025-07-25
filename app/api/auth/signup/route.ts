import { type NextRequest, NextResponse } from "next/server"
import { createUser, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const user = await createUser(email, password, name)

    // Set auth cookie
    await setAuthCookie({
      userId: user.userId,
      email: user.email,
      name: user.name,
    })

    return NextResponse.json({
      message: "Account created successfully",
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)

    if (error instanceof Error && error.message === "User already exists with this email") {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 409 })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
