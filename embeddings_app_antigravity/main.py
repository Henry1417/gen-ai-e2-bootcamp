from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List
from core import search_engine

app = FastAPI(title="Support Ticket Embeddings Search")

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

@app.post("/api/search", response_model=List[SearchResult])
async def search_tickets(search_query: SearchQuery):
    if not search_query.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    results = search_engine.search(search_query.query, top_k=search_query.limit)
    return results

# Serve static files for frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
