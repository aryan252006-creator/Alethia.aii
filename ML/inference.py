import torch
import pandas as pd
import json
import os
from src.models.pipeline import FinancialIntelligencePipeline
from transformers import AutoTokenizer

def load_latest_data():
    csv_path = os.path.join("ML", "market_data.csv")
    json_path = os.path.join("ML", "narratives.json")
    
    df = pd.read_csv(csv_path)
    with open(json_path, 'r') as f:
        narratives = json.load(f)
    
    return df, narratives

def run_inference(ticker, df, narratives, model, tokenizer):
    # 1. Prepare Data
    ticker_df = df[df['ticker'] == ticker].iloc[-5:] # Last 5 days
    if len(ticker_df) < 5:
        print(f"Not enough data for {ticker}")
        return
    
    temp_data = torch.tensor(ticker_df[['price', 'volume']].values, dtype=torch.float).unsqueeze(0)
    tab_data = torch.tensor([ticker_df.iloc[-1]['debt_ratio'], ticker_df.iloc[-1]['sector_id']], dtype=torch.float).unsqueeze(0)
    
    narrative = next(n for n in narratives if n['ticker'] == ticker)
    text = narrative['transcript']
    
    encoding = tokenizer.encode_plus(
        text,
        add_special_tokens=True,
        max_length=64,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt'
    )
    
    # 2. Forward Pass
    batch = {
        "temporal": temp_data,
        "tabular": tab_data,
        "text_input_ids": encoding['input_ids'],
        "text_attn_mask": encoding['attention_mask'],
        "target": torch.tensor([0.0]) # Dummy target
    }
    
    with torch.no_grad():
        outputs = model(batch)
    
    return outputs, text

def main():
    print("=== Heisenbug Collective: Multi-Modal Inference ===")
    
    # Load data
    df, narratives = load_latest_data()
    tickers = df['ticker'].unique()
    
    print(f"Available Tickers: {', '.join(tickers)}")
    selected_ticker = input("Enter a ticker to analyze: ").upper()
    
    if selected_ticker not in tickers:
        print("Invalid ticker.")
        return
    
    # Initialize Model (using random weights for demo if no checkpoint)
    model = FinancialIntelligencePipeline(temporal_dim=2, tabular_dim=2)
    model.eval()
    tokenizer = AutoTokenizer.from_pretrained('yiyanghkust/finbert-pretrain')
    
    outputs, text = run_inference(selected_ticker, df, narratives, model, tokenizer)
    
    print("\n--- Input Narrative ---")
    print(f"\"{text}\"")
    
    print("\n--- Pipeline Output ---")
    pred = outputs['prediction'].item()
    rel = outputs['reliability_score'].item()
    regime = outputs['regime_id']
    consistent = outputs['is_consistent'].item()
    
    print(f"Prediction (Market Trend): {round(pred, 4)} ({'Bullish' if pred > 0 else 'Bearish'})")
    print(f"Reliability Score: {round(rel * 100, 2)}%")
    print(f"Consistency Confirmed: {'YES' if consistent else 'NO (Sentiment/Data Conflict)'}")
    print(f"Market Regime ID: {regime}")
    
    if not consistent:
        print("\n[WARNING] The system detected a representation reliability problem.")
        print("The textual sentiment does not align with the numeric market features.")

if __name__ == "__main__":
    main()
