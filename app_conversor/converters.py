"""
Unit Conversion Functions
Contains all conversion logic between imperial and metric units.
"""

from typing import Union

Number = Union[int, float]


# Temperature Conversions
def celsius_to_fahrenheit(celsius: Number) -> float:
    """
    Convert Celsius to Fahrenheit.
    
    Formula: °F = (°C × 9/5) + 32
    
    Args:
        celsius: Temperature in Celsius
        
    Returns:
        Temperature in Fahrenheit
    """
    return round((celsius * 9/5) + 32, 2)


def fahrenheit_to_celsius(fahrenheit: Number) -> float:
    """
    Convert Fahrenheit to Celsius.
    
    Formula: °C = (°F - 32) × 5/9
    
    Args:
        fahrenheit: Temperature in Fahrenheit
        
    Returns:
        Temperature in Celsius
    """
    return round((fahrenheit - 32) * 5/9, 2)


# Distance Conversions
def miles_to_kilometers(miles: Number) -> float:
    """
    Convert miles to kilometers.
    
    Args:
        miles: Distance in miles
        
    Returns:
        Distance in kilometers
    """
    return round(miles * 1.60934, 2)


def kilometers_to_miles(kilometers: Number) -> float:
    """
    Convert kilometers to miles.
    
    Args:
        kilometers: Distance in kilometers
        
    Returns:
        Distance in miles
    """
    return round(kilometers / 1.60934, 2)


def feet_to_meters(feet: Number) -> float:
    """
    Convert feet to meters.
    
    Args:
        feet: Length in feet
        
    Returns:
        Length in meters
    """
    return round(feet * 0.3048, 2)


def meters_to_feet(meters: Number) -> float:
    """
    Convert meters to feet.
    
    Args:
        meters: Length in meters
        
    Returns:
        Length in feet
    """
    return round(meters / 0.3048, 2)


def inches_to_centimeters(inches: Number) -> float:
    """
    Convert inches to centimeters.
    
    Args:
        inches: Length in inches
        
    Returns:
        Length in centimeters
    """
    return round(inches * 2.54, 2)


def centimeters_to_inches(centimeters: Number) -> float:
    """
    Convert centimeters to inches.
    
    Args:
        centimeters: Length in centimeters
        
    Returns:
        Length in inches
    """
    return round(centimeters / 2.54, 2)


# Weight/Mass Conversions
def pounds_to_kilograms(pounds: Number) -> float:
    """
    Convert pounds to kilograms.
    
    Args:
        pounds: Weight in pounds
        
    Returns:
        Weight in kilograms
    """
    return round(pounds * 0.453592, 2)


def kilograms_to_pounds(kilograms: Number) -> float:
    """
    Convert kilograms to pounds.
    
    Args:
        kilograms: Weight in kilograms
        
    Returns:
        Weight in pounds
    """
    return round(kilograms / 0.453592, 2)


def ounces_to_grams(ounces: Number) -> float:
    """
    Convert ounces to grams.
    
    Args:
        ounces: Weight in ounces
        
    Returns:
        Weight in grams
    """
    return round(ounces * 28.3495, 2)


def grams_to_ounces(grams: Number) -> float:
    """
    Convert grams to ounces.
    
    Args:
        grams: Weight in grams
        
    Returns:
        Weight in ounces
    """
    return round(grams / 28.3495, 2)


# Volume Conversions
def gallons_to_liters(gallons: Number) -> float:
    """
    Convert US gallons to liters.
    
    Args:
        gallons: Volume in US gallons
        
    Returns:
        Volume in liters
    """
    return round(gallons * 3.78541, 2)


def liters_to_gallons(liters: Number) -> float:
    """
    Convert liters to US gallons.
    
    Args:
        liters: Volume in liters
        
    Returns:
        Volume in US gallons
    """
    return round(liters / 3.78541, 2)
