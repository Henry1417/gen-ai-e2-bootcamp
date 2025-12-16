# Support Ticket Embeddings Search

### Descripción
Esta Aplicación **clasifica/busca automáticamente tickets de soporte** utilizando **embeddings** y **sentence-transformers**.
Clasifica/Encuentra tickets similares basándose en el significado del texto, no solo en palabras clave.

### 📸 Evidencias
- [Ver capturas de pantalla y ejemplos de uso](./evidencias.md)


## 🌟 Características Principales

- 🤖 **Clasificación Automática**: Usa embeddings para categorizar tickets en 14 categorías diferentes
- 🔍 **Búsqueda Semántica**: Encuentra tickets similares por significado, no solo palabras clave
- 🔍 **Búsqueda Rápida**: Cosine similarity para resultados precisos
- ✏️ **Edición en Línea**: Modifica subject y description antes de guardar
- 💾 **Persistencia**: Guarda tickets clasificados en JSON
- 🔄 **Re-clasificación**: Permite reclasificar tickets con información actualizada
- 🤖 **Mock Data Generator**: Genera tickets de soporte simulados para pruebas
  - **Categorías de Tickets**: El sistema clasifica tickets en las siguientes categorías:
    - Network Issues
    - Security
    - Performance
    - Database
    - Integration
    - UI/UX
    - Hardware
    - Software Bug
    - Data Loss
    - Authentication
    - Billing
    - Account Management
    - Feature Request
    - Configuration

## 🛠️ Tecnologías Utilizadas

### 💻 Entorno de Desarrollo IDE
  - **Antigravity**
  - **Modelo** Claude Sonnet 4.5

### 🔌 Backend
- **FastAPI**: Framework web moderno y rápido
- **Sentence Transformers**: Generación de embeddings
- **PyTorch**: Backend para el modelo de ML
- **Scikit-learn**: Utilidades para cálculos de similitud
- **Uvicorn**: Servidor ASGI

### 🎨 Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con glassmorphism con animaciones
- **Vanilla JavaScript**: Sin dependencias adicionales
- **Fetch API**: Comunicación con el backend
  
  #### 🎨 Características de Diseño
  - **Glassmorphism**: Efectos de vidrio esmerilado en las tarjetas
  - **Gradientes Animados**: Blobs de fondo con movimiento suave
  - **Tema Oscuro Premium**: Paleta de colores cuidadosamente seleccionada
  - **Animaciones Fluidas**: Transiciones y micro-interacciones
  - **Responsive**: Diseño adaptable a todos los dispositivos
  - **Tipografía Moderna**: Google Fonts (Outfit)

### 🧠 Machine Learning - Modelo Pre-entrenado
- **Modelo**: `all-MiniLM-L6-v2` para embeddings semánticos de Sentence Transformers
- **Técnica**: Sentence embeddings con cosine similarity
- **Dimensión**: 384 dimensiones por embedding

## 🏗️ Estructura del Proyecto

```
embeddings_app_antigravity/
├── main.py              # Aplicación FastAPI principal
├── core.py              # Motor de búsqueda con embeddings
├── data_gen.py          # Generador de tickets mock
├── requirements.txt     # Dependencias de Python
├── tickets.json         # Datos de tickets (generado)
├── static/
│   ├── index.html       # Interfaz principal
│   ├── style.css        # Estilos glassmorphic
│   └── script.js        # Lógica del frontend
└── README.md
```

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias

**Nota importante**: Si encuentras errores de `AssertionError` durante la instalación, primero actualiza pip:

```bash
pip install --upgrade pip
```

Luego instala las dependencias:

```bash
cd embeddings_app_antigravity
pip install -r requirements.txt
```

### 2. Generar Datos Mock

Genera los tickets de soporte simulados:

```bash
python data_gen.py
```

Esto creará un archivo `tickets.json` con 50 tickets de ejemplo.

### 3. Ejecutar el Servidor

Inicia la aplicación FastAPI:

```bash
python main.py
```

O usando uvicorn directamente:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en:
- **Aplicación**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📡 API Endpoints

### `POST /api/classify`

Clasifica un nuevo ticket usando embeddings y retorna tickets similares.

**Request Body:**
```json
{
  "subject": "Cannot login to my account",
  "description": "I've been trying to access my account for the past hour but keep getting an error message"
}
```

**Respuesta:**
```json
{
  "category": "Authentication",
  "confidence": 0.87,
  "suggestions": [
    {
      "category": "Authentication",
      "confidence": 0.87
    },
    {
      "category": "Account Management",
      "confidence": 0.65
    },
    {
      "category": "Security",
      "confidence": 0.52
    }
  ],
  "similar_tickets": [
    {
      "id": 1,
      "subject": "Password reset link not working",
      "description": "User is reporting: Password reset link not working...",
      "category": "Authentication",
      "score": 0.82
    }
  ]
}
```

