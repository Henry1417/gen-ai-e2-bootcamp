# Guía de Inicio Rápido

## ⚠️ Solución de Problemas Comunes

### Error de Política de Ejecución de PowerShell

Si recibes un error como "la ejecución de scripts está deshabilitada", ejecuta este comando en PowerShell como Administrador:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🚀 Inicio Rápido

### Paso 1: Instalar Python (si no lo tienes)

1. Descarga Python desde: https://www.python.org/downloads/
2. Durante la instalación, **marca la casilla "Add Python to PATH"**
3. Reinicia tu terminal

### Paso 2: Instalar Node.js (si no lo tienes)

1. Descarga Node.js desde: https://nodejs.org/
2. Instala la versión LTS recomendada
3. Reinicia tu terminal

### Paso 3: Instalar Dependencias del Backend

```powershell
# Navega a la carpeta del proyecto
cd app_conversor

# Instala las dependencias de Python
python -m pip install -r requirements.txt
```

### Paso 4: Instalar Dependencias del Frontend

```powershell
# Navega a la carpeta del frontend
cd frontend

# Opción 1: Usar el script de instalación
.\install.ps1

# Opción 2: Instalar manualmente
npm install
```

### Paso 5: Ejecutar la Aplicación

#### Opción A: Modo Desarrollo (Recomendado para desarrollo)

**Terminal 1 - Backend:**
```powershell
# Desde la carpeta app_conversor
python main.py
```

**Terminal 2 - Frontend:**
```powershell
# Desde la carpeta app_conversor/frontend
npm run dev
```

Luego abre tu navegador en: http://localhost:3000

#### Opción B: Modo Producción

```powershell
# Compilar el frontend
cd frontend
npm run build

# Volver a la carpeta raíz y ejecutar el backend
cd ..
python main.py
```

Luego abre tu navegador en: http://localhost:8000

## 📚 Recursos Adicionales

- **Documentación de la API**: http://localhost:8000/docs (cuando el backend esté corriendo)
- **README completo**: Ver `README.md`
- **Instrucciones detalladas**: Ver `INSTRUCCIONES.md`

## ✅ Verificar que Todo Funciona

1. Backend corriendo: Visita http://localhost:8000 - deberías ver un mensaje JSON
2. Frontend corriendo: Visita http://localhost:3000 - deberías ver la interfaz de la aplicación
3. API funcionando: Visita http://localhost:8000/docs - deberías ver la documentación interactiva

## 🎯 Características de la Aplicación

- ✨ Conversión de temperatura (Celsius ↔ Fahrenheit)
- 📏 Conversión de distancia (Millas ↔ Kilómetros, Pies ↔ Metros, Pulgadas ↔ Centímetros)
- ⚖️ Conversión de peso (Libras ↔ Kilogramos, Onzas ↔ Gramos)
- 🧪 Conversión de volumen (Galones ↔ Litros)
- 📜 Historial de conversiones (guardado localmente)
- 🎨 Interfaz moderna con diseño premium

## 🐛 ¿Problemas?

Si encuentras algún problema, consulta la sección "Solución de Problemas" en `INSTRUCCIONES.md`
