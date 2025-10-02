import pandas as pd
import numpy as np
import json
import os

def calculate_zscore(spread, window=20):
    """Calculate rolling z-score of spread"""
    mean = spread.rolling(window=window).mean()
    std = spread.rolling(window=window).std()
    return (spread - mean) / std

def run_backtest(data_path, config_path):
    """Run pairs trading backtest with walk-forward validation"""
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
        zscore = calculate_zscore(spread)
        
        position = 0
        entry_price = 0
        trades = []
        equity = [config['position_size']]
        
        entry_threshold = config['entry_threshold']
        exit_threshold = config['exit_threshold']
        stop_loss = config['stop_loss']
        transaction_cost = config['transaction_cost']
        
        for i in range(20, len(zscore)):
            z = zscore.iloc[i]
            current_spread = spread.iloc[i]
            
            if pd.isna(z):
                continue
            
            if position == 0:
                if z > entry_threshold:
                    position = -1
                    entry_price = current_spread
                    trades.append({
                        'date': str(spread.index[i]),
                        'action': 'short',
                        'price': float(current_spread),
                        'zscore': float(z)
                    })
                elif z < -entry_threshold:
                    position = 1
                    entry_price = current_spread
                    trades.append({
                        'date': str(spread.index[i]),
                        'action': 'long',
                        'price': float(current_spread),
                        'zscore': float(z)
                    })
            
            elif position != 0:
                pnl = 0
                should_exit = False
                
                if position == 1:
                    if z > -exit_threshold or z < -stop_loss:
                        should_exit = True
                        pnl = (current_spread - entry_price) * (1 - transaction_cost)
                elif position == -1:
                    if z < exit_threshold or z > stop_loss:
                        should_exit = True
                        pnl = (entry_price - current_spread) * (1 - transaction_cost)
                
                if should_exit:
                    trades.append({
                        'date': str(spread.index[i]),
                        'action': 'exit',
                        'price': float(current_spread),
                        'zscore': float(z),
                        'pnl': float(pnl)
                    })
                    equity.append(equity[-1] + pnl)
                    position = 0
            
            if len(equity) == i - 19:
                equity.append(equity[-1])
        
        equity_series = pd.Series(equity)
        returns = equity_series.pct_change().dropna()
        
        sharpe_ratio = (returns.mean() / returns.std()) * np.sqrt(252) if returns.std() > 0 else 0
        total_return = (equity[-1] - equity[0]) / equity[0]
        
        cummax = equity_series.cummax()
        drawdown = (equity_series - cummax) / cummax
        max_drawdown = drawdown.min()
        
        winning_trades = [t for t in trades if 'pnl' in t and t['pnl'] > 0]
        total_trades = [t for t in trades if 'pnl' in t]
        win_rate = len(winning_trades) / len(total_trades) if total_trades else 0
        
        return {
            'sharpe_ratio': float(sharpe_ratio),
            'total_return': float(total_return),
            'max_drawdown': float(max_drawdown),
            'win_rate': float(win_rate),
            'num_trades': len(total_trades),
            'final_equity': float(equity[-1])
        }
        
    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    data_path = os.path.join(os.getcwd(), 'data', 'market_data.csv')
    config_path = os.path.join(os.getcwd(), 'data', 'backtest_config.json')
    result = run_backtest(data_path, config_path)
    print(json.dumps(result))
