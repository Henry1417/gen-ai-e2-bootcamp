# Support Ticket Embeddings Search

Una aplicación de búsqueda semántica de tickets de soporte utilizando **embeddings** y **sentence-transformers**. Encuentra tickets similares basándose en el significado del texto, no solo en palabras clave.

## 🌟 Características

- **Búsqueda Semántica**: Utiliza embeddings para encontrar tickets similares por significado
- **Mock Data Generator**: Genera tickets de soporte simulados para pruebas
- **API RESTful**: Backend construido con FastAPI
- **Interfaz Premium**: Diseño glassmorphic moderno con animaciones
- **Modelo Pre-entrenado**: Usa `all-MiniLM-L6-v2` de Sentence Transformers
- **Búsqueda Rápida**: Cosine similarity para resultados precisos

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
    "category": "Technical",
    "score": 0.95
  },
  ...
]
```

## 🎨 Características de Diseño

- **Glassmorphism**: Efectos de vidrio esmerilado en las tarjetas
- **Gradientes Animados**: Blobs de fondo con movimiento suave
- **Tema Oscuro Premium**: Paleta de colores cuidadosamente seleccionada
- **Animaciones Fluidas**: Transiciones y micro-interacciones
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Tipografía Moderna**: Google Fonts (Outfit)

## 🛠️ Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework web moderno y rápido
- **Sentence Transformers**: Generación de embeddings
- **PyTorch**: Backend para el modelo de ML
- **Scikit-learn**: Utilidades para cálculos de similitud
- **Uvicorn**: Servidor ASGI

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con glassmorphism
- **Vanilla JavaScript**: Sin dependencias adicionales
- **Fetch API**: Comunicación con el backend

### Machine Learning
- **Modelo**: `all-MiniLM-L6-v2`
- **Técnica**: Sentence embeddings con cosine similarity
- **Dimensión**: 384 dimensiones por embedding

## 🔧 Cómo Funciona

1. **Generación de Embeddings**: Al iniciar, el servidor carga todos los tickets y genera embeddings para cada uno (combinando subject + description)

2. **Búsqueda**: Cuando el usuario ingresa una consulta:
   - Se genera un embedding para la consulta
   - Se calcula la similitud coseno con todos los tickets
   - Se devuelven los top-k tickets más similares

3. **Scoring**: Cada resultado incluye un score de similitud (0-1), donde 1 es idéntico

## 📝 Categorías de Tickets

Los tickets generados incluyen las siguientes categorías:

- **Technical**: Problemas técnicos (login, crashes, performance)
- **Billing**: Problemas de facturación y pagos
- **Account**: Gestión de cuenta de usuario
- **Feature Request**: Solicitudes de nuevas funcionalidades

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

## 🎯 Ejemplos de Búsqueda

Prueba estas consultas para ver la búsqueda semántica en acción:

- "My internet is slow" → Encontrará tickets sobre performance
- "I need a refund" → Encontrará tickets de billing
- "Can't access my profile" → Encontrará tickets de account/login
- "Add support for mobile" → Encontrará feature requests

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

Desarrollado con ❤️ usando FastAPI, Sentence Transformers y Vanilla JS
