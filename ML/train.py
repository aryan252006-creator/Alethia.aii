import torch
import pytorch_lightning as L
from pytorch_lightning.loggers import MLFlowLogger
import os
from src.models.pipeline import FinancialIntelligencePipeline
from src.data.datamodule import FinancialDataModule

def train():
    # 1. Paths to synthetic data
    csv_path = os.path.join("ML", "market_data.csv")
    json_path = os.path.join("ML", "narratives.json")
    
    if not os.path.exists(csv_path) or not os.path.exists(json_path):
        print("Data files not found. Please run ML/generate_data.py first.")
        return

    # 2. Setup DataModule
    # window_size=5 as requested
    dm = FinancialDataModule(csv_path, json_path, window_size=5, batch_size=2)
    
    # 3. Setup Model
    # temporal_dim=2 (price, volume)
    # tabular_dim=2 (debt_ratio, sector_id)
    model = FinancialIntelligencePipeline(
        temporal_dim=2,
        tabular_dim=2,
        latent_dim=128,
        lr=1e-4
    )
    
    # 4. Setup Logger
    mlf_logger = MLFlowLogger(experiment_name="Heisenbug_Collective_Pipeline")
    
    # 5. Trainer
    trainer = L.Trainer(
        max_epochs=2, # Small number for verification
        logger=mlf_logger,
        accelerator="auto",
        devices=1,
        default_root_dir="ML/checkpoints"
    )
    
    # 6. Execute
    trainer.fit(model, datamodule=dm)

if __name__ == "__main__":
    train()
