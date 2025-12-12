# Ejemplos de Uso de la API

Este documento contiene ejemplos prácticos de cómo usar la API del conversor de unidades.

## 🌐 URL Base

```
http://localhost:8000
```

## 📡 Endpoints

### 1. Obtener Información de la API

**Request:**
```http
GET http://localhost:8000/
```

**Response:**
```json
{
  "message": "Unit Converter API",
  "version": "1.0.0",
  "endpoints": {
    "convert": "/api/convert",
    "conversions": "/api/conversions",
    "docs": "/docs"
  }
}
```

---

### 2. Listar Conversiones Disponibles

**Request:**
```http
GET http://localhost:8000/api/conversions
```

**Response:**
```json
{
  "conversions": [
    {
      "type": "celsius_to_fahrenheit",
      "from_unit": "°C",
      "to_unit": "°F"
    },
    {
      "type": "fahrenheit_to_celsius",
      "from_unit": "°F",
      "to_unit": "°C"
    },
    {
      "type": "miles_to_kilometers",
      "from_unit": "mi",
      "to_unit": "km"
    },
    // ... más conversiones
  ]
}
```

---

### 3. Realizar Conversiones

#### Ejemplo 1: Celsius a Fahrenheit

**Request:**
```http
POST http://localhost:8000/api/convert
Content-Type: application/json

{
  "value": 100,
  "conversion_type": "celsius_to_fahrenheit"
}
```

**Response:**
```json
{
  "original_value": 100,
  "converted_value": 212.0,
  "from_unit": "°C",
  "to_unit": "°F",
  "conversion_type": "celsius_to_fahrenheit"
}
```

---

#### Ejemplo 2: Millas a Kilómetros

**Request:**
```http
POST http://localhost:8000/api/convert
Content-Type: application/json

{
  "value": 10,
  "conversion_type": "miles_to_kilometers"
}
```

**Response:**
```json
{
  "original_value": 10,
  "converted_value": 16.09,
  "from_unit": "mi",
  "to_unit": "km",
  "conversion_type": "miles_to_kilometers"
}
```

---

#### Ejemplo 3: Libras a Kilogramos

**Request:**
```http
POST http://localhost:8000/api/convert
Content-Type: application/json

{
  "value": 150,
  "conversion_type": "pounds_to_kilograms"
}
```

**Response:**
```json
{
  "original_value": 150,
  "converted_value": 68.04,
  "from_unit": "lb",
  "to_unit": "kg",
  "conversion_type": "pounds_to_kilograms"
}
```

---

## 💻 Ejemplos de Código

### Python (usando requests)

```python
import requests

# URL base de la API
BASE_URL = "http://localhost:8000"

# Ejemplo 1: Convertir 100°C a Fahrenheit
response = requests.post(
    f"{BASE_URL}/api/convert",
    json={
        "value": 100,
        "conversion_type": "celsius_to_fahrenheit"
    }
)
result = response.json()
print(f"{result['original_value']} {result['from_unit']} = {result['converted_value']} {result['to_unit']}")
# Output: 100 °C = 212.0 °F

# Ejemplo 2: Convertir 50 millas a kilómetros
response = requests.post(
    f"{BASE_URL}/api/convert",
    json={
        "value": 50,
        "conversion_type": "miles_to_kilometers"
    }
)
result = response.json()
print(f"{result['original_value']} {result['from_unit']} = {result['converted_value']} {result['to_unit']}")
# Output: 50 mi = 80.47 km
```

---

### JavaScript (usando fetch)

```javascript
// URL base de la API
const BASE_URL = 'http://localhost:8000';

// Ejemplo 1: Convertir 32°F a Celsius
async function convertTemperature() {
  const response = await fetch(`${BASE_URL}/api/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      value: 32,
      conversion_type: 'fahrenheit_to_celsius'
    })
  });
  
  const result = await response.json();
  console.log(`${result.original_value} ${result.from_unit} = ${result.converted_value} ${result.to_unit}`);
  // Output: 32 °F = 0.0 °C
}

convertTemperature();

// Ejemplo 2: Convertir 5 galones a litros
async function convertVolume() {
  const response = await fetch(`${BASE_URL}/api/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      value: 5,
      conversion_type: 'gallons_to_liters'
    })
  });
  
  const result = await response.json();
  console.log(`${result.original_value} ${result.from_unit} = ${result.converted_value} ${result.to_unit}`);
  // Output: 5 gal = 18.93 L
}

convertVolume();
```

---

### cURL

```bash
# Ejemplo 1: Convertir 100 pies a metros
curl -X POST "http://localhost:8000/api/convert" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 100,
    "conversion_type": "feet_to_meters"
  }'

# Ejemplo 2: Convertir 200 gramos a onzas
curl -X POST "http://localhost:8000/api/convert" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 200,
    "conversion_type": "grams_to_ounces"
  }'
```

---

## ❌ Manejo de Errores

### Error: Valor inválido

**Request:**
```json
{
  "value": "abc",
  "conversion_type": "celsius_to_fahrenheit"
}
```

**Response (400 Bad Request):**
```json
{
  "detail": [
    {
      "loc": ["body", "value"],
      "msg": "value is not a valid float",
      "type": "type_error.float"
    }
  ]
}
```

---

### Error: Tipo de conversión inválido

**Request:**
```json
{
  "value": 100,
  "conversion_type": "invalid_conversion"
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "detail": [
    {
      "loc": ["body", "conversion_type"],
      "msg": "unexpected value; permitted: 'celsius_to_fahrenheit', 'fahrenheit_to_celsius', ...",
      "type": "value_error.const"
    }
  ]
}
```

---

## 🧪 Probar la API

### Usando la Documentación Interactiva (Swagger)

1. Inicia el servidor backend
2. Abre tu navegador en: http://localhost:8000/docs
3. Verás una interfaz interactiva donde puedes probar todos los endpoints
4. Haz clic en cualquier endpoint para expandirlo
5. Haz clic en "Try it out"
6. Ingresa los valores de prueba
7. Haz clic en "Execute"
8. Verás la respuesta en tiempo real

### Usando Postman

1. Crea una nueva colección llamada "Unit Converter API"
2. Agrega requests para cada endpoint
3. Configura el método HTTP (GET o POST)
4. Agrega el body JSON para las conversiones
5. Envía las requests y verifica las respuestas

---

## 📊 Tipos de Conversión Disponibles

| Tipo de Conversión | Valor de `conversion_type` |
|-------------------|---------------------------|
| Celsius → Fahrenheit | `celsius_to_fahrenheit` |
| Fahrenheit → Celsius | `fahrenheit_to_celsius` |
| Millas → Kilómetros | `miles_to_kilometers` |
| Kilómetros → Millas | `kilometers_to_miles` |
| Pies → Metros | `feet_to_meters` |
| Metros → Pies | `meters_to_feet` |
| Pulgadas → Centímetros | `inches_to_centimeters` |
| Centímetros → Pulgadas | `centimeters_to_inches` |
| Libras → Kilogramos | `pounds_to_kilograms` |
| Kilogramos → Libras | `kilograms_to_pounds` |
| Onzas → Gramos | `ounces_to_grams` |
| Gramos → Onzas | `grams_to_ounces` |
| Galones → Litros | `gallons_to_liters` |
| Litros → Galones | `liters_to_gallons` |

---

## 🔗 Enlaces Útiles

- **Documentación Interactiva (Swagger)**: http://localhost:8000/docs
- **Documentación Alternativa (ReDoc)**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json
