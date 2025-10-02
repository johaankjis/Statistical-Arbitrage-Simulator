import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { join } from "path"
import { writeFile } from "fs/promises"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    const configPath = join(process.cwd(), "data", "backtest_config.json")
    await writeFile(configPath, JSON.stringify(config))

    const scriptPath = join(process.cwd(), "scripts", "backtest_engine.py")
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath}`)

    if (stderr) {
      console.error("Python stderr:", stderr)
    }

    const result = JSON.parse(stdout)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Backtest error:", error)
    return NextResponse.json({ error: "Failed to run backtest" }, { status: 500 })
  }
}
