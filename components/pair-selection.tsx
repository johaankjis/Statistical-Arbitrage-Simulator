"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, TrendingUp } from "lucide-react"

interface PairResult {
  symbol1: string
  symbol2: string
  cointegration_pvalue: number
  correlation: number
  half_life: number
}

export default function PairSelection() {
  const [analyzing, setAnalyzing] = useState(false)
  const [pairs, setPairs] = useState<PairResult[]>([])

  const runCointegrationTest = async () => {
    setAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-pairs", {
        method: "POST",
      })
      const data = await response.json()
      if (response.ok) {
        setPairs(data.pairs || [])
      }
    } catch (error) {
      console.error("Error analyzing pairs:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cointegration Analysis</CardTitle>
          <CardDescription>Identify statistically cointegrated equity pairs using Engle-Granger test</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runCointegrationTest} disabled={analyzing} className="gap-2">
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Pairs...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Run Cointegration Test
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {pairs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cointegrated Pairs</CardTitle>
            <CardDescription>Pairs with p-value {"<"} 0.05 are considered cointegrated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-foreground">{pair.symbol1}</span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-mono font-semibold text-foreground">{pair.symbol2}</span>
                    </div>
                    <Badge variant={pair.cointegration_pvalue < 0.05 ? "default" : "secondary"}>
                      p-value: {pair.cointegration_pvalue.toFixed(4)}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Correlation: </span>
                      <span className="font-medium text-foreground">{pair.correlation.toFixed(3)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Half-life: </span>
                      <span className="font-medium text-foreground">{pair.half_life.toFixed(1)} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
