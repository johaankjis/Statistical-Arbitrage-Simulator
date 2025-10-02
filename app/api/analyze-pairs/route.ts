import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { join } from "path"

const execAsync = promisify(exec)

export async function POST() {
  try {
    const scriptPath = join(process.cwd(), "scripts", "cointegration_test.py")
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath}`)

    if (stderr) {
      console.error("Python stderr:", stderr)
    }

    const result = JSON.parse(stdout)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Cointegration analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze pairs", pairs: [] }, { status: 500 })
  }
}
