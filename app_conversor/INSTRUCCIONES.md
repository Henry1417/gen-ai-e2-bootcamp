# Instrucciones de Instalación y Ejecución

## Requisitos Previos

- **Python 3.8+** instalado en el sistema
- **Node.js 16+** y npm instalados

## Instalación

### 1. Backend (FastAPI)

Abrir una terminal en la carpeta `app_conversor`:

```powershell
# Instalar dependencias de Python
python -m pip install -r requirements.txt

# O si tienes pip directamente:
pip install -r requirements.txt
```

### 2. Frontend (React)

Abrir una terminal en la carpeta `app_conversor/frontend`:

```powershell
# Instalar dependencias de Node
npm install
```

## Ejecución

### Opción 1: Ejecutar Backend y Frontend por separado (Desarrollo)

#### Terminal 1 - Backend:
```powershell
cd app_conversor
python main.py
```

El backend estará disponible en: http://localhost:8000

#### Terminal 2 - Frontend:
```powershell
cd app_conversor/frontend
npm run dev
```

El frontend estará disponible en: http://localhost:3000

### Opción 2: Ejecutar todo junto (Producción)

#### Paso 1: Compilar el frontend
```powershell
cd app_conversor/frontend
npm run build
```

#### Paso 2: Ejecutar el backend (que servirá el frontend compilado)
```powershell
cd ..
python main.py
```

La aplicación completa estará disponible en: http://localhost:8000

## Verificación

### Verificar Backend
Visita: http://localhost:8000/docs para ver la documentación interactiva de la API

### Verificar Frontend
Visita: http://localhost:3000 (en modo desarrollo) o http://localhost:8000 (en modo producción)

## Solución de Problemas

### Python no encontrado
Si recibes un error de que Python no se encuentra:
1. Instala Python desde https://www.python.org/downloads/
2. Asegúrate de marcar "Add Python to PATH" durante la instalación
3. Reinicia la terminal

### npm no encontrado
Si recibes un error de que npm no se encuentra:
1. Instala Node.js desde https://nodejs.org/
2. Reinicia la terminal

### Puerto en uso
Si el puerto 8000 o 3000 ya está en uso:
- Para el backend, edita `main.py` y cambia el puerto en la línea `uvicorn.run(..., port=8000, ...)`
- Para el frontend, edita `vite.config.js` y cambia el puerto en `server.port`

## Ejecutar Tests

```powershell
# Instalar pytest si no está instalado
pip install pytest

# Ejecutar tests
pytest test_converters.py
```
