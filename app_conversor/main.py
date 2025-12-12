"""
FastAPI Unit Converter Application
Provides RESTful API endpoints for common unit conversions.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, validator
from typing import Literal
import uvicorn

from converters import (
    celsius_to_fahrenheit,
    fahrenheit_to_celsius,
    miles_to_kilometers,
    kilometers_to_miles,
    pounds_to_kilograms,
    kilograms_to_pounds,
    inches_to_centimeters,
    centimeters_to_inches,
    gallons_to_liters,
    liters_to_gallons,
    feet_to_meters,
    meters_to_feet,
    ounces_to_grams,
    grams_to_ounces,
)

app = FastAPI(
    title="Unit Converter API",
    description="API for converting between imperial and metric units",
    version="1.0.0",
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConversionRequest(BaseModel):
    """Request model for unit conversion."""
    
    value: float = Field(..., description="The value to convert")
    conversion_type: Literal[
        "celsius_to_fahrenheit",
        "fahrenheit_to_celsius",
        "miles_to_kilometers",
        "kilometers_to_miles",
        "pounds_to_kilograms",
        "kilograms_to_pounds",
        "inches_to_centimeters",
        "centimeters_to_inches",
        "gallons_to_liters",
        "liters_to_gallons",
        "feet_to_meters",
        "meters_to_feet",
        "ounces_to_grams",
        "grams_to_ounces",
    ] = Field(..., description="Type of conversion to perform")
    
    @validator("value")
    def validate_value(cls, v):
        """Validate that the value is a finite number."""
        if not isinstance(v, (int, float)):
            raise ValueError("Value must be a number")
        if not (-1e10 < v < 1e10):
            raise ValueError("Value is out of acceptable range")
        return v


class ConversionResponse(BaseModel):
    """Response model for unit conversion."""
    
    original_value: float
    converted_value: float
    from_unit: str
    to_unit: str
    conversion_type: str


# Mapping of conversion types to their functions and units
CONVERSION_MAP = {
    "celsius_to_fahrenheit": {
        "func": celsius_to_fahrenheit,
        "from_unit": "°C",
        "to_unit": "°F",
    },
    "fahrenheit_to_celsius": {
        "func": fahrenheit_to_celsius,
        "from_unit": "°F",
        "to_unit": "°C",
    },
    "miles_to_kilometers": {
        "func": miles_to_kilometers,
        "from_unit": "mi",
        "to_unit": "km",
    },
    "kilometers_to_miles": {
        "func": kilometers_to_miles,
        "from_unit": "km",
        "to_unit": "mi",
    },
    "pounds_to_kilograms": {
        "func": pounds_to_kilograms,
        "from_unit": "lb",
        "to_unit": "kg",
    },
    "kilograms_to_pounds": {
        "func": kilograms_to_pounds,
        "from_unit": "kg",
        "to_unit": "lb",
    },
    "inches_to_centimeters": {
        "func": inches_to_centimeters,
        "from_unit": "in",
        "to_unit": "cm",
    },
    "centimeters_to_inches": {
        "func": centimeters_to_inches,
        "from_unit": "cm",
        "to_unit": "in",
    },
    "gallons_to_liters": {
        "func": gallons_to_liters,
        "from_unit": "gal",
        "to_unit": "L",
    },
    "liters_to_gallons": {
        "func": liters_to_gallons,
        "from_unit": "L",
        "to_unit": "gal",
    },
    "feet_to_meters": {
        "func": feet_to_meters,
        "from_unit": "ft",
        "to_unit": "m",
    },
    "meters_to_feet": {
        "func": meters_to_feet,
        "from_unit": "m",
        "to_unit": "ft",
    },
    "ounces_to_grams": {
        "func": ounces_to_grams,
        "from_unit": "oz",
        "to_unit": "g",
    },
    "grams_to_ounces": {
        "func": grams_to_ounces,
        "from_unit": "g",
        "to_unit": "oz",
    },
}


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Unit Converter API",
        "version": "1.0.0",
        "endpoints": {
            "convert": "/api/convert",
            "conversions": "/api/conversions",
            "docs": "/docs",
        },
    }


@app.get("/api/conversions")
async def get_available_conversions():
    """Get list of all available conversion types."""
    conversions = []
    for conv_type, details in CONVERSION_MAP.items():
        conversions.append({
            "type": conv_type,
            "from_unit": details["from_unit"],
            "to_unit": details["to_unit"],
        })
    return {"conversions": conversions}


@app.post("/api/convert", response_model=ConversionResponse)
async def convert_units(request: ConversionRequest):
    """
    Convert a value from one unit to another.
    
    Args:
        request: ConversionRequest containing value and conversion type
        
    Returns:
        ConversionResponse with the converted value
        
    Raises:
        HTTPException: If conversion type is invalid
    """
    try:
        conversion = CONVERSION_MAP[request.conversion_type]
        converted_value = conversion["func"](request.value)
        
        return ConversionResponse(
            original_value=request.value,
            converted_value=converted_value,
            from_unit=conversion["from_unit"],
            to_unit=conversion["to_unit"],
            conversion_type=request.conversion_type,
        )
    except KeyError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid conversion type: {request.conversion_type}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Conversion error: {str(e)}",
        )


# Mount static files for React frontend
try:
    app.mount("/", StaticFiles(directory="frontend/build", html=True), name="static")
except RuntimeError:
    # Frontend not built yet
    pass


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
