# Turimo - AI-Powered Travel Discovery App

### Descripción
**Turimo** es una aplicación web que **sugiere automáticamente sitios turísticos** entre dos puntos geográficos utilizando **Inteligencia Artificial local (Ollama + Llama 3.2)**. La aplicación combina mapas interactivos con recomendaciones inteligentes para descubrir atracciones turísticas, lugares ocultos y puntos de interés basándose en la ubicación del usuario.

### 📸 Evidencias
- [Ver capturas de pantalla y ejemplos de uso](./evidencias.md)

## 🌟 Características Principales

- 🗺️ **Mapas Interactivos**: Interfaz de mapa con Leaflet.js para seleccionar puntos de origen y destino
- 🤖 **IA Local con Ollama**: Utiliza Llama 3.2 ejecutándose localmente para generar sugerencias personalizadas
- 📍 **Geocodificación Inversa**: Muestra nombres de ciudades y lugares en lugar de coordenadas
- 💎 **Sugerencias Inteligentes**: Encuentra atracciones turísticas, museos, parques, restaurantes y landmarks
- 📄 **Paginación Inteligente**: Botón "Load More" que solicita nuevas sugerencias excluyendo las ya mostradas
- 🎨 **Diseño Premium**: Interfaz glassmorphic con tema oscuro y animaciones fluidas
- 🔄 **Actualización en Tiempo Real**: Los marcadores y resultados se actualizan dinámicamente en el mapa
- 🌐 **Sin Dependencias de APIs Comerciales**: Funciona completamente offline (excepto geocodificación)

## 🛠️ Tecnologías Utilizadas

### 💻 Entorno de Desarrollo IDE
  - **Antigravity**
  - **Modelo** Gemini 3 Pro(High) / Claude Sonnet 4.5

### 🔌 Backend
- **FastAPI**: Framework web moderno y rápido para Python
- **Uvicorn**: Servidor ASGI de alto rendimiento
- **Pydantic**: Validación de datos y serialización
- **httpx**: Cliente HTTP asíncrono para comunicación con Ollama
- **Ollama**: Servidor local de LLMs (Llama 3.2)

### 🎨 Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: Estilos glassmorphic con animaciones
- **Vanilla JavaScript**: Sin frameworks, código limpio y eficiente
- **Leaflet.js**: Biblioteca de mapas interactivos open-source
- **Nominatim API**: Geocodificación inversa (OpenStreetMap)

  #### 🎨 Características de Diseño
  - **Glassmorphism**: Efectos de vidrio esmerilado en paneles laterales
  - **Dark Mode Premium**: Paleta de colores oscura con acentos vibrantes
  - **Animaciones Fluidas**: Transiciones suaves y micro-interacciones
  - **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
  - **Tipografía Moderna**: Google Fonts (Outfit)
  - **Mapas Temáticos**: Tiles de CartoDB en modo oscuro

### 🧠 Inteligencia Artificial
- **Modelo**: Llama 3.2 (ejecutado localmente vía Ollama)
- **Técnica**: Prompting estructurado con formato JSON
- **Modo**: Generación de texto con restricciones de formato
- **Respuesta**: JSON estructurado con atracciones turísticas

## 🏗️ Estructura del Proyecto

```
turimo_app_antigravity/
├── main.py              # Aplicación FastAPI principal
├── requirements.txt     # Dependencias de Python
├── .gitignore          # Archivos ignorados por Git
├── static/
│   ├── index.html       # Interfaz principal
│   ├── css/
│   │   └── styles.css   # Estilos glassmorphic
│   └── js/
│       └── app.js       # Lógica del frontend y mapas
├── README.md
└── evidencias.md        # Capturas de pantalla
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Python 3.8+**
- **Ollama** instalado y ejecutándose
- **Modelo Llama 3.2** descargado en Ollama

### 1. Instalar y Configurar Ollama

Si aún no tienes Ollama instalado:

**Windows/macOS/Linux:**
```bash
# Descarga desde https://ollama.com/download
# O usa el instalador apropiado para tu sistema
```

**Descargar el modelo Llama 3.2:**
```bash
ollama pull llama3.2
```

**Iniciar el servidor Ollama:**
```bash
ollama serve
```

El servidor Ollama debe estar ejecutándose en `http://localhost:11434` (puerto por defecto).

