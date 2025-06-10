import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import mime from "mime"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type" },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File size too large (max 5MB)" },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const ext = mime.getExtension(file.type) || ""
    const filename = `${uuidv4()}.${ext}`
    
    // In a production environment, you would upload to a storage service here
    // For this example, we'll save to the public/uploads directory
    const uploadDir = join(process.cwd(), "public/uploads")
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Ensure the uploads directory exists
    const fs = require("fs")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    const path = join(uploadDir, filename)
    await writeFile(path, buffer)

    // Return the URL of the uploaded file
    const url = `/uploads/${filename}`
    
    return NextResponse.json({
      success: true,
      url,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
