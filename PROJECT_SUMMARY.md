# Statistical Arbitrage Simulator - Project Summary

## Overview

The Statistical Arbitrage Simulator is a web-based platform for pairs trading strategy development and backtesting. It provides a comprehensive toolkit for identifying cointegrated equity pairs, testing mean-reversion strategies, and evaluating risk-adjusted returns through Monte Carlo stress testing.

## Purpose

This platform enables quantitative traders and analysts to:
- Identify statistically cointegrated equity pairs using the Engle-Granger test
- Backtest pairs trading strategies with configurable parameters
- Evaluate strategy robustness under various market scenarios
- Analyze risk-adjusted performance metrics
- Stress test strategies using Monte Carlo simulation

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.16 (React 18)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives with custom components
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Python Engine**: Python 3 for quantitative analysis
- **Data Processing**: pandas, numpy
- **Statistical Analysis**: statsmodels, scipy, scikit-learn

### Key Dependencies
- **@radix-ui/react-***: Accessible UI component primitives
- **recharts**: Charting library for performance visualization
- **pandas**: Data manipulation and analysis (Python)
- **numpy**: Numerical computing (Python)
- **statsmodels**: Statistical modeling and cointegration testing (Python)
- **scipy**: Scientific computing and statistics (Python)
- **scikit-learn**: Machine learning utilities (Python)

## Architecture

### Application Structure

```
Statistical-Arbitrage-Simulator/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── analyze-pairs/        # Cointegration analysis endpoint
│   │   ├── run-backtest/         # Backtest execution endpoint
│   │   ├── run-monte-carlo/      # Monte Carlo simulation endpoint
│   │   └── upload-data/          # Data upload endpoint
│   └── page.tsx                  # Main application page
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── data-upload.tsx           # CSV data upload interface
│   ├── pair-selection.tsx        # Cointegration analysis UI
│   ├── backtest-runner.tsx       # Backtest configuration & execution
│   ├── monte-carlo-runner.tsx    # Monte Carlo simulation UI
│   └── performance-dashboard.tsx # Results visualization
├── scripts/                      # Python analysis scripts
│   ├── cointegration_test.py     # Pair analysis logic
│   ├── backtest_engine.py        # Trading strategy backtest
│   └── monte_carlo_simulation.py # Stress testing engine
├── data/                         # Data storage directory
│   ├── market_data.csv           # Uploaded market data
│   └── backtest_config.json      # Backtest parameters
├── lib/                          # Utility functions
├── hooks/                        # Custom React hooks
├── styles/                       # Global styles
└── public/                       # Static assets
```

## Core Features

### 1. Data Upload
**Component**: `data-upload.tsx`

- **CSV Format**: Accepts market data in CSV format
- **Required Columns**: date, symbol, close
- **Format Requirements**:
  - Date format: YYYY-MM-DD
  - Minimum 2 years of daily data recommended
  - At least 2 symbols for pair analysis
  - Close prices should be adjusted for splits/dividends
- **Example Format**:
  ```csv
  date,symbol,close
  2023-01-01,AAPL,150.25
  2023-01-01,MSFT,245.80
  2023-01-02,AAPL,151.30
  2023-01-02,MSFT,247.15
  ```

### 2. Pair Selection & Cointegration Analysis
**Component**: `pair-selection.tsx`  
**Script**: `cointegration_test.py`

#### Methodology
- **Statistical Test**: Engle-Granger cointegration test
- **Analysis**: Evaluates all possible pair combinations from uploaded symbols
- **Filtering**: Returns pairs with p-value < 0.05 (95% confidence level)

#### Metrics Calculated
- **Cointegration P-value**: Statistical significance of the cointegrated relationship
- **Correlation**: Linear correlation between price series
- **Half-life**: Mean reversion speed (in days)
  - Calculated using Ornstein-Uhlenbeck process
  - Formula: half_life = -ln(2) / λ where λ is mean reversion speed

#### Output
- Top 10 most cointegrated pairs ranked by p-value
- Visual badges indicating statistical significance levels

### 3. Backtest Engine
**Component**: `backtest-runner.tsx`  
**Script**: `backtest_engine.py`

#### Strategy: Z-Score Mean Reversion
The platform implements a classic pairs trading strategy based on spread z-score:

