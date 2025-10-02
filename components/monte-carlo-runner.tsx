"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Zap } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MonteCarloResult {
  n_scenarios: number
  sharpe_ratio: {
    mean: number
    median: number
    std: number
    percentile_5: number
    percentile_95: number
    distribution: number[]
  }
  total_return: {
    mean: number
    median: number
    std: number
    percentile_5: number
    percentile_95: number
  }
  max_drawdown: {
    mean: number
    median: number
    worst: number
    percentile_5: number
    percentile_95: number
    distribution: number[]
  }
  stress_resilience: {
    scenarios_above_target_sharpe: number
    scenarios_below_20pct_drawdown: number
    probability_positive_return: number
  }
}

export default function MonteCarloRunner() {
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<MonteCarloResult | null>(null)

  const runSimulation = async () => {
    setRunning(true)
    try {
      const config = {
        entry_threshold: 2.0,
        exit_threshold: 0.5,
        stop_loss: 3.0,
        position_size: 10000,
        transaction_cost: 0.001,
      }

      const response = await fetch("/api/run-monte-carlo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const data = await response.json()
      if (response.ok) {
        setResult(data)
        localStorage.setItem("monte_carlo_results", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Monte Carlo error:", error)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monte Carlo Stress Testing</CardTitle>
          <CardDescription>
            Run 500+ randomized market scenarios to evaluate strategy robustness under tail events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runSimulation} disabled={running} className="gap-2">
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Run Monte Carlo (500 scenarios)
              </>
            )}
          </Button>
          {running && (
            <div className="mt-4 space-y-2">
              <Progress value={33} className="h-2" />
              <p className="text-sm text-muted-foreground">This may take 1-2 minutes...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Stress Test Results</CardTitle>
              <CardDescription>Performance distribution across {result.n_scenarios} scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 rounded-lg border border-border bg-card p-4">
                  <div className="text-sm text-muted-foreground">Mean Sharpe Ratio</div>
                  <div className="text-2xl font-bold text-foreground">{result.sharpe_ratio.mean.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    5th-95th: {result.sharpe_ratio.percentile_5.toFixed(2)} to{" "}
                    {result.sharpe_ratio.percentile_95.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-border bg-card p-4">
                  <div className="text-sm text-muted-foreground">Mean Return</div>
                  <div className="text-2xl font-bold text-foreground">
                    {(result.total_return.mean * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    5th-95th: {(result.total_return.percentile_5 * 100).toFixed(1)}% to{" "}
                    {(result.total_return.percentile_95 * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-border bg-card p-4">
                  <div className="text-sm text-muted-foreground">Worst Drawdown</div>
                  <div className="text-2xl font-bold text-destructive">
                    {(result.max_drawdown.worst * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Median: {(result.max_drawdown.median * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Stress Resilience Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <span className="text-sm text-foreground">Scenarios achieving Sharpe ≥ 1.4</span>
                    <span className="font-semibold text-foreground">
                      {result.stress_resilience.scenarios_above_target_sharpe} / {result.n_scenarios} (
                      {((result.stress_resilience.scenarios_above_target_sharpe / result.n_scenarios) * 100).toFixed(1)}
                      %)
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <span className="text-sm text-foreground">Scenarios with drawdown ≤ 20%</span>
                    <span className="font-semibold text-foreground">
                      {result.stress_resilience.scenarios_below_20pct_drawdown} / {result.n_scenarios} (
                      {((result.stress_resilience.scenarios_below_20pct_drawdown / result.n_scenarios) * 100).toFixed(
                        1,
                      )}
                      %)
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3">
                    <span className="text-sm text-foreground">Probability of positive return</span>
                    <span className="font-semibold text-foreground">
                      {(result.stress_resilience.probability_positive_return * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {result.stress_resilience.scenarios_below_20pct_drawdown / result.n_scenarios >= 0.8 ? (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <AlertDescription className="text-green-500">
                    Strategy demonstrates strong resilience: {">"}80% of scenarios maintain drawdown below 20%
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-accent/50 bg-accent/10">
                  <AlertDescription className="text-accent-foreground">
                    Strategy shows moderate stress resilience. Consider adjusting risk parameters.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
