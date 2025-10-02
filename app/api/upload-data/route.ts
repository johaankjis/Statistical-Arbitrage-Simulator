import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const dataDir = join(process.cwd(), "data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(dataDir, "market_data.csv")
    await writeFile(filePath, buffer)

    const content = buffer.toString("utf-8")
    const lines = content.split("\n").filter((line) => line.trim())
    const symbols = new Set<string>()

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",")
      if (parts.length >= 2) {
        symbols.add(parts[1].trim())
      }
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      rows: lines.length - 1,
      symbols: Array.from(symbols),
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
