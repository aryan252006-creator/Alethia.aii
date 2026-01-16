import pandas as pd
import numpy as np
import json
import os

# Settings
companies = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON']
timesteps = 20  # Days of history per company

# 1. Generate market_data.csv (Temporal + Tabular)
rows = []
for ticker in companies:
    # Static Tabular Data
    debt_ratio = np.random.uniform(0.1, 0.8)
    sector_id = np.random.randint(0, 3)
    
    # Temporal Data (Random Walk)
    price = 100.0
    for day in range(timesteps):
        volatility = 0.02
        change = np.random.normal(0.001, volatility)
        price *= (1 + change)
        rows.append({
            "ticker": ticker,
            "date": f"2024-01-{day+1:02d}",
            "price": round(price, 2),
            "volume": np.random.randint(1000, 5000),
            "debt_ratio": round(debt_ratio, 2),
            "sector_id": sector_id,
            "label": 1 if price > 100 else 0  # Simple growth target
        })

market_data_path = os.path.join("ML", "market_data.csv")
pd.DataFrame(rows).to_csv(market_data_path, index=False)

# 2. Generate narratives.json (Textual)
# Here we align sentiment with the actual price movement
text_data = []
for ticker in companies:
    company_df = pd.DataFrame(rows)
    # Get last price for this ticker
    final_price = company_df[company_df['ticker'] == ticker]['price'].iloc[-1]
    
    # Logic: 80% consistent, 20% inconsistent (to test Zhang et al. reliability)
    is_consistent = np.random.random() > 0.2
    actual_trend = "positive" if final_price > 100 else "negative"
    
    if is_consistent:
        sentiment = actual_trend
    else:
        sentiment = "positive" if actual_trend == "negative" else "negative"

    text_data.append({
        "ticker": ticker,
        "transcript": f"Our analysis for {ticker} shows a very {sentiment} outlook for the coming quarter.",
        "alignment_flag": is_consistent  # For your ground-truth reliability testing
    })

narratives_path = os.path.join("ML", "narratives.json")
with open(narratives_path, "w") as f:
    json.dump(text_data, f, indent=4)

print(f"Files '{market_data_path}' and '{narratives_path}' created successfully.")
