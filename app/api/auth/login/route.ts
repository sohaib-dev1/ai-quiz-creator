import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Set auth cookie
    await setAuthCookie({
      userId: user.userId,
      email: user.email,
      name: user.name,
    })

    return NextResponse.json({
      message: "Login successful",
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