### 2. Instalar Dependencias de Python

Navega a la carpeta del proyecto:
```bash
cd turimo_app_antigravity
```

(Opcional) Crea y activa un entorno virtual:
```bash
python -m venv venv

# En Windows:
.\venv\Scripts\activate

# En macOS/Linux:
source venv/bin/activate
```

Instala las dependencias:
```bash
pip install -r requirements.txt
```

### 3. Ejecutar la Aplicación

Inicia el servidor FastAPI:

```bash
uvicorn main:app --reload
```

O usando Python directamente:
```bash
python main.py
```

La aplicación estará disponible en:
- **Aplicación Web**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs

## 📡 API Endpoints

### `POST /api/suggest`

Genera sugerencias de atracciones turísticas entre dos puntos usando Llama 3.2.

**Request Body:**
```json
{
  "start": {
    "lat": 19.4326,
    "lng": -99.1332,
    "name": "Ciudad de México, Mexico"
  },
  "end": {
    "lat": 20.9674,
    "lng": -89.6243,
    "name": "Mérida, Mexico"
  },
  "mode": "ollama",
  "exclude": ["Palacio de Bellas Artes", "Teotihuacán"]
}
```

**Parámetros:**
- `start`: Objeto con coordenadas del punto de origen
- `end`: Objeto con coordenadas del punto de destino
- `mode`: Modo de operación (siempre "ollama")
- `exclude`: Lista de nombres de atracciones a excluir (para paginación)

**Respuesta:**
```json
{
  "attractions": [
    {
      "name": "Zona Arqueológica de Tula",
      "description": "Impresionante sitio arqueológico tolteca con los famosos Atlantes",
      "type": "Landmark",
      "lat": 20.0625,
      "lng": -99.3417
    },
    {
      "name": "Grutas de Cacahuamilpa",
      "description": "Sistema de cavernas con formaciones espectaculares",
      "type": "Park",
      "lat": 18.6667,
      "lng": -99.5000
    },
    {
      "name": "Pueblo Mágico de Valladolid",
      "description": "Encantador pueblo colonial con cenotes cercanos",
      "type": "Landmark",
      "lat": 20.6906,
      "lng": -88.2025
    }
  ]
}
```

## 🔧 Cómo Funciona

### 1. Selección de Puntos en el Mapa
- El usuario hace clic en el mapa para seleccionar el punto de **origen**
- Hace clic nuevamente para seleccionar el punto de **destino**
- La aplicación usa **Nominatim** (OpenStreetMap) para obtener el nombre del lugar
- Los inputs se actualizan con nombres legibles (ej: "Puebla, Mexico" en lugar de "19.0414, -98.2063")

### 2. Generación de Sugerencias con IA
Cuando el usuario presiona "Find Hidden Gems":
- El frontend envía las coordenadas al backend
- El backend construye un **prompt estructurado** para Llama 3.2
- El prompt solicita específicamente:
  - 5 atracciones turísticas entre los dos puntos
  - Coordenadas estimadas para cada atracción
  - Formato JSON estricto
  - Exclusión de lugares ya mostrados (si aplica)
- Ollama procesa el prompt y genera la respuesta
- El backend parsea el JSON y valida los datos
- Se retornan las atracciones al frontend

### 3. Visualización en el Mapa
- Cada atracción se muestra como un marcador 💎 en el mapa
- Se genera una tarjeta (card) en el panel lateral con:
  - Nombre de la atracción
  - Tipo (Museum, Park, Restaurant, etc.)
  - Descripción generada por la IA