**Trading Signals**:
- **Entry Long**: When z-score < -entry_threshold (spread oversold)
- **Entry Short**: When z-score > entry_threshold (spread overbought)
- **Exit**: When z-score crosses exit_threshold
- **Stop Loss**: When z-score exceeds stop_loss threshold

**Z-Score Calculation**:
```python
z-score = (spread - rolling_mean) / rolling_std
spread = price_symbol1 - price_symbol2
rolling_window = 20 days
```

#### Configurable Parameters
- **Entry Threshold** (default: 2.0): Z-score level to enter position
- **Exit Threshold** (default: 0.5): Z-score level to exit position
- **Stop Loss** (default: 3.0): Z-score level to force exit
- **Position Size** (default: $10,000): Capital allocated per trade
- **Transaction Cost** (default: 0.1%): Trading costs and slippage

#### Performance Metrics
- **Sharpe Ratio**: Risk-adjusted return measure
  - Formula: (mean_return / std_return) × √252
  - Target: ≥ 1.4
- **Total Return**: Cumulative percentage return
- **Maximum Drawdown**: Largest peak-to-trough decline
- **Win Rate**: Percentage of profitable trades
- **Number of Trades**: Total completed round-trip trades
- **Final Equity**: Ending portfolio value

#### Validation Method
- Walk-forward validation ensures out-of-sample testing
- Rolling window for z-score calculation prevents look-ahead bias

### 4. Monte Carlo Stress Testing
**Component**: `monte-carlo-runner.tsx`  
**Script**: `monte_carlo_simulation.py`

#### Purpose
Evaluate strategy robustness under various market conditions including:
- Different volatility regimes
- Market stress events
- Tail risk scenarios
- Random market shocks

#### Methodology

**Scenario Generation** (500 scenarios):
1. **Block Bootstrap** (250 scenarios):
   - Preserves autocorrelation structure
   - Resamples historical returns in 20-day blocks
   - Maintains realistic time-series properties

2. **Volatility Regime Simulation** (250 scenarios):
   - Simulates varying volatility environments
   - Volatility multipliers: 0.5x to 3.0x base volatility
   - 20% probability of extreme volatility spikes
   - Spike magnitude: 3-5 standard deviations

**Strategy Execution**:
- Runs the same mean-reversion strategy on each scenario
- Uses identical parameters as main backtest
- Calculates full performance metrics for each scenario

#### Output Metrics

**Sharpe Ratio Distribution**:
- Mean, median, standard deviation
- 5th and 95th percentiles
- Full distribution for histogram visualization

**Total Return Statistics**:
- Mean expected return
- Return dispersion (std)
- Confidence intervals (5th-95th percentile)

**Maximum Drawdown Analysis**:
- Mean drawdown
- Worst-case drawdown
- Probability of moderate drawdowns

**Stress Resilience Indicators**:
- **Scenarios Above Target Sharpe**: Count of scenarios with Sharpe ≥ 1.4
- **Scenarios Below 20% Drawdown**: Count of scenarios with max_dd ≥ -20%
- **Probability of Positive Return**: Percentage of profitable scenarios

#### Resilience Classification
- **Strong Resilience**: >80% of scenarios maintain drawdown below 20%
- **Moderate Resilience**: Other scenarios requiring parameter adjustment

### 5. Performance Dashboard
**Component**: `performance-dashboard.tsx`

#### Visualization Types

**Equity Curve**:
- Line chart showing cumulative portfolio value over time
- Reference line at initial capital
- Displays growth trajectory

**Drawdown Chart**:
- Area chart showing underwater periods
- Highlights maximum drawdown events
- Red-shaded areas indicate losses

**Monte Carlo Distributions**:
- **Sharpe Ratio Distribution**: Histogram showing outcome frequency
- **Drawdown Distribution**: Bar chart of drawdown scenarios
- Interactive tooltips for detailed statistics

**Metrics Dashboard**:
- **Return Metrics**: Total return, Sharpe ratio, win rate
- **Risk Metrics**: Max drawdown, volatility, downside deviation
- **Trade Statistics**: Number of trades, average trade duration
- **Stress Test Results**: Resilience indicators, scenario statistics

