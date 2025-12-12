import json
import os
from sentence_transformers import SentenceTransformer, util
import torch

# Categorías expandidas más realistas
CATEGORIES = [
    "Network Issues",
    "Security",
    "Performance",
    "Database",
    "Integration",
    "UI/UX",
    "Hardware",
    "Software Bug",
    "Data Loss",
    "Authentication",
    "Billing",
    "Account Management",
    "Feature Request",
    "Configuration"
]

class TicketSearchEngine:
    def __init__(self, data_file="tickets.json", model_name="all-MiniLM-L6-v2"):
        self.data_file = data_file
        self.model_name = model_name
        self.tickets = []
        self.embeddings = None
        self.model = None
        self.category_embeddings = None

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
        
        # Pre-compute category embeddings for classification
        print("Computing category embeddings...")
        self.category_embeddings = self.model.encode(CATEGORIES, convert_to_tensor=True)
        print("Category embeddings computed.")

    def compute_embeddings(self):
        if not self.tickets:
            self.load_data()
        
        if not self.model:
            self.load_model()
            
        print("Computing embeddings...")
        corpus = [f"{t['subject']} {t['description']}" for t in self.tickets]
        self.embeddings = self.model.encode(corpus, convert_to_tensor=True)
        print("Embeddings computed.")

    def classify_ticket(self, subject: str, description: str):
        """
        Clasifica un ticket usando embeddings de categorías.
        Retorna la categoría más similar.
        """
        if not self.model:
            self.load_model()
        
        # Crear embedding del ticket
        ticket_text = f"{subject} {description}"
        ticket_embedding = self.model.encode(ticket_text, convert_to_tensor=True)
        
        # Calcular similitud con cada categoría
        similarities = util.cos_sim(ticket_embedding, self.category_embeddings)[0]
        
        # Obtener la categoría con mayor similitud
        best_match_idx = torch.argmax(similarities).item()
        best_score = float(similarities[best_match_idx])
        best_category = CATEGORIES[best_match_idx]
        
        # Retornar top 3 categorías sugeridas
        top_3_indices = torch.topk(similarities, k=min(3, len(CATEGORIES))).indices
        suggestions = [
            {
                "category": CATEGORIES[idx],
                "confidence": float(similarities[idx])
            }
            for idx in top_3_indices
        ]
        
        return {
            "category": best_category,
            "confidence": best_score,
            "suggestions": suggestions
        }

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

    def add_ticket(self, subject: str, description: str, category: str):
        """
        Agrega un nuevo ticket al archivo JSON y recalcula embeddings.
        """
        # Cargar datos actuales
        if not self.tickets:
            self.load_data()
        
        # Generar nuevo ID
        new_id = max([t["id"] for t in self.tickets], default=0) + 1
        
        # Crear nuevo ticket
        new_ticket = {
            "id": new_id,
            "subject": subject,
            "description": description,
            "category": category
        }
        
        # Agregar a la lista
        self.tickets.append(new_ticket)
        
        # Guardar en archivo
        with open(self.data_file, "w") as f:
            json.dump(self.tickets, f, indent=2)
        
        # Recalcular embeddings
        self.compute_embeddings()
        
        print(f"Ticket #{new_id} added successfully.")
        return new_ticket

# Singleton instance to be used by the app
search_engine = TicketSearchEngine()

