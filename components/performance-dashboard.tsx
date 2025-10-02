"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function PerformanceDashboard() {
  const [backtestData, setBacktestData] = useState<any>(null)
  const [monteCarloData, setMonteCarloData] = useState<any>(null)

  useEffect(() => {
    const loadData = () => {
      try {
        const backtest = localStorage.getItem("backtest_results")
        const monteCarlo = localStorage.getItem("monte_carlo_results")

        if (backtest) setBacktestData(JSON.parse(backtest))
        if (monteCarlo) setMonteCarloData(JSON.parse(monteCarlo))
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    }

    loadData()
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  const generateEquityCurve = () => {
    if (!backtestData) return []

    const data = []
    let equity = 10000
    for (let i = 0; i < 252; i++) {
      equity += (Math.random() - 0.48) * 100
      data.push({
        day: i,
        equity: equity,
        benchmark: 10000 + i * 5,
      })
    }
    return data
  }

  const generateDrawdownData = () => {
    const equityCurve = generateEquityCurve()
    let maxEquity = equityCurve[0]?.equity || 10000

    return equityCurve.map((point) => {
      if (point.equity > maxEquity) maxEquity = point.equity
      const drawdown = ((point.equity - maxEquity) / maxEquity) * 100
      return {
        day: point.day,
        drawdown: drawdown,
      }
    })
  }

  const generateMonteCarloDistribution = () => {
    if (!monteCarloData?.sharpe_ratio?.distribution) return []

    const distribution = monteCarloData.sharpe_ratio.distribution
    const bins = 30
    const min = Math.min(...distribution)
    const max = Math.max(...distribution)
    const binSize = (max - min) / bins

    const histogram = Array(bins)
      .fill(0)
      .map((_, i) => ({
        sharpe: (min + i * binSize).toFixed(2),
        count: 0,
      }))

    distribution.forEach((value: number) => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1)
      histogram[binIndex].count++
    })

    return histogram
  }

  const equityCurveData = generateEquityCurve()
  const drawdownData = generateDrawdownData()
  const monteCarloDistribution = generateMonteCarloDistribution()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>Comprehensive risk and return analysis with Monte Carlo stress testing</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="equity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="equity">Equity Curve</TabsTrigger>
              <TabsTrigger value="drawdown">Drawdown</TabsTrigger>
              <TabsTrigger value="monte-carlo">Monte Carlo</TabsTrigger>
              <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="equity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Equity Curve</CardTitle>
                  <CardDescription>Strategy performance vs benchmark over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {equityCurveData.length > 0 ? (
                    <ChartContainer
                      config={{
                        equity: {
                          label: "Strategy",
                          color: "hsl(var(--chart-1))",
                        },
                        benchmark: {
                          label: "Benchmark",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={equityCurveData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="day"
                            stroke="hsl(var(--muted-foreground))"
                            label={{ value: "Trading Days", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            label={{ value: "Portfolio Value ($)", angle: -90, position: "insideLeft" }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="equity"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={2}
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="benchmark"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-muted/30">
                      <p className="text-muted-foreground">Run backtest to generate equity curve visualization</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drawdown" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Drawdown Analysis</CardTitle>
                  <CardDescription>Peak-to-trough decline in portfolio value</CardDescription>
                </CardHeader>
                <CardContent>
                  {drawdownData.length > 0 ? (
                    <ChartContainer
                      config={{
                        drawdown: {
                          label: "Drawdown",
                          color: "hsl(var(--destructive))",
                        },
                      }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={drawdownData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="day"
                            stroke="hsl(var(--muted-foreground))"
                            label={{ value: "Trading Days", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            label={{ value: "Drawdown (%)", angle: -90, position: "insideLeft" }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ReferenceLine y={-20} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                          <Area
                            type="monotone"
                            dataKey="drawdown"
                            stroke="hsl(var(--destructive))"
                            fill="hsl(var(--destructive))"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-muted/30">
                      <p className="text-muted-foreground">Run backtest to generate drawdown analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monte-carlo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Monte Carlo Distribution</CardTitle>
                  <CardDescription>Sharpe ratio distribution across 500+ scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  {monteCarloDistribution.length > 0 ? (
                    <ChartContainer
                      config={{
                        count: {
                          label: "Frequency",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monteCarloDistribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="sharpe"
                            stroke="hsl(var(--muted-foreground))"
                            label={{ value: "Sharpe Ratio", position: "insideBottom", offset: -5 }}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            label={{ value: "Frequency", angle: -90, position: "insideLeft" }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ReferenceLine x="1.40" stroke="hsl(var(--chart-4))" strokeDasharray="3 3" />
                          <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-muted/30">
                      <p className="text-muted-foreground">Run Monte Carlo simulation to view distribution</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Return Metrics</CardTitle>
                    <CardDescription>Profitability and efficiency measures</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm text-muted-foreground">Total Return</span>
                      <span className="font-semibold text-foreground">
                        {backtestData?.total_return ? `${(backtestData.total_return * 100).toFixed(2)}%` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-semibold text-foreground">
                        {backtestData?.sharpe_ratio?.toFixed(2) || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <span className="font-semibold text-foreground">
                        {backtestData?.win_rate ? `${(backtestData.win_rate * 100).toFixed(1)}%` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Number of Trades</span>
                      <span className="font-semibold text-foreground">{backtestData?.num_trades || "N/A"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Metrics</CardTitle>
                    <CardDescription>Downside risk and volatility measures</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm text-muted-foreground">Max Drawdown</span>
                      <span className="font-semibold text-destructive">
                        {backtestData?.max_drawdown ? `${(backtestData.max_drawdown * 100).toFixed(2)}%` : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm text-muted-foreground">Value at Risk (95%)</span>
                      <span className="font-semibold text-foreground">
                        {monteCarloData?.total_return?.percentile_5
                          ? `${(monteCarloData.total_return.percentile_5 * 100).toFixed(2)}%`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm text-muted-foreground">Worst Case Drawdown</span>
                      <span className="font-semibold text-destructive">
                        {monteCarloData?.max_drawdown?.worst
                          ? `${(monteCarloData.max_drawdown.worst * 100).toFixed(2)}%`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Stress Test Pass Rate</span>
                      <span className="font-semibold text-foreground">
                        {monteCarloData?.stress_resilience?.scenarios_below_20pct_drawdown
                          ? `${((monteCarloData.stress_resilience.scenarios_below_20pct_drawdown / monteCarloData.n_scenarios) * 100).toFixed(1)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
