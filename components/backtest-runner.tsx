"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Play } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MonteCarloRunner from "@/components/monte-carlo-runner"

export default function BacktestRunner() {
  const [running, setRunning] = useState(false)
  const [config, setConfig] = useState({
    entry_threshold: 2.0,
    exit_threshold: 0.5,
    stop_loss: 3.0,
    position_size: 10000,
    transaction_cost: 0.001,
  })
  const [result, setResult] = useState<any>(null)

  const runBacktest = async () => {
    setRunning(true)
    try {
      const response = await fetch("/api/run-backtest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      const data = await response.json()
      if (response.ok) {
        setResult(data)
        localStorage.setItem("backtest_results", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Error running backtest:", error)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Backtest Configuration</CardTitle>
            <CardDescription>
              Configure z-score thresholds and position sizing for mean-reversion strategy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entry">Entry Threshold (z-score)</Label>
              <Input
                id="entry"
                type="number"
                step="0.1"
                value={config.entry_threshold}
                onChange={(e) => setConfig({ ...config, entry_threshold: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exit">Exit Threshold (z-score)</Label>
              <Input
                id="exit"
                type="number"
                step="0.1"
                value={config.exit_threshold}
                onChange={(e) => setConfig({ ...config, exit_threshold: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stop">Stop Loss (z-score)</Label>
              <Input
                id="stop"
                type="number"
                step="0.1"
                value={config.stop_loss}
                onChange={(e) => setConfig({ ...config, stop_loss: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position Size ($)</Label>
              <Input
                id="position"
                type="number"
                step="1000"
                value={config.position_size}
                onChange={(e) => setConfig({ ...config, position_size: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Transaction Cost (%)</Label>
              <Input
                id="cost"
                type="number"
                step="0.0001"
                value={config.transaction_cost}
                onChange={(e) => setConfig({ ...config, transaction_cost: Number.parseFloat(e.target.value) })}
              />
            </div>

            <Button onClick={runBacktest} disabled={running} className="w-full gap-2">
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Backtest...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Backtest
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Backtest Summary</CardTitle>
              <CardDescription>Performance metrics from walk-forward validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                  <div className="text-2xl font-bold text-foreground">{result.sharpe_ratio?.toFixed(2) || "N/A"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Return</div>
                  <div className="text-2xl font-bold text-foreground">
                    {result.total_return ? `${(result.total_return * 100).toFixed(2)}%` : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Max Drawdown</div>
                  <div className="text-2xl font-bold text-destructive">
                    {result.max_drawdown ? `${(result.max_drawdown * 100).toFixed(2)}%` : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                  <div className="text-2xl font-bold text-foreground">
                    {result.win_rate ? `${(result.win_rate * 100).toFixed(1)}%` : "N/A"}
                  </div>
                </div>
              </div>

              {result.sharpe_ratio >= 1.4 ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <AlertDescription className="text-green-500">
                    Strategy meets target Sharpe ratio ≥ 1.4
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-accent/50 bg-accent/10">
                  <AlertDescription className="text-accent-foreground">
                    Strategy Sharpe ratio below target of 1.4
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <MonteCarloRunner />
    </div>
  )
}
