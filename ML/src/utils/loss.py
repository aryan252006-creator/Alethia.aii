import torch
import torch.nn as nn
import torch.nn.functional as F

class ConsistencyLoss(nn.Module):
    """
    Implements Zhang et al. Consistency Loss between Textual and Numeric embeddings.
    Numeric embedding = combined (Temporal + Tabular)
    """
    def __init__(self, lambda_consis=0.5):
        super().__init__()
        self.lambda_consis = lambda_consis

    def forward(self, text_emb, numeric_emb, prediction, target):
        # Main task loss (e.g. MSE for forecasting)
        task_loss = F.mse_loss(prediction, target)
        
        # Consistency loss (Cosine Similarity)
        # We want to maximize similarity, so minimize (1 - similarity)
        consis_loss = 1 - F.cosine_similarity(text_emb, numeric_emb).mean()
        
        total_loss = task_loss + self.lambda_consis * consis_loss
        return total_loss, task_loss, consis_loss

def calculate_reliability_score(text_emb, numeric_emb):
    """
    Outputs a 'Reliability Score' based on the inverse of the distance between embeddings.
    """
    dist = torch.norm(text_emb - numeric_emb, p=2, dim=1)
    # Map distance to [0, 1] range where 1 is highly reliable (low distance)
    reliability = torch.exp(-dist)
    return reliability
