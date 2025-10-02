import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import coint
from itertools import combinations
import json
import os

def calculate_half_life(spread):
    """Calculate mean reversion half-life"""
    spread_lag = spread.shift(1)
    spread_diff = spread - spread_lag
    spread_lag = spread_lag[1:]
    spread_diff = spread_diff[1:]
    
    from sklearn.linear_model import LinearRegression
    model = LinearRegression()
    model.fit(spread_lag.values.reshape(-1, 1), spread_diff.values)
    
    half_life = -np.log(2) / model.coef_[0] if model.coef_[0] < 0 else np.inf
    return half_life

def find_cointegrated_pairs(data_path):
    """Find cointegrated pairs using Engle-Granger test"""
    try:
        df = pd.read_csv(data_path)
        df['date'] = pd.to_datetime(df['date'])
        
        prices = df.pivot(index='date', columns='symbol', values='close')
        
        symbols = prices.columns.tolist()
        pairs_results = []
        
        for sym1, sym2 in combinations(symbols, 2):
            series1 = prices[sym1].dropna()
            series2 = prices[sym2].dropna()
            
            common_idx = series1.index.intersection(series2.index)
            if len(common_idx) < 100:
                continue
                
            s1 = series1.loc[common_idx]
            s2 = series2.loc[common_idx]
            
            score, pvalue, _ = coint(s1, s2)
            
            correlation = s1.corr(s2)
            
            spread = s1 - s2
            half_life = calculate_half_life(spread)
            
            pairs_results.append({
                'symbol1': sym1,
                'symbol2': sym2,
                'cointegration_pvalue': float(pvalue),
                'correlation': float(correlation),
                'half_life': float(half_life) if half_life != np.inf else 999.0
            })
        
        pairs_results.sort(key=lambda x: x['cointegration_pvalue'])
        
        return {'pairs': pairs_results[:10]}
        
    except Exception as e:
        return {'pairs': [], 'error': str(e)}

if __name__ == '__main__':
    data_path = os.path.join(os.getcwd(), 'data', 'market_data.csv')
    result = find_cointegrated_pairs(data_path)
    print(json.dumps(result))
