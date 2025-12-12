"""
Unit tests for conversion functions.
"""

import pytest
from converters import (
    celsius_to_fahrenheit,
    fahrenheit_to_celsius,
    miles_to_kilometers,
    kilometers_to_miles,
    pounds_to_kilograms,
    kilograms_to_pounds,
)


class TestTemperatureConversions:
    """Test temperature conversion functions."""
    
    def test_celsius_to_fahrenheit(self):
        assert celsius_to_fahrenheit(0) == 32.0
        assert celsius_to_fahrenheit(100) == 212.0
        assert celsius_to_fahrenheit(-40) == -40.0
        
    def test_fahrenheit_to_celsius(self):
        assert fahrenheit_to_celsius(32) == 0.0
        assert fahrenheit_to_celsius(212) == 100.0
        assert fahrenheit_to_celsius(-40) == -40.0


class TestDistanceConversions:
    """Test distance conversion functions."""
    
    def test_miles_to_kilometers(self):
        assert miles_to_kilometers(1) == 1.61
        assert miles_to_kilometers(0) == 0.0
        
    def test_kilometers_to_miles(self):
        assert kilometers_to_miles(1.60934) == 1.0
        assert kilometers_to_miles(0) == 0.0


class TestWeightConversions:
    """Test weight conversion functions."""
    
    def test_pounds_to_kilograms(self):
        assert pounds_to_kilograms(1) == 0.45
        assert pounds_to_kilograms(0) == 0.0
        
    def test_kilograms_to_pounds(self):
        assert kilograms_to_pounds(1) == 2.2
        assert kilograms_to_pounds(0) == 0.0
