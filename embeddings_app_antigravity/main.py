from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from core import search_engine

app = FastAPI(title="Support Ticket Embeddings Search")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize search engine on startup (or lazy load)
@app.on_event("startup")
async def startup_event():
    # Pre-load model and embeddings so the first request is fast
    # Ideally checking if data exists, otherwise generating it
    try:
        search_engine.load_data()
        search_engine.load_model()
        search_engine.compute_embeddings()
    except Exception as e:
        print(f"Startup warning: {e}")

class SearchQuery(BaseModel):
    query: str
    limit: int = 5

class SearchResult(BaseModel):
    id: int
    subject: str
    description: str
    category: str
    score: float

class ClassifyRequest(BaseModel):
    subject: str
    description: str

class CategorySuggestion(BaseModel):
    category: str
    confidence: float

class ClassifyResponse(BaseModel):
    category: str
    confidence: float
    suggestions: List[CategorySuggestion]
    similar_tickets: List[SearchResult]

class AddTicketRequest(BaseModel):
    subject: str
    description: str
    category: str

class AddTicketResponse(BaseModel):
    id: int
    subject: str
    description: str
    category: str
    message: str

@app.post("/api/search", response_model=List[SearchResult])
async def search_tickets(search_query: SearchQuery):
    if not search_query.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    results = search_engine.search(search_query.query, top_k=search_query.limit)
    return results

@app.post("/api/classify", response_model=ClassifyResponse)
async def classify_ticket(request: ClassifyRequest):
    """
    Clasifica un ticket usando embeddings y retorna tickets similares.
    """
    if not request.subject or not request.description:
        raise HTTPException(status_code=400, detail="Subject and description are required")
    
    try:
        # Clasificar el ticket
        classification = search_engine.classify_ticket(request.subject, request.description)
        
        # Buscar tickets similares
        query = f"{request.subject} {request.description}"
        similar_tickets = search_engine.search(query, top_k=5)
        
        return {
            "category": classification["category"],
            "confidence": classification["confidence"],
            "suggestions": classification["suggestions"],
            "similar_tickets": similar_tickets
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")

@app.post("/api/add-ticket", response_model=AddTicketResponse)
async def add_ticket(request: AddTicketRequest):
    """
    Agrega un nuevo ticket al sistema.
    """
    if not request.subject or not request.description or not request.category:
        raise HTTPException(status_code=400, detail="Subject, description, and category are required")
    
    try:
        new_ticket = search_engine.add_ticket(
            subject=request.subject,
            description=request.description,
            category=request.category
        )
        
        return {
            **new_ticket,
            "message": "Ticket added successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding ticket: {str(e)}")

# Serve static files for frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

