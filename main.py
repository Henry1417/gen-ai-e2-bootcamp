import logging
import os
import json
import random
from typing import List, Optional
import httpx # NEW Dependency

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
    mode: Optional[str] = "ollama" # Changed default to olllama

class Attraction(BaseModel):
    name: str
    description: str
    type: str
    lat: float
    lng: float

class SuggestResponse(BaseModel):
    attractions: List[Attraction]

# --- Ollama LLM Service ---
class OllamaService:
    def __init__(self, model: str = "llama3.2", host: str = "http://localhost:11434"):
        self.model = model
        self.host = host
        self.timeout = 60.0 # Longer timeout for LLM generation

    async def generate_suggestions(self, start: Location, end: Location) -> List[Attraction]:
        """
        Queries local Ollama instance to find attractions between two coordinates.
        """
        # 1. Construct the Prompt
        # We need to be very specific to get JSON back.
        prompt = f"""
        You are an API that outputs ONLY valid JSON.
        I have a traveler going from coordinates ({start.lat}, {start.lng}) to ({end.lat}, {end.lng}).
        
        Suggest 5 interesting tourist attractions, hidden gems, or landmarks that are roughly geographically located between or near these two points.
        
        For each attraction you MUST ESTIMATE its coordinates (latitude and longitude) based on its real location.
        
        Output MUST be a raw JSON array of objects with these exact keys: "name", "description", "type", "lat", "lng".
        Do not include markdown formatting like ```json ... ```. Just the raw JSON array.
        
        Example structure:
        [
            {{
                "name": "Eiffel Tower",
                "description": "A wrought-iron lattice tower on the Champ de Mars.",
                "type": "Landmark",
                "lat": 48.8584,
                "lng": 2.2945
            }}
        ]
        """

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                logger.info(f"Sending request to Ollama ({self.model})...")
                response = await client.post(
                    f"{self.host}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False,
                        "format": "json" # Force JSON mode if supported by the model/version
                    }
                )
                response.raise_for_status()
                result = response.json()
                
                # 2. Parse Response
                raw_text = result.get("response", "")
                logger.info(f"Ollama raw response: {raw_text[:200]}...") # Log first 200 chars

                # Clean up if markdown is present (just in case)
                clean_text = raw_text.strip()
                if clean_text.startswith("```json"):
                    clean_text = clean_text[7:]
                if clean_text.endswith("```"):
                    clean_text = clean_text[:-3]
                
                data = json.loads(clean_text)
                
                # 3. Validate and Convert
                attractions = []
                
                # Handle single object response
                if isinstance(data, dict):
                    # Check if it's wrapped in a key like "attractions" or "places"
                    if "attractions" in data and isinstance(data["attractions"], list):
                        data = data["attractions"]
                    else:
                        # Assume the dict itself is the attraction
                        data = [data]
                
                if not isinstance(data, list):
                     raise ValueError("LLM response did not parse into a list or compatible object")

                for item in data:
                    try:
                        attractions.append(Attraction(**item))
                    except Exception as val_err:
                        logger.warning(f"Skipping invalid attraction item: {item} - {val_err}")

                return attractions

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from LLM: {e}")
            logger.error(f"Bad JSON Content: {raw_text}")
            raise HTTPException(status_code=500, detail="AI returned invalid data format.")
        except httpx.RequestError as e:
            logger.error(f"Ollama connection error: {e}")
            raise HTTPException(status_code=503, detail="Could not connect to local AI service. Is Ollama running?")
        except Exception as e:
            logger.error(f"General error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

llm_service = OllamaService()

# --- Routes ---

@app.post("/api/suggest", response_model=SuggestResponse)
async def suggest_attractions(request: SuggestRequest):
    logger.info(f"Received suggestion request from {request.start} to {request.end}")
    
    try:
        suggestions = await llm_service.generate_suggestions(request.start, request.end)
        return SuggestResponse(attractions=suggestions)
    except Exception as e:
        logger.error(f"Error generating suggestions: {e}")
        raise e # Re-raise known exceptions

# MOUNT STATIC FILES LAST
# This ensures that API routes are matched before static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
