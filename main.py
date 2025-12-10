import logging
import os
import random
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Turimo App", description="AI-powered travel suggestions")

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Location(BaseModel):
    lat: float
    lng: float
    name: Optional[str] = None

class SuggestRequest(BaseModel):
    start: Location
    end: Location
    mode: Optional[str] = "simulation" # simulation, real

class Attraction(BaseModel):
    name: str
    description: str
    type: str
    lat: float
    lng: float

class SuggestResponse(BaseModel):
    attractions: List[Attraction]

# --- Mock LLM Service ---
class LLMService:
    def __init__(self):
        self.mock_adjectives = ["Hidden Gem", "Historical Site", "Local Favorite", "Must See", "Scenic Spot"]
        self.mock_types = ["Park", "Museum", "Restaurant", "Landmark", "Cafe"]
    
    def simulate_suggestions(self, start: Location, end: Location) -> List[Attraction]:
        """
        Generates mock attractions between two points.
        In a real scenario, this would generate points along the route.
        For simulation, we just generate random points near the midpoint.
        """
        mid_lat = (start.lat + end.lat) / 2
        mid_lng = (start.lng + end.lng) / 2
        
        attractions = []
        for i in range(5):
            # Add some random variance to place points around the center
            lat_offset = random.uniform(-0.05, 0.05)
            lng_offset = random.uniform(-0.05, 0.05)
            
            attractions.append(
                Attraction(
                    name=f"Turimo Spot #{i+1}",
                    description=f"A wonderful {random.choice(self.mock_adjectives).lower()} that you must visit on your trip.",
                    type=random.choice(self.mock_types),
                    lat=mid_lat + lat_offset,
                    lng=mid_lng + lng_offset
                )
            )
        return attractions

llm_service = LLMService()

# --- Routes ---

@app.post("/api/suggest", response_model=SuggestResponse)
async def suggest_attractions(request: SuggestRequest):
    logger.info(f"Received suggestion request from {request.start} to {request.end}")
    
    try:
        # In a real implementation, we would call an actual LLM (OpenAI/Gemini) here
        # passing the coordinates/names and asking for points of interest.
        suggestions = llm_service.simulate_suggestions(request.start, request.end)
        return SuggestResponse(attractions=suggestions)
    except Exception as e:
        logger.error(f"Error generating suggestions: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate suggestions")

# MOUNT STATIC FILES LAST
# This ensures that API routes are matched before static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
