// app/api/register/route.ts
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/user"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    await connectDB()

    const userExists = await User.findOne({ email })
    if (userExists) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const user = new User({ name, email, password, role })
    await user.save()

    return NextResponse.json({ message: "User created" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}
// This code defines a POST route for user registration in a Next.js API route.
// It connects to a MongoDB database, checks if a user with the provided email already exists,