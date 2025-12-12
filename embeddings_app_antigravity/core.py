import json
import os
from sentence_transformers import SentenceTransformer, util
import torch

class TicketSearchEngine:
    def __init__(self, data_file="tickets.json", model_name="all-MiniLM-L6-v2"):
        self.data_file = data_file
        self.model_name = model_name
        self.tickets = []
        self.embeddings = None
        self.model = None

    def load_data(self):
        if not os.path.exists(self.data_file):
            print(f"File {self.data_file} not found. Please generate data first.")
            return
        
        with open(self.data_file, "r") as f:
            self.tickets = json.load(f)
        print(f"Loaded {len(self.tickets)} tickets.")

    def load_model(self):
        print(f"Loading model {self.model_name}...")
        self.model = SentenceTransformer(self.model_name)
        print("Model loaded.")

    def compute_embeddings(self):
        if not self.tickets:
            self.load_data()
        
        if not self.model:
            self.load_model()
            
        print("Computing embeddings...")
        corpus = [f"{t['subject']} {t['description']}" for t in self.tickets]
        self.embeddings = self.model.encode(corpus, convert_to_tensor=True)
        print("Embeddings computed.")

    def search(self, query, top_k=5):
        if self.embeddings is None:
            self.compute_embeddings()
            
        query_embedding = self.model.encode(query, convert_to_tensor=True)
        
        # We use cosine-similarity
        cos_scores = util.cos_sim(query_embedding, self.embeddings)[0]
        top_results = torch.topk(cos_scores, k=min(top_k, len(self.tickets)))
        
        results = []
        for score, idx in zip(top_results[0], top_results[1]):
            ticket = self.tickets[idx]
            results.append({
                "score": float(score),
                "id": ticket["id"],
                "subject": ticket["subject"],
                "description": ticket["description"],
                "category": ticket["category"]
            })
            
        return results

# Singleton instance to be used by the app
search_engine = TicketSearchEngine()