- Al hacer clic en una tarjeta, el mapa hace zoom a esa ubicación

### 4. Paginación Inteligente
- El botón "Load More Results" aparece después de la primera búsqueda
- Al presionarlo:
  - Se recopilan los nombres de todas las atracciones ya mostradas
  - Se envían al backend en el campo `exclude`
  - El prompt se modifica para excluir esos lugares
  - Se generan 5 nuevas sugerencias diferentes
  - Los nuevos resultados se **agregan** a los existentes (no los reemplazan)

### 5. Manejo de Errores
- **JSON inválido**: Si Llama 3.2 retorna texto en lugar de JSON, se limpia automáticamente
- **Objeto único**: Si retorna un solo objeto en lugar de array, se convierte a array
- **Conexión fallida**: Si Ollama no está disponible, se muestra error HTTP 503
- **Timeout**: Configurado a 60 segundos para generaciones largas

## 🎯 Ejemplos de Uso

### Caso 1: Ruta México - Cancún
**Origen**: Ciudad de México (19.4326, -99.1332)  
**Destino**: Cancún (21.1619, -86.8515)

**Sugerencias esperadas:**
- Zona Arqueológica de Teotihuacán
- Pueblo Mágico de Valladolid
- Cenote Ik Kil
- Chichén Itzá
- Tulum

### Caso 2: Ruta París - Londres
**Origen**: París (48.8566, 2.3522)  
**Destino**: Londres (51.5074, -0.1278)

**Sugerencias esperadas:**
- Château de Versailles
- Rouen Cathedral
- Mont Saint-Michel
- Canterbury Cathedral
- Dover Castle

### Caso 3: Paginación
1. Primera búsqueda: 5 atracciones
2. Click en "Load More Results"
3. Segunda búsqueda: 5 atracciones **diferentes** (excluye las primeras 5)
4. Total visible: 10 atracciones

## 🏛️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                Frontend (Browser)                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Leaflet Map + Sidebar UI                        │  │
│  │  • Click handlers para selección de puntos       │  │
│  │  • Reverse geocoding (Nominatim)                 │  │
│  │  • Renderizado de resultados                     │  │
│  │  • Paginación (Load More)                        │  │
│  └────────────────┬─────────────────────────────────┘  │
└───────────────────┼────────────────────────────────────┘
                    │ HTTP POST /api/suggest
                    │
┌───────────────────▼────────────────────────────────────┐
│              FastAPI Backend (main.py)                  │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Endpoint: POST /api/suggest                     │ │
│  │  • Recibe start, end, exclude                    │ │
│  │  • Valida con Pydantic                           │ │
│  └────────────────┬─────────────────────────────────┘ │
│                   │                                     │
│  ┌────────────────▼─────────────────────────────────┐ │
│  │  OllamaService                                   │ │
│  │  • Construye prompt estructurado                 │ │
│  │  • Añade exclusiones si existen                  │ │
│  │  • Llama a Ollama API                            │ │
│  │  • Parsea y valida JSON                          │ │
│  │  • Maneja errores de formato                     │ │
│  └────────────────┬─────────────────────────────────┘ │
└───────────────────┼────────────────────────────────────┘
                    │ HTTP POST
                    │
┌───────────────────▼────────────────────────────────────┐
│           Ollama Server (localhost:11434)               │
│  ┌──────────────────────────────────────────────────┐ │
│  │  Llama 3.2 Model                                 │ │
│  │  • Procesa prompt                                │ │
│  │  • Genera sugerencias turísticas                 │ │
│  │  • Retorna JSON con atracciones                  │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario selecciona puntos** → Frontend captura coordenadas
2. **Geocodificación** → Nominatim retorna nombres de lugares
3. **Click en "Find Hidden Gems"** → POST a `/api/suggest`
4. **Backend construye prompt** → Incluye coordenadas y exclusiones
5. **Ollama genera respuesta** → Llama 3.2 procesa el prompt
6. **Backend parsea JSON** → Valida y limpia la respuesta
7. **Frontend renderiza** → Muestra marcadores y tarjetas
8. **"Load More"** → Repite el proceso con lista de exclusión

