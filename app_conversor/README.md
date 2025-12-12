# Dia 4 - Ejercicio en IDE "Antigravity" - Unit Converter Application

Una aplicación moderna de conversión de unidades entre el sistema métrico e imperial, construida con **FastAPI** (backend) y **React** (frontend).

## 🌟 Características

- **Conversiones de Temperatura**: Celsius ↔ Fahrenheit
- **Conversiones de Distancia**: Millas ↔ Kilómetros, Pies ↔ Metros, Pulgadas ↔ Centímetros
- **Conversiones de Peso**: Libras ↔ Kilogramos, Onzas ↔ Gramos
- **Conversiones de Volumen**: Galones ↔ Litros
- **Historial de Conversiones**: Guarda las últimas 20 conversiones
- **Interfaz Premium**: Diseño moderno con glassmorphism y animaciones suaves
- **API RESTful**: Backend bien documentado con FastAPI
- **Validación de Datos**: Usando Pydantic para validación robusta

## 🏗️ Estructura del Proyecto

```
app_conversor/
├── backend/
│   ├── main.py              # Aplicación FastAPI principal
│   ├── converters.py        # Funciones de conversión
│   └── requirements.txt     # Dependencias de Python
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes de React
│   │   │   ├── Header.jsx
│   │   │   ├── ConversionCard.jsx
│   │   │   └── HistoryPanel.jsx
│   │   ├── App.jsx          # Componente principal
│   │   ├── App.css
│   │   ├── index.css        # Estilos globales
│   │   └── main.jsx         # Punto de entrada
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Instalación y Ejecución

### Backend (FastAPI)

1. **Instalar dependencias:**
   ```bash
   cd app_conversor
   pip install -r requirements.txt
   ```

2. **Ejecutar el servidor:**
   ```bash
   python main.py
   ```
   
   El servidor estará disponible en: `http://localhost:8000`
   
   Documentación interactiva (Swagger): `http://localhost:8000/docs`

### Frontend (React)

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   
   La aplicación estará disponible en: `http://localhost:3000`

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

## 📡 API Endpoints

### `GET /`
Información general de la API

### `GET /api/conversions`
Obtiene la lista de todas las conversiones disponibles

**Respuesta:**
```json
{
  "conversions": [
    {
      "type": "celsius_to_fahrenheit",
      "from_unit": "°C",
      "to_unit": "°F"
    },
    ...
  ]
}
```

### `POST /api/convert`
Realiza una conversión de unidades

**Request Body:**
```json
{
  "value": 100,
  "conversion_type": "celsius_to_fahrenheit"
}
```

**Respuesta:**
```json
{
  "original_value": 100,
  "converted_value": 212.0,
  "from_unit": "°C",
  "to_unit": "°F",
  "conversion_type": "celsius_to_fahrenheit"
}
```

## 🎨 Características de Diseño

- **Tema Oscuro Premium**: Colores cuidadosamente seleccionados
- **Glassmorphism**: Efectos de vidrio esmerilado en las tarjetas
- **Gradientes Vibrantes**: Diferentes gradientes por categoría
- **Animaciones Suaves**: Transiciones y micro-animaciones
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Tipografía Moderna**: Usando Google Fonts (Inter)

## 🛠️ Tecnologías Utilizadas

### Backend
- **FastAPI**: Framework web moderno y rápido
- **Pydantic**: Validación de datos
- **Uvicorn**: Servidor ASGI

### Frontend
- **React 18**: Biblioteca de UI
- **Vite**: Build tool y dev server
- **Axios**: Cliente HTTP
- **CSS Modules**: Estilos encapsulados

## 📝 Mejores Prácticas Implementadas

### Python/Backend
- ✅ Type hints en todas las funciones
- ✅ Docstrings detallados
- ✅ Separación de responsabilidades (main.py vs converters.py)
- ✅ Validación de entrada con Pydantic
- ✅ Manejo de errores apropiado
- ✅ CORS configurado correctamente
- ✅ Código DRY (Don't Repeat Yourself)

### React/Frontend
- ✅ Componentes funcionales con hooks
- ✅ Separación de componentes reutilizables
- ✅ Manejo de estado local apropiado
- ✅ Persistencia con localStorage
- ✅ Manejo de errores y estados de carga
- ✅ CSS modular y organizado
- ✅ Responsive design
- ✅ Accesibilidad (semántica HTML)

## 🔧 Configuración Adicional

### Variables de Entorno (Frontend)

Crear un archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:8000
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un issue en el repositorio.

---

Desarrollado con ❤️ usando FastAPI y React
