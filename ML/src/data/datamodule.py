import torch
from torch.utils.data import Dataset, DataLoader
import pytorch_lightning as L
from transformers import AutoTokenizer
import pandas as pd
import json
import os

class MarketDataset(Dataset):
    def __init__(self, df, narratives, window_size=5, tokenizer_name='yiyanghkust/finbert-pretrain', max_len=64):
        self.df = df
        self.narratives = {n['ticker']: n for n in narratives}
        self.window_size = window_size
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
        self.max_len = max_len
        
        # Prepare valid indices (we need at least window_size history for each sample)
        self.indices = []
        for ticker in self.df['ticker'].unique():
            ticker_indices = self.df.index[self.df['ticker'] == ticker].tolist()
            if len(ticker_indices) >= window_size:
                # We can start from the window_size-th index
                self.indices.extend(ticker_indices[window_size-1:])

    def __len__(self):
        return len(self.indices)

    def __getitem__(self, idx):
        real_idx = self.indices[idx]
        row = self.df.iloc[real_idx]
        ticker = row['ticker']
        
        # 1. Temporal Branch: 5-day window of price and volume
        # Get indices from real_idx - window_size + 1 to real_idx
        window_df = self.df.iloc[real_idx - self.window_size + 1 : real_idx + 1]
        temp_data = window_df[['price', 'volume']].values
        temp = torch.tensor(temp_data, dtype=torch.float)
        
        # 2. Tabular Branch: debt_ratio and sector_id
        tab_data = [row['debt_ratio'], row['sector_id']]
        tab = torch.tensor(tab_data, dtype=torch.float)
        
        # 3. Textual Branch: transcript
        narrative = self.narratives.get(ticker, {"transcript": ""})
        text = narrative['transcript']
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt'
        )
        
        # Target
        target = torch.tensor(row['label'], dtype=torch.float)
        
        # Output a batch dictionary where each key corresponds to a modality
        return {
            "temporal": temp,
            "tabular": tab,
            "text_input_ids": encoding['input_ids'].flatten(),
            "text_attn_mask": encoding['attention_mask'].flatten(),
            "target": target
        }

class FinancialDataModule(L.LightningDataModule):
    def __init__(self, csv_path, json_path, window_size=5, batch_size=32):
        super().__init__()
        self.csv_path = csv_path
        self.json_path = json_path
        self.window_size = window_size
        self.batch_size = batch_size

    def setup(self, stage=None):
        df = pd.read_csv(self.csv_path)
        with open(self.json_path, 'r') as f:
            narratives = json.load(f)
            
        # Split by ticker for simple train/val split
        tickers = df['ticker'].unique()
        train_tickers = tickers[:4]
        val_tickers = tickers[4:]
        
        train_df = df[df['ticker'].isin(train_tickers)].reset_index(drop=True)
        val_df = df[df['ticker'].isin(val_tickers)].reset_index(drop=True)
        
        self.train_dataset = MarketDataset(train_df, narratives, window_size=self.window_size)
        self.val_dataset = MarketDataset(val_df, narratives, window_size=self.window_size)

    def train_dataloader(self):
        return DataLoader(self.train_dataset, batch_size=self.batch_size, shuffle=True)

    def val_dataloader(self):
        return DataLoader(self.val_dataset, batch_size=self.batch_size)