#### Tabs Organization
1. **Overview**: Key metrics and equity curve
2. **Monte Carlo**: Distribution charts and stress test results
3. **Metrics**: Detailed performance breakdown

## Data Flow

### 1. Data Upload Flow
```
User → Upload CSV → /api/upload-data → Save to data/market_data.csv → Confirmation
```

### 2. Pair Analysis Flow
```
User → Click "Run Cointegration Test" → /api/analyze-pairs 
→ Execute cointegration_test.py → Return top 10 pairs → Display results
```

### 3. Backtest Flow
```
User → Configure parameters → Click "Run Backtest" → /api/run-backtest
→ Save config to data/backtest_config.json → Execute backtest_engine.py
→ Calculate metrics → Return results → Display summary + Update localStorage
```

### 4. Monte Carlo Flow
```
User → Click "Run Monte Carlo" → /api/run-monte-carlo
→ Generate 500 scenarios → Run strategy on each → Aggregate statistics
→ Return distributions → Display charts + Update localStorage
```

### 5. Results Persistence
- Backtest results stored in localStorage as 'backtest_results'
- Monte Carlo results stored in localStorage as 'monte_carlo_results'
- Performance dashboard loads from localStorage on mount

## API Endpoints

### POST /api/upload-data
- **Purpose**: Upload market data CSV
- **Input**: FormData with CSV file
- **Process**: Validates format, saves to data/market_data.csv
- **Output**: Success/error message

### POST /api/analyze-pairs
- **Purpose**: Find cointegrated pairs
- **Input**: None (reads from data/market_data.csv)
- **Process**: Executes cointegration_test.py
- **Output**: Array of pair results with metrics

### POST /api/run-backtest
- **Purpose**: Execute strategy backtest
- **Input**: Configuration object
  ```json
  {
    "entry_threshold": 2.0,
    "exit_threshold": 0.5,
    "stop_loss": 3.0,
    "position_size": 10000,
    "transaction_cost": 0.001
  }
  ```
- **Process**: Saves config, executes backtest_engine.py
- **Output**: Performance metrics object

### POST /api/run-monte-carlo
- **Purpose**: Run stress testing simulation
- **Input**: Configuration object (same as backtest)
- **Process**: Executes monte_carlo_simulation.py with 500 scenarios
- **Output**: Aggregated statistics and distributions

## User Interface

### Design System
- **Theme**: Dark mode support with light mode fallback
- **Colors**: CSS custom properties for theming
- **Typography**: System font stack with Geist font
- **Components**: Consistent Radix UI-based component library
- **Layout**: Responsive grid system with mobile support

### Navigation Structure
Main page with 4 tabs:
1. **Data Upload**: CSV file upload interface
2. **Pair Selection**: Cointegration analysis
3. **Backtest**: Strategy configuration and execution
4. **Results**: Performance visualization

### User Workflow
1. Upload market data CSV
2. Run cointegration analysis to find suitable pairs
3. Configure backtest parameters
4. Run backtest to see historical performance
5. Run Monte Carlo simulation for stress testing
6. Review results in performance dashboard

## Key Algorithms

### 1. Cointegration Test (Engle-Granger)
```python
# Two-step process:
1. Run OLS regression: y = α + βx + ε
2. Test residuals for unit root using ADF test
3. If residuals are stationary → series are cointegrated
```

### 2. Half-Life Calculation
```python
# Ornstein-Uhlenbeck process
spread_diff = spread[t] - spread[t-1]
regression: spread_diff = λ × spread[t-1] + noise
half_life = -ln(2) / λ
```

### 3. Z-Score Trading Strategy
```python
# Rolling z-score calculation
for each day t:
    window = prices[t-20:t]
    mean = average(window)
    std = std_dev(window)
    z_score[t] = (price[t] - mean) / std
    
    if z_score > +threshold: SHORT
    if z_score < -threshold: LONG
    if abs(z_score) < exit_threshold: EXIT
```

### 4. Performance Metrics

**Sharpe Ratio**:
```python
returns = equity.pct_change()
sharpe = (mean(returns) / std(returns)) × √252
```

**Maximum Drawdown**:
```python
cummax = running_maximum(equity)
drawdown = (equity - cummax) / cummax
max_drawdown = minimum(drawdown)
```