### `POST /api/search`

Busca tickets similares usando embeddings.

**Request Body:**
```json
{
  "query": "Cannot login to my account",
  "limit": 5
}
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "subject": "Cannot login to my account",
    "description": "User is reporting: Cannot login to my account...",
    "category": "Authentication",
    "score": 0.95
  },
  {
    "id": 7,
    "subject": "Password reset link not working",
    "description": "User is reporting: Password reset link not working...",
    "category": "Authentication",
    "score": 0.78
  }
]
```

### `POST /api/add-ticket`

Agrega un nuevo ticket al sistema y recalcula los embeddings.

**Request Body:**
```json
{
  "subject": "App crashes when uploading files",
  "description": "Every time I try to upload a file larger than 10MB, the application crashes",
  "category": "Software Bug"
}
```

**Respuesta:**
```json
{
  "id": 51,
  "subject": "App crashes when uploading files",
  "description": "Every time I try to upload a file larger than 10MB, the application crashes",
  "category": "Software Bug",
  "message": "Ticket added successfully"
}
```

## 🔧 Cómo Funciona

### 1. Generación de Embeddings
Al iniciar, el servidor:
- Carga todos los tickets desde `tickets.json`
- Genera embeddings para cada ticket (combinando subject + description)
- Pre-calcula embeddings para las 14 categorías disponibles

### 2. Clasificación de Tickets
Cuando el usuario ingresa un nuevo ticket:
- Se genera un embedding para el texto del ticket
- Se calcula la similitud coseno con los embeddings de las categorías
- Se retorna la categoría con mayor similitud y las top 3 sugerencias
- Se buscan automáticamente tickets similares

### 3. Búsqueda Semántica
Cuando el usuario busca tickets:
- Se genera un embedding para la consulta
- Se calcula la similitud coseno con todos los tickets existentes
- Se devuelven los top-k tickets más similares

### 4. Persistencia
Cuando se guarda un ticket:
- Se agrega al archivo `tickets.json`
- Se recalculan automáticamente todos los embeddings
- El ticket queda disponible para futuras búsquedas y clasificaciones

### 5. Scoring
- Cada resultado incluye un score de similitud (0-1)
- 1.0 = Idéntico
- 0.8-0.9 = Muy similar
- 0.6-0.7 = Similar
- < 0.6 = Poco similar

## � Funcionalidades de la Interfaz

### Tab "Classify Ticket"
1. **Formulario de Clasificación**:
   - Campos editables para Subject y Description
   - Botón "Classify Ticket" para clasificar

2. **Ticket Clasificado** (destacado en verde):
   - Badge "NEW TICKET - CLASSIFIED"
   - Muestra el % de confianza de la clasificación
   - Campos editables inline (contenteditable)
   - Categoría asignada con badge

3. **Sugerencias de Categorías**:
   - Top 3 categorías sugeridas con % de confianza
   - Click para cambiar la categoría

4. **Botones de Acción**:
   - **💾 Save Ticket**: Guarda el ticket en el sistema
   - **🔄 Re-classify**: Reclasifica con la información editada

5. **Tickets Similares**:
   - Lista de tickets similares encontrados
   - Ordenados por score de similitud

### Tab "Search Tickets"
1. **Búsqueda Independiente**:
   - Input de búsqueda
   - Resultados mostrados con % de match
   - No afecta ni se ve afectada por el tab de clasificación

## 📝 Categorías de Tickets

Los tickets se clasifican en 14 categorías especializadas:

## ⚠️ Solución de Problemas

### Error: `ModuleNotFoundError: No module named 'sentence_transformers'`

**Solución**: Asegúrate de haber instalado las dependencias:
```bash
pip install -r requirements.txt
```

### Error: `AssertionError` durante instalación

**Solución**: Actualiza pip antes de instalar:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Error: `File tickets.json not found`

**Solución**: Genera los datos primero:
```bash
python data_gen.py
```

### El modelo tarda en cargar

**Nota**: La primera vez que ejecutas la aplicación, el modelo `all-MiniLM-L6-v2` se descargará automáticamente (~90MB). Esto puede tomar unos minutos dependiendo de tu conexión.

## 🎯 Ejemplos de Uso

### Ejemplos de Clasificación

Prueba estos tickets para ver la clasificación automática:

| Subject | Description | Categoría Esperada |
|---------|-------------|-------------------|
| "Cannot connect to VPN" | "I'm unable to establish a VPN connection from home" | Network Issues |
| "Suspicious login from unknown location" | "I received an alert about a login attempt from another country" | Security |
| "Dashboard loads very slowly" | "The main dashboard takes more than 30 seconds to load" | Performance |
| "Database query timeout" | "Getting timeout errors when running reports" | Database |
| "Slack integration not syncing" | "Messages from Slack are not appearing in the app" | Integration |
| "Button is not visible on mobile" | "The submit button is cut off on iPhone screens" | UI/UX |
| "Printer won't connect" | "Cannot get the network printer to work with my laptop" | Hardware |
| "App crashes on submit" | "Application freezes and closes when I click submit" | Software Bug |
| "All my files disappeared" | "I can't find any of my uploaded documents" | Data Loss |
| "Password reset not working" | "The password reset email never arrives" | Authentication |
| "Charged twice this month" | "My credit card was billed two times for the same subscription" | Billing |
| "Need to change my email" | "How do I update my account email address?" | Account Management |
| "Add dark mode please" | "Would love to have a dark theme option" | Feature Request |
| "Time zone is wrong" | "The app shows times in the wrong timezone" | Configuration |

### Ejemplos de Búsqueda Semántica

Prueba estas consultas para ver la búsqueda semántica en acción:

- **"My internet is slow"** → Encontrará tickets sobre:
  - Performance issues
  - Network problems
  - Connection timeouts

- **"I need a refund"** → Encontrará tickets de:
  - Billing issues
  - Wrong charges
  - Subscription cancellations

- **"Can't access my profile"** → Encontrará tickets de:
  - Authentication problems
  - Login issues
  - Account access

- **"Add support for mobile"** → Encontrará:
  - Feature requests
  - Mobile app suggestions
  - UI/UX improvements

## 🏛️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                    │
│  ┌──────────────┐              ┌──────────────┐        │
│  │ Classify Tab │              │  Search Tab  │        │
│  └──────┬───────┘              └──────┬───────┘        │
│         │                              │                 │
└─────────┼──────────────────────────────┼─────────────────┘
          │                              │
          │ HTTP POST                    │ HTTP POST
          │                              │
┌─────────▼──────────────────────────────▼─────────────────┐
│                  FastAPI Backend                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Endpoints:                                        │ │
│  │  • POST /api/classify                              │ │
│  │  • POST /api/search                                │ │
│  │  • POST /api/add-ticket                            │ │
│  └────────────────┬───────────────────────────────────┘ │
│                   │                                      │
│  ┌────────────────▼───────────────────────────────────┐ │
│  │  TicketSearchEngine (core.py)                     │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │ • classify_ticket()                          │ │ │
│  │  │ • search()                                   │ │ │
│  │  │ • add_ticket()                               │ │ │
│  │  │ • compute_embeddings()                       │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────┬───────────────────────────────────┘ │
│                   │                                      │
└───────────────────┼──────────────────────────────────────┘
                    │
          ┌─────────▼──────────┐
          │ Sentence Transformers│
          │  all-MiniLM-L6-v2   │
          │   (384 dimensions)   │
          └─────────┬──────────┘
                    │
          ┌─────────▼──────────┐
          │   tickets.json      │
          │  (Persistent Data)  │
          └─────────────────────┘
```

### Flujo de Clasificación

1. Usuario ingresa Subject + Description
2. Frontend envía POST a `/api/classify`
3. Backend genera embedding del ticket
4. Calcula similitud con embeddings de categorías
5. Encuentra tickets similares
6. Retorna categoría + sugerencias + tickets similares
7. Usuario puede editar y guardar
8. POST a `/api/add-ticket` persiste el ticket
9. Embeddings se recalculan automáticamente

## 📊 Rendimiento

- **Tiempo de carga inicial**: ~10-15 segundos (descarga del modelo en primera ejecución)
- **Tiempo de clasificación**: ~100-200ms por ticket
- **Tiempo de búsqueda**: ~50-100ms para 50 tickets
- **Tamaño del modelo**: ~90MB (all-MiniLM-L6-v2)
- **Memoria RAM requerida**: ~500MB-1GB

## 🔒 Consideraciones de Seguridad

- ⚠️ **CORS habilitado**: Actualmente permite todas las origins (`*`)
- ⚠️ **Sin autenticación**: Los endpoints son públicos
- ⚠️ **Validación de entrada**: Implementada con Pydantic
- ✅ **Sin almacenamiento de datos sensibles**: Solo tickets de ejemplo

> **Nota**: Para producción, se recomienda implementar autenticación y restringir CORS.

## 📄 Licencia
