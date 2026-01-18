import os
import json
import pandas as pd
from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager

app = FastAPI()

# Global variables to store loaded data
market_data = {}
narratives_data = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load data on startup
    global market_data, narratives_data
    
    try:
        # Paths relative to this file (ml/src/api.py) -> ml/market_data.csv
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        market_csv_path = os.path.join(base_dir, "market_data.csv")
        narratives_json_path = os.path.join(base_dir, "narratives.json")

        if os.path.exists(market_csv_path):
            market_df = pd.read_csv(market_csv_path)
            market_data = market_df
            print(f"Loaded market data from {market_csv_path}")
        else:
            print(f"Warning: {market_csv_path} not found")

        if os.path.exists(narratives_json_path):
            with open(narratives_json_path, "r") as f:
                narratives_list = json.load(f)
                # Convert list to dict keyed by ticker for faster lookup
                narratives_data = {item["ticker"]: item for item in narratives_list}
            print(f"Loaded narratives data from {narratives_json_path}")
        else:
             print(f"Warning: {narratives_json_path} not found")
             
    except Exception as e:
        print(f"Error loading data: {e}")
        
    yield
    # Clean up if needed

app = FastAPI(lifespan=lifespan)

@app.get("/predict/{ticker}")
def get_prediction(ticker: str):
    ticker = ticker.upper()
    
    # 1. Narratives
    narrative_info = narratives_data.get(ticker)
    if not narrative_info:
        raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found in narratives")

    # 2. Market Data
    if isinstance(market_data, pd.DataFrame) and not market_data.empty:
        ticker_df = market_data[market_data['ticker'] == ticker]
    else:
        ticker_df = pd.DataFrame()

    # Defaults
    reliability_score = 50.0
    regime = "Unknown"
    regime_id = 2  # Default to Crisis/Unknown
    prediction = 0.0

    history = []
    
    if not ticker_df.empty:
        # Calculate Logic using the last row
        last_row = ticker_df.iloc[-1]
        
        # Get History (Last 30 entries)
        # return list of dicts: [{'date': '...', 'price': ...}]
        recent_df = ticker_df.tail(30)
        history = recent_df[['date', 'price']].to_dict(orient='records')
        
        # Reliability Score Mock
        base_score = 70.0
        if last_row['debt_ratio'] < 0.5:
            base_score += 15.0
        if last_row['label'] == 1:
            base_score += 10.0
        reliability_score = min(100.0, max(0.0, base_score))
        
        # Regime Logic
        # 0: Stable, 1: Volatile, 2: Crisis
        if last_row['debt_ratio'] > 0.6:
            regime = "Volatile"
            regime_id = 1
        elif last_row['label'] == 1:
            regime = "Stable Growth"
            regime_id = 0
        else:
            regime = "Stable"
            regime_id = 0
            
        # Prediction Logic
        # Label 1 = Uptrend (Bullish), Label 0 = Downtrend (Bearish)
        if last_row['label'] == 1:
            prediction = 0.75 # strong buy signal mock
        else:
            prediction = -0.75 # strong sell signal mock
            
    else:
        # Fallback if no market data found but narrative exists
        reliability_score = 50.0
        regime = "No Data"
        regime_id = 2
        prediction = 0.0

    return {
        "reliability_score": reliability_score,
        "regime": regime,
        "regime_id": regime_id,
        "prediction": prediction,
        "history": history,
        "narrative_summary": narrative_info.get("transcript", ""),
        "is_consistent": narrative_info.get("alignment_flag", False)
    }
