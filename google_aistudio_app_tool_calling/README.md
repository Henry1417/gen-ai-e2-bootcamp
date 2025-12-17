# Google AI Studio App - Tool Calling Demo (Refactored)

Este proyecto ha sido refactorizado para utilizar una arquitectura **Frontend - Backend**, migrando la lógica de herramientas de IA a un backend con Python y Llama 3.2.

## 🏗️ Nueva Estructura

- **`frontend/`**: Aplicación React (Vite) original.
- **`backend/`**: Servidor FastAPI con Python.

## 🛠️ Requisitos

- Python 3.8+
- Node.js 16+
- Ollama corriendo localmente con el modelo `llama3.2`.

## 🚀 Cómo Ejecutar

### 1. Iniciar el Backend (Python)

```bash
cd backend
pip install -r requirements.txt
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

La lógica que anteriormente residía en `geminiService.ts` ha sido migrada a `backend/main.py`.

- **Endpoint `/chat`**: Recibe mensajes del usuario y consulta a Ollama.
- **Tool `consultar_reportes`**: Implementada en Python, consulta el estado de reportes en memoria (`REPORTS_DB`).
- **Endpoint `/upload`**: Maneja la carga y validación de archivos, actualizando el estado de los reportes en el backend.

## 📝 Notas sobre la Simulación

- La base de datos de reportes es **en memoria** en el backend. Se reinicia si detienes el proceso de Python.
- Al iniciar, el backend genera reportes "PENDING" para la fecha actual.
- Puedes usar las plantillas del frontend para generar archivos válidos y probar la carga.