import pandas as pd
import numpy as np
import json
import os
from scipy import stats

def resample_returns(returns, n_scenarios=500, block_size=20):
    """Resample returns using block bootstrap to preserve autocorrelation"""
    n_periods = len(returns)
    n_blocks = n_periods // block_size
    
    scenarios = []
    for _ in range(n_scenarios):
        sampled_blocks = []
        for _ in range(n_blocks):
            start_idx = np.random.randint(0, n_periods - block_size)
            sampled_blocks.append(returns[start_idx:start_idx + block_size])
        
        scenario = np.concatenate(sampled_blocks)[:n_periods]
        scenarios.append(scenario)
    
    return np.array(scenarios)

def simulate_volatility_regimes(base_vol, n_scenarios=500, n_periods=252):
    """Generate scenarios with different volatility regimes"""
    scenarios = []
    
    for _ in range(n_scenarios):
        vol_multiplier = np.random.lognormal(0, 0.5)
        vol_multiplier = np.clip(vol_multiplier, 0.5, 3.0)
        
        scenario_vol = base_vol * vol_multiplier
        scenario_returns = np.random.normal(0, scenario_vol, n_periods)
        
        if np.random.random() < 0.2:
            spike_idx = np.random.randint(0, n_periods)
            spike_magnitude = np.random.uniform(3, 5) * scenario_vol
            scenario_returns[spike_idx] = spike_magnitude * np.random.choice([-1, 1])
        
        scenarios.append(scenario_returns)
    
    return np.array(scenarios)

def run_strategy_on_scenario(returns, config):
    """Run trading strategy on a single return scenario"""
    spread = np.cumsum(returns)
    
    window = 20
    zscore = np.zeros_like(spread)
    for i in range(window, len(spread)):
        window_data = spread[i-window:i]
        zscore[i] = (spread[i] - np.mean(window_data)) / (np.std(window_data) + 1e-8)
    
    position = 0
    entry_price = 0
    equity = [config['position_size']]
    
    entry_threshold = config['entry_threshold']
    exit_threshold = config['exit_threshold']
    stop_loss = config['stop_loss']
    transaction_cost = config['transaction_cost']
    
    for i in range(window, len(zscore)):
        z = zscore[i]
        current_price = spread[i]
        
        if position == 0:
            if z > entry_threshold:
                position = -1
                entry_price = current_price
            elif z < -entry_threshold:
                position = 1
                entry_price = current_price
        
        elif position != 0:
            should_exit = False
            pnl = 0
            
            if position == 1:
                if z > -exit_threshold or z < -stop_loss:
                    should_exit = True
                    pnl = (current_price - entry_price) * (1 - transaction_cost)
            elif position == -1:
                if z < exit_threshold or z > stop_loss:
                    should_exit = True
                    pnl = (entry_price - current_price) * (1 - transaction_cost)
            
            if should_exit:
                equity.append(equity[-1] + pnl)
                position = 0
        
        if len(equity) == i - window + 1:
            equity.append(equity[-1])
    
    equity_series = np.array(equity)
    returns_series = np.diff(equity_series) / equity_series[:-1]
    
    sharpe = (np.mean(returns_series) / (np.std(returns_series) + 1e-8)) * np.sqrt(252)
    total_return = (equity_series[-1] - equity_series[0]) / equity_series[0]
    
    cummax = np.maximum.accumulate(equity_series)
    drawdown = (equity_series - cummax) / cummax
    max_dd = np.min(drawdown)
    
    return {
        'sharpe_ratio': float(sharpe),
        'total_return': float(total_return),
        'max_drawdown': float(max_dd),
        'final_equity': float(equity_series[-1])
    }

def run_monte_carlo_simulation(data_path, config_path, n_scenarios=500):
    """Run Monte Carlo simulation with multiple market scenarios"""
    try:
        df = pd.read_csv(data_path)
        df['date'] = pd.to_datetime(df['date'])
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        prices = df.pivot(index='date', columns='symbol', values='close')
        symbols = prices.columns.tolist()[:2]
        
        if len(symbols) < 2:
            return {'error': 'Need at least 2 symbols'}
        
        s1 = prices[symbols[0]].dropna()
        s2 = prices[symbols[1]].dropna()
        spread = s1 - s2
        spread_returns = spread.pct_change().dropna().values
        
        base_vol = np.std(spread_returns)
        
        print(f"Generating {n_scenarios} Monte Carlo scenarios...", flush=True)
        
        bootstrap_scenarios = resample_returns(spread_returns, n_scenarios // 2)
        
        vol_scenarios = simulate_volatility_regimes(base_vol, n_scenarios // 2, len(spread_returns))
        
        all_scenarios = np.vstack([bootstrap_scenarios, vol_scenarios])
        
        results = []
        for i, scenario in enumerate(all_scenarios):
            if i % 100 == 0:
                print(f"Processing scenario {i}/{n_scenarios}...", flush=True)
            
            result = run_strategy_on_scenario(scenario, config)
            results.append(result)
        
        sharpe_ratios = [r['sharpe_ratio'] for r in results]
        total_returns = [r['total_return'] for r in results]
        max_drawdowns = [r['max_drawdown'] for r in results]
        
        return {
            'n_scenarios': n_scenarios,
            'sharpe_ratio': {
                'mean': float(np.mean(sharpe_ratios)),
                'median': float(np.median(sharpe_ratios)),
                'std': float(np.std(sharpe_ratios)),
                'percentile_5': float(np.percentile(sharpe_ratios, 5)),
                'percentile_95': float(np.percentile(sharpe_ratios, 95)),
                'distribution': [float(x) for x in sharpe_ratios]
            },
            'total_return': {
                'mean': float(np.mean(total_returns)),
                'median': float(np.median(total_returns)),
                'std': float(np.std(total_returns)),
                'percentile_5': float(np.percentile(total_returns, 5)),
                'percentile_95': float(np.percentile(total_returns, 95))
            },
            'max_drawdown': {
                'mean': float(np.mean(max_drawdowns)),
                'median': float(np.median(max_drawdowns)),
                'worst': float(np.min(max_drawdowns)),
                'percentile_5': float(np.percentile(max_drawdowns, 5)),
                'percentile_95': float(np.percentile(max_drawdowns, 95)),
                'distribution': [float(x) for x in max_drawdowns]
            },
            'stress_resilience': {
                'scenarios_above_target_sharpe': int(sum(1 for s in sharpe_ratios if s >= 1.4)),
                'scenarios_below_20pct_drawdown': int(sum(1 for d in max_drawdowns if d >= -0.20)),
                'probability_positive_return': float(sum(1 for r in total_returns if r > 0) / len(total_returns))
            }
        }
        
    except Exception as e:
        import traceback
        return {'error': str(e), 'traceback': traceback.format_exc()}

if __name__ == '__main__':
    data_path = os.path.join(os.getcwd(), 'data', 'market_data.csv')
    config_path = os.path.join(os.getcwd(), 'data', 'backtest_config.json')
    result = run_monte_carlo_simulation(data_path, config_path, n_scenarios=500)
    print(json.dumps(result))