## 📊 Rendimiento

- **Tiempo de respuesta de Ollama**: 5-15 segundos (depende del hardware)
- **Tiempo de geocodificación**: ~200-500ms por punto
- **Renderizado de mapa**: Instantáneo (Leaflet es muy eficiente)
- **Memoria RAM requerida**: 
  - Backend: ~200MB
  - Ollama + Llama 3.2: ~4-8GB
- **Requisitos de GPU**: Opcional (acelera Ollama significativamente)

## ⚠️ Solución de Problemas

### Error: `Could not connect to local AI service. Is Ollama running?`

**Causa**: Ollama no está ejecutándose o no está en el puerto 11434.

**Solución**:
```bash
# Verifica que Ollama esté corriendo
ollama serve

# En otra terminal, verifica que el modelo esté disponible
ollama list
```

### Error: `AI returned invalid data format`

**Causa**: Llama 3.2 retornó texto que no es JSON válido.

**Solución**: 
- Esto es normal ocasionalmente con LLMs
- El sistema intenta limpiar automáticamente el texto
- Si persiste, intenta reformular la búsqueda o reiniciar Ollama

### El mapa no carga

**Causa**: Problema de conexión con los tiles de CartoDB.

**Solución**:
- Verifica tu conexión a internet
- Los tiles se cargan desde `https://basemaps.cartocdn.com`

### La geocodificación no funciona

**Causa**: Nominatim (OpenStreetMap) no responde.

**Solución**:
- Verifica tu conexión a internet
- Nominatim tiene límites de tasa (1 request/segundo)
- Si falla, se mostrarán coordenadas en lugar de nombres

### Ollama es muy lento

**Soluciones**:
- **Usa GPU**: Ollama detecta automáticamente CUDA/Metal
- **Reduce el modelo**: Prueba con `llama3.2:1b` (más rápido, menos preciso)
- **Aumenta RAM**: Asegúrate de tener al menos 8GB disponibles

## 🎨 Personalización

### Cambiar el Modelo de IA

Edita `main.py`:
```python
llm_service = OllamaService(
    model="llama3.2",  # Cambia a "mistral", "phi3", etc.
    host="http://localhost:11434"
)
```

### Cambiar el Estilo del Mapa

Edita `static/js/app.js`:
```javascript
// Opciones de tiles:
// Dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
// Light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
// Voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
```

### Ajustar Número de Resultados

Edita el prompt en `main.py`:
```python
prompt = f"""
...
Suggest 10 interesting tourist attractions...  # Cambia de 5 a 10
...
"""
```

## 🔒 Consideraciones de Seguridad

- ⚠️ **CORS habilitado**: Permite todas las origins (`*`)
- ⚠️ **Sin autenticación**: Los endpoints son públicos
- ✅ **Validación de entrada**: Implementada con Pydantic
- ✅ **Sin almacenamiento de datos**: No se guardan búsquedas
- ⚠️ **Ollama local**: Asegúrate de que solo sea accesible localmente

> **Nota**: Para producción, implementa autenticación, restringe CORS y considera usar HTTPS.

## 🚀 Mejoras Futuras

- [ ] Soporte para rutas (no solo dos puntos)
- [ ] Filtros por tipo de atracción (museos, parques, restaurantes)
- [ ] Guardar búsquedas favoritas
- [ ] Exportar itinerario a PDF
- [ ] Integración con APIs de reseñas (TripAdvisor, Google Places)
- [ ] Modo offline completo
- [ ] Soporte multiidioma

## 📄 Licencia

---

**¿Preguntas o problemas?** Abre un issue o consulta la [documentación de Ollama](https://ollama.com/docs).