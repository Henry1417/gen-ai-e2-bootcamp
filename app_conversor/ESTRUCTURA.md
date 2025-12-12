# Estructura del Proyecto - Unit Converter

```
app_conversor/
│
├── 📄 README.md                    # Documentación completa del proyecto
├── 📄 INICIO_RAPIDO.md            # Guía de inicio rápido
├── 📄 INSTRUCCIONES.md            # Instrucciones detalladas de instalación
├── 📄 .gitignore                  # Archivos a ignorar en Git
│
├── 🐍 BACKEND (FastAPI)
│   ├── main.py                    # Aplicación FastAPI principal
│   ├── converters.py              # Funciones de conversión de unidades
│   ├── requirements.txt           # Dependencias de Python
│   └── test_converters.py         # Tests unitarios
│
└── ⚛️ FRONTEND (React + Vite)
    └── frontend/
        ├── 📄 package.json        # Dependencias de Node.js
        ├── 📄 vite.config.js      # Configuración de Vite
        ├── 📄 index.html          # HTML principal
        ├── 📄 install.ps1         # Script de instalación
        ├── 📄 .env.example        # Ejemplo de variables de entorno
        │
        └── src/
            ├── main.jsx           # Punto de entrada de React
            ├── App.jsx            # Componente principal
            ├── App.css            # Estilos del componente principal
            ├── index.css          # Estilos globales y sistema de diseño
            │
            └── components/
                ├── Header.jsx              # Componente de encabezado
                ├── Header.css              # Estilos del encabezado
                ├── ConversionCard.jsx      # Tarjeta de conversión
                ├── ConversionCard.css      # Estilos de la tarjeta
                ├── HistoryPanel.jsx        # Panel de historial
                └── HistoryPanel.css        # Estilos del panel
```

## 📊 Estadísticas del Proyecto

- **Archivos de Python**: 3 (main.py, converters.py, test_converters.py)
- **Componentes de React**: 3 (Header, ConversionCard, HistoryPanel)
- **Archivos de CSS**: 4 (index.css, App.css, Header.css, ConversionCard.css, HistoryPanel.css)
- **Conversiones soportadas**: 14 tipos diferentes
- **Líneas de código (aprox)**: ~1,500 líneas

## 🎨 Características del Diseño

### Sistema de Colores
- **Fondo primario**: #0f0f23 (Azul oscuro profundo)
- **Fondo secundario**: #1a1a2e (Azul oscuro)
- **Gradiente principal**: Púrpura (#667eea) → Violeta (#764ba2)
- **Gradientes por categoría**:
  - Temperatura: Rosa → Rojo
  - Distancia: Azul claro → Cian
  - Peso: Verde → Verde agua
  - Volumen: Rosa → Amarillo

### Efectos Visuales
- ✨ Glassmorphism (efecto de vidrio esmerilado)
- 🌈 Gradientes vibrantes
- 💫 Animaciones suaves
- 🎯 Micro-interacciones
- 📱 Diseño responsive

## 🔧 Tecnologías Utilizadas

### Backend
- **FastAPI** 0.104.1 - Framework web moderno
- **Uvicorn** 0.24.0 - Servidor ASGI
- **Pydantic** 2.5.0 - Validación de datos

### Frontend
- **React** 18.2.0 - Biblioteca de UI
- **Vite** 5.0.0 - Build tool
- **Axios** 1.6.2 - Cliente HTTP

## 📝 Mejores Prácticas Implementadas

### Python
✅ Type hints en todas las funciones
✅ Docstrings detallados (Google style)
✅ Separación de responsabilidades
✅ Validación con Pydantic
✅ Manejo de errores robusto
✅ Tests unitarios con pytest
✅ Código DRY (Don't Repeat Yourself)
✅ Constantes bien definidas

### React
✅ Componentes funcionales con hooks
✅ Separación de componentes reutilizables
✅ Props bien tipadas
✅ Manejo de estado apropiado
✅ Persistencia con localStorage
✅ Manejo de errores y loading states
✅ CSS modular
✅ Responsive design
✅ Accesibilidad (semántica HTML)

### General
✅ Documentación completa
✅ README detallado
✅ Guías de inicio rápido
✅ Comentarios útiles
✅ Nombres descriptivos
✅ Estructura de carpetas clara
✅ Gitignore apropiado

## 🚀 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información de la API |
| GET | `/api/conversions` | Lista de conversiones disponibles |
| POST | `/api/convert` | Realizar una conversión |
| GET | `/docs` | Documentación interactiva (Swagger) |

## 🎯 Conversiones Disponibles

### Temperatura (2)
- Celsius → Fahrenheit
- Fahrenheit → Celsius

### Distancia (6)
- Millas → Kilómetros
- Kilómetros → Millas
- Pies → Metros
- Metros → Pies
- Pulgadas → Centímetros
- Centímetros → Pulgadas

### Peso (4)
- Libras → Kilogramos
- Kilogramos → Libras
- Onzas → Gramos
- Gramos → Onzas

### Volumen (2)
- Galones → Litros
- Litros → Galones

**Total: 14 conversiones bidireccionales**
