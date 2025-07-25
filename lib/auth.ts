import { getDatabase } from "./mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  _id?: string
  userId: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthUser {
  userId: string
  email: string
  name: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const db = await getDatabase()
  const usersCollection = db.collection("users")

  // Check if user already exists
  const existingUser = await usersCollection.findOne({ email })
  if (existingUser) {
    throw new Error("User already exists with this email")
  }

  const hashedPassword = await hashPassword(password)
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const user: User = {
    userId,
    email,
    name,
    createdAt: new Date(),
  }

  await usersCollection.insertOne({
    ...user,
    password: hashedPassword,
  })

  return user
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const db = await getDatabase()
  const usersCollection = db.collection("users")

  const user = await usersCollection.findOne({ email })
  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDatabase()
  const usersCollection = db.collection("users")

  const user = await usersCollection.findOne({ userId })
  if (!user) {
    return null
  }

  return {
    userId: user.userId,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")

  if (!token) {
    return null
  }

  return verifyToken(token.value)
}

export async function setAuthCookie(user: AuthUser) {
  const token = generateToken(user)
  const cookieStore = cookies()

  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
}