**Win Rate**:
```python
win_rate = profitable_trades / total_trades
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.8+
- Git

### Installation Steps

1. **Clone Repository**:
   ```bash
   git clone https://github.com/johaankjis/Statistical-Arbitrage-Simulator.git
   cd Statistical-Arbitrage-Simulator
   ```

2. **Install Node Dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Install Python Dependencies**:
   ```bash
   pip install pandas numpy statsmodels scipy scikit-learn
   ```

4. **Create Data Directory**:
   ```bash
   mkdir -p data
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

6. **Access Application**:
   Open [http://localhost:3000](http://localhost:3000)

## Usage Guide

### Step 1: Prepare Your Data
Create a CSV file with the following format:
```csv
date,symbol,close
2023-01-01,AAPL,150.25
2023-01-01,MSFT,245.80
```

**Requirements**:
- At least 2 symbols
- Minimum 2 years of daily data
- Adjusted close prices

### Step 2: Upload Data
1. Navigate to "Data Upload" tab
2. Click "Choose File" or drag-and-drop your CSV
3. Click "Upload Data"
4. Wait for confirmation message

### Step 3: Find Cointegrated Pairs
1. Navigate to "Pair Selection" tab
2. Click "Run Cointegration Test"
3. Review the results showing:
   - Symbol pairs
   - P-values (lower is better)
   - Correlation coefficients
   - Mean reversion half-life

### Step 4: Run Backtest
1. Navigate to "Backtest" tab
2. Configure parameters:
   - **Entry Threshold**: 2.0 (standard 2-sigma entry)
   - **Exit Threshold**: 0.5 (exit when spread normalizes)
   - **Stop Loss**: 3.0 (risk management)
   - **Position Size**: $10,000 per trade
   - **Transaction Cost**: 0.1% (adjust for your broker)
3. Click "Run Backtest"
4. Review performance metrics:
   - Target: Sharpe Ratio ≥ 1.4
   - Monitor drawdown levels
   - Check win rate and trade count

### Step 5: Stress Test Strategy
1. Scroll down in "Backtest" tab
2. Click "Run Monte Carlo (500 scenarios)"
3. Wait 1-2 minutes for simulation
4. Review stress resilience:
   - Mean Sharpe ratio across scenarios
   - Worst-case drawdown
   - Probability distributions

### Step 6: Analyze Results
1. Navigate to "Results" tab
2. Review visualizations:
   - Equity curve progression
   - Drawdown underwater chart
   - Monte Carlo distributions
3. Export or screenshot important metrics

## Best Practices

### Data Quality
- Use adjusted close prices (split/dividend adjusted)
- Ensure data continuity (no large gaps)
- Include sufficient history (2+ years recommended)
- Verify data accuracy before uploading

### Parameter Selection
- **Entry Threshold**: 2.0 is standard (2-sigma); higher values reduce trade frequency
- **Exit Threshold**: 0.5 provides balance between profit capture and mean reversion
- **Stop Loss**: 3.0 limits tail risk; adjust based on your risk tolerance
- **Position Size**: Start conservative; scale up after validation
- **Transaction Costs**: Be realistic; include slippage and commissions

### Risk Management
- Target Sharpe ratio ≥ 1.4 for viable strategies
- Limit maximum drawdown to acceptable levels (10-20%)
- Diversify across multiple pairs
- Monitor half-life: shorter is generally better (5-20 days ideal)
- Require strong cointegration: p-value < 0.05 minimum

### Strategy Validation
- Run Monte Carlo to understand tail risk
- Check that >80% of scenarios avoid severe drawdowns
- Verify positive returns in majority of scenarios
- Test sensitivity to parameter changes
- Consider walk-forward optimization

## Limitations & Considerations

### Technical Limitations
- **Single Pair Focus**: Current implementation tests one pair at a time
- **No Real-time Data**: Requires CSV upload; no live data feeds
- **Simplified Execution**: Assumes perfect fills at mid-price
- **No Overnight Risk**: Doesn't model gap risk or holding costs
- **Limited Universe**: Manual data upload limits scalability

### Statistical Considerations
- **In-sample Bias**: Cointegration may not persist out-of-sample
- **Regime Changes**: Market relationships can break down
- **Non-stationarity**: Assumption of mean reversion may fail
- **Transaction Costs**: Real costs often higher than estimates
- **Slippage**: Market impact not fully modeled

### Practical Considerations
- Past performance doesn't guarantee future results
- Market conditions change; strategies require monitoring
- Cointegration relationships can break temporarily or permanently
- Regulatory and margin requirements not considered
- Tax implications not included in returns

## Future Enhancements

### Potential Features
- **Live Data Integration**: Connect to market data APIs
- **Multi-pair Portfolio**: Simultaneous testing of multiple pairs
- **Advanced Risk Models**: VaR, CVaR, tail risk metrics
- **Machine Learning**: ML-based pair selection and parameter optimization
- **Real-time Monitoring**: Live strategy performance tracking
- **Alert System**: Notifications for trade signals or risk events
- **Export Functionality**: Download results as PDF/Excel
- **Historical Comparison**: Track strategy evolution over time
- **Optimization Engine**: Grid search for optimal parameters
- **Backtesting on Multiple Timeframes**: Intraday, weekly, monthly

### Technical Improvements
- **Database Integration**: PostgreSQL/MongoDB for data persistence
- **Caching Layer**: Redis for faster computation
- **Microservices**: Separate Python backend service
- **WebSocket Support**: Real-time updates during long simulations
- **Progress Tracking**: Detailed progress bars for Monte Carlo
- **Error Handling**: More robust error messages and recovery
- **Testing**: Unit and integration tests
- **Documentation**: API documentation with examples

## Performance Characteristics

### Computational Complexity
- **Cointegration Test**: O(n² × m) where n = symbols, m = time points
- **Backtest**: O(m) where m = time points
- **Monte Carlo**: O(s × m) where s = scenarios, m = time points

### Typical Execution Times
- **Data Upload**: < 1 second for typical files
- **Cointegration Analysis**: 1-5 seconds for 5-10 symbols
- **Backtest**: 1-2 seconds
- **Monte Carlo (500 scenarios)**: 60-120 seconds

### Resource Requirements
- **Memory**: ~100-500 MB for typical datasets
- **Storage**: Minimal (CSV files typically < 10 MB)
- **CPU**: Single-threaded Python; could benefit from parallelization

## Security Considerations

### Data Privacy
- All data processing occurs server-side
- No data transmitted to external services
- CSV files stored locally on server
- Consider adding authentication for production use

### Input Validation
- CSV format validation on upload
- Parameter bounds checking for backtest config
- File size limits to prevent DoS
- Content-type verification

### Recommended for Production
- Add user authentication (NextAuth.js)
- Implement rate limiting
- Add input sanitization
- Use environment variables for configuration
- Enable HTTPS
- Add logging and monitoring
- Implement data retention policies

## Contributing

### Development Setup
```bash
# Install dependencies
npm install
pip install -r requirements.txt  # if requirements.txt exists

# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

### Code Structure Guidelines
- **Components**: Reusable React components in `components/`
- **API Routes**: Backend endpoints in `app/api/`
- **Scripts**: Python analysis scripts in `scripts/`
- **Types**: TypeScript interfaces for type safety
- **Styling**: Tailwind CSS with component-level styles

## License

Not specified in the repository. Consider adding a LICENSE file for clarity.

## Contact & Support

- **Repository**: https://github.com/johaankjis/Statistical-Arbitrage-Simulator
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Owner**: johaankjis

## Conclusion

The Statistical Arbitrage Simulator provides a comprehensive, end-to-end platform for pairs trading strategy development. It combines modern web technologies with robust quantitative finance methods to deliver an accessible yet powerful tool for statistical arbitrage analysis. Whether you're a quantitative researcher, student, or professional trader, this platform offers the essential capabilities needed to explore mean-reversion strategies with statistical rigor and risk awareness.

### Key Strengths
- ✅ Professional-grade statistical analysis
- ✅ Comprehensive risk evaluation via Monte Carlo
- ✅ User-friendly web interface
- ✅ Flexible parameter configuration
- ✅ Visual performance feedback
- ✅ Open-source and extensible

### Ideal Use Cases
- Academic research in quantitative finance
- Strategy prototype development
- Learning pairs trading concepts
- Risk assessment of mean-reversion strategies
- Portfolio diversification analysis
