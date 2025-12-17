# Google AI Studio App - Tool Calling Demo (Refactored)

Este proyecto ha sido refactorizado para utilizar una arquitectura **Frontend - Backend**, migrando la lógica de herramientas de IA a un backend con Python, utilizando **Groq** y **Llama 3.3**.

## 🏗️ Nueva Estructura

- **`frontend/`**: Aplicación React (Vite) original.
- **`backend/`**: Servidor FastAPI con Python.

## 🛠️ Requisitos

- Python 3.8+
- Node.js 16+
- Una **API Key de Groq**. Obtenla en [console.groq.com](https://console.groq.com).

## 🚀 Cómo Ejecutar

### 1. Configurar Backend (Python)

1.  Navega a la carpeta backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configura las variables de entorno:
    *   Renombra el archivo `.env.example` a `.env`.
    *   Edita `.env` y coloca tu API Key de Groq:
        ```bash
        GROQ_API_KEY=gsk_tukey...
        ```
4.  Inicia el servidor:
    ```bash
    python main.py
    ```
    *El servidor iniciará en http://localhost:8000*

### 2. Iniciar el Frontend (React)

En una nueva terminal:

```bash
cd frontend
npm install
npm run dev
```
*La aplicación abrirá en http://localhost:5173*

## 🧠 Lógica de AI y Tools

La lógica que anteriormente residía en servicios de frontend ha sido migrada a `backend/main.py`.

- **Endpoint `/chat`**: Utiliza el cliente de **Groq** con el modelo `llama-3.3-70b-versatile` para procesar el lenguaje natural.
- **Tool Calling**: El modelo decide cuándo invocar la función `consultar_reportes`. El backend ejecuta esta función y devuelve los datos reales al modelo para generar la respuesta final.
- **Endpoint `/upload`**: Maneja la carga y validación de archivos, actuando como la fuente de verdad (Source of Truth) para el estado de los reportes.

## 📝 Notas Relevantes

- **Persistencia**: La base de datos de reportes es **en memoria** (`REPORTS_DB`). Se reinicia si detienes el backend.
- **Validación**: El backend valida estrictamente nombre, fecha y contenido de los archivos de reporte.
- **Seguridad**: El archivo `.env` está ignorado en git para proteger tu API Key.