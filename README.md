# Statistical Arbitrage Simulator

A comprehensive web-based platform for pairs trading strategy development, backtesting, and risk analysis. Built with Next.js and Python for quantitative finance professionals and algorithmic traders.

![Platform](https://img.shields.io/badge/Platform-Next.js%2014-black?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

- 📊 **Cointegration Analysis**: Identify statistically significant pairs using Engle-Granger methodology
- 🔄 **Mean-Reversion Backtesting**: Test z-score based pairs trading strategies on historical data
- 🎲 **Monte Carlo Stress Testing**: Evaluate strategy robustness across 500+ market scenarios
- 📈 **Performance Visualization**: Interactive charts showing equity curves, drawdowns, and distributions
- ⚡ **Real-time Metrics**: Comprehensive risk-adjusted performance indicators
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/Statistical-Arbitrage-Simulator.git
   cd Statistical-Arbitrage-Simulator
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create data directory**
   ```bash
   mkdir -p data
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 1. Prepare Your Data

Create a CSV file with historical price data:

```csv
date,symbol,close
2023-01-01,AAPL,150.25
2023-01-01,MSFT,245.80
2023-01-02,AAPL,151.30
2023-01-02,MSFT,247.15
```

**Requirements:**
- Date format: YYYY-MM-DD
- Minimum 2 years of daily data recommended
- At least 2 symbols for pair analysis
- Adjusted close prices (split/dividend adjusted)

### 2. Upload Data

Navigate to the **Data Upload** tab and upload your CSV file.

### 3. Find Cointegrated Pairs

Go to **Pair Selection** tab and run the cointegration test. The system will:
- Test all possible pair combinations
- Calculate p-values, correlations, and half-life metrics
- Return the top 10 most statistically significant pairs

### 4. Run Backtest

In the **Backtest** tab:
- Configure strategy parameters (entry/exit thresholds, stop loss, position size)
- Run the backtest on your selected pair
- Review performance metrics (Sharpe ratio, total return, max drawdown, win rate)

### 5. Stress Test

Scroll down and run Monte Carlo simulation:
- Generates 500 market scenarios
- Tests strategy resilience under various conditions
- Provides distribution analysis of key metrics

### 6. Analyze Results

View comprehensive visualizations in the **Results** tab:
- Equity curve progression
- Drawdown analysis
- Monte Carlo distributions
- Detailed performance metrics

## 🏗️ Architecture

```
Statistical-Arbitrage-Simulator/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── analyze-pairs/        # Cointegration analysis
│   │   ├── run-backtest/         # Backtest execution
│   │   ├── run-monte-carlo/      # Monte Carlo simulation
│   │   └── upload-data/          # Data upload
│   └── page.tsx                  # Main application page
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── data-upload.tsx           # CSV upload interface
│   ├── pair-selection.tsx        # Cointegration analysis UI
│   ├── backtest-runner.tsx       # Backtest configuration
│   ├── monte-carlo-runner.tsx    # Monte Carlo simulation UI
│   └── performance-dashboard.tsx # Results visualization
├── scripts/                      # Python analysis scripts
│   ├── cointegration_test.py     # Pair analysis logic
│   ├── backtest_engine.py        # Trading strategy backtest
│   └── monte_carlo_simulation.py # Stress testing engine
├── lib/                          # Utility functions
├── hooks/                        # Custom React hooks
└── public/                       # Static assets
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Python**: Python 3.8+ for quantitative analysis
- **Data Processing**: pandas, numpy
- **Statistical Analysis**: statsmodels, scipy, scikit-learn

## 📊 Key Algorithms

### Cointegration Test (Engle-Granger)
Uses a two-step process to identify pairs with stable long-term relationships:
1. Run OLS regression to find hedge ratio
2. Test residuals for stationarity using Augmented Dickey-Fuller test

### Z-Score Mean Reversion Strategy
Trades based on normalized spread deviations:
- **Entry**: When z-score exceeds ±2.0 standard deviations
- **Exit**: When z-score returns to ±0.5
- **Stop Loss**: Triggered at ±3.0 to limit tail risk

### Monte Carlo Simulation
Stress tests strategy using:
- **Block Bootstrap**: Preserves autocorrelation structure (250 scenarios)
- **Volatility Regimes**: Simulates varying market conditions (250 scenarios)
- Calculates full distribution of performance metrics

## 📈 Performance Metrics

- **Sharpe Ratio**: Risk-adjusted return (target: ≥1.4)
- **Total Return**: Cumulative percentage return
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Win Rate**: Percentage of profitable trades
- **Half-Life**: Mean reversion speed in days

## ⚠️ Limitations

- Single pair testing at a time
- No real-time data feeds
- Assumes perfect fills at mid-price
- Transaction costs are estimated
- Past performance doesn't guarantee future results

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Install dependencies
npm install
pip install -r requirements.txt

# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Documentation

- [Project Summary](PROJECT_SUMMARY.md) - Comprehensive technical documentation
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/johaankjis/Statistical-Arbitrage-Simulator/issues)
- **Feature Requests**: [GitHub Issues](https://github.com/johaankjis/Statistical-Arbitrage-Simulator/issues)
- **Repository**: [GitHub](https://github.com/johaankjis/Statistical-Arbitrage-Simulator)

## 🙏 Acknowledgments

Built with modern web technologies and quantitative finance best practices.

---

**Disclaimer**: This software is for educational and research purposes only. Always conduct thorough due diligence before deploying any trading strategy with real capital.
