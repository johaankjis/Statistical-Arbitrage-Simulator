import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataUpload from "@/components/data-upload"
import PairSelection from "@/components/pair-selection"
import BacktestRunner from "@/components/backtest-runner"
import PerformanceDashboard from "@/components/performance-dashboard"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <span className="font-mono text-sm font-bold text-primary-foreground">SA</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Statistical Arbitrage Platform</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Backtesting & Risk Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground text-balance">Pairs Trading Strategy Simulator</h2>
          <p className="mt-2 text-muted-foreground text-pretty">
            Identify cointegrated equity pairs, backtest mean-reversion strategies, and evaluate risk-adjusted returns
            with Monte Carlo stress testing.
          </p>
        </div>

        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="data">Data Upload</TabsTrigger>
            <TabsTrigger value="pairs">Pair Selection</TabsTrigger>
            <TabsTrigger value="backtest">Backtest</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            <DataUpload />
          </TabsContent>

          <TabsContent value="pairs" className="space-y-6">
            <PairSelection />
          </TabsContent>

          <TabsContent value="backtest" className="space-y-6">
            <BacktestRunner />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <PerformanceDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
