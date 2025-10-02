"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DataUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus("idle")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload-data", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUploadStatus("success")
        setMessage(`Successfully uploaded ${data.symbols?.length || 0} symbols with ${data.rows || 0} data points`)
      } else {
        setUploadStatus("error")
        setMessage(data.error || "Upload failed")
      }
    } catch (error) {
      setUploadStatus("error")
      setMessage("Network error during upload")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Historical Data</CardTitle>
          <CardDescription>
            Upload CSV file with historical equity prices. Required columns: date, symbol, close
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select CSV File</Label>
            <div className="flex gap-2">
              <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="flex-1" />
              <Button onClick={handleUpload} disabled={!file || uploading} className="gap-2">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{file.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</span>
            </div>
          )}

          {uploadStatus === "success" && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">{message}</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Format Requirements</CardTitle>
          <CardDescription>Ensure your CSV file follows this structure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm">
              <div className="text-muted-foreground">date,symbol,close</div>
              <div className="text-foreground">2023-01-01,AAPL,150.25</div>
              <div className="text-foreground">2023-01-01,MSFT,245.80</div>
              <div className="text-foreground">2023-01-02,AAPL,151.30</div>
              <div className="text-foreground">2023-01-02,MSFT,247.15</div>
            </div>

            <div className="space-y-2 text-sm">
              <h4 className="font-semibold text-foreground">Requirements:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Date format: YYYY-MM-DD</li>
                <li>• Minimum 2 years of daily data recommended</li>
                <li>• At least 2 symbols for pair analysis</li>
                <li>• Close prices should be adjusted for splits/dividends</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
