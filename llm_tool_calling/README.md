# Retail AI Agent - Local LLM Tool Calling

Este proyecto implementa un agente de IA para Retail utilizando **Llama 3.2** (vía Ollama) y **Python**. Demuestra el patrón de arquitectura **Tool Calling** (Function Calling), donde el LLM actúa como orquestador de lógica de negocio.

## 📸 Evidencias
- [Ver ejemplos de uso V1](./evidencias_v1.md)
- [Ver ejemplos de uso V2](./evidencias_v2.md)

## 📚 Conceptos Clave

Para una explicación detallada de cómo funciona el Tool Calling desde la perspectiva de un desarrollador de software tradicional (Java/.NET), consulta:
👉 **[CONCEPTOS_PARA_DEVS](./CONCEPTOS_TOOL_CALLING.md)**

## 🛠️ Tecnologías Utilizadas

### 💻 Entorno de Desarrollo IDE
  - **Antigravity**
  - **Modelo** Gemini 3 Pro(High)

### Lenguaje de Programación
- **Python 3.x**

### 🧠 Inteligencia Artificial
- **Modelo**: Llama 3.2 (ejecutado localmente vía Ollama)

## 🛠️ Instalación y Ejecución

### 🚀 Requisitos

-   **Python 3.8+**
-   **Ollama** instalado y ejecutándose
-   **Modelo llama3.2** descargado en Ollama

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
cd llm_tool_calling
```

(Opcional) Crea y activa un entorno virtual:
```bash
python -m venv venv

# En Windows:
.\venv\Scripts\activate

# En macOS/Linux:
source venv/bin/activate
```

Insta las dependencias:
```bash
pip install -r requirements.txt
```

### 3. Ejecutar la Aplicación

```bash
python main.py
```

## 🧪 Casos de Uso Implementados

1.  **Consulta de Stock**: "Necesito verificar el stock de la laptop-001". (Invoca `InventoryService`).
2.  **Consulta de Atributos**: "¿Cuál es el precio del phone-002?". (Invoca `InventoryService`).
3.  **Pregunta General**: "¿Qué opinas del retail?". (Respuesta directa del LLM, sin herramientas).

## 🔍 Observaciones Técnicas

### Comportamiento del LLM
El modelo Llama 3.2 demostró:
- Excelente capacidad para identificar cuándo necesita información externa
- Correcta extracción de parámetros de las preguntas del usuario
- Buena integración de los resultados de las tools en respuestas naturales
- Capacidad de distinguir entre preguntas que requieren tools y las que no

### Ventajas del Approach
1. **Separación de responsabilidades**: El LLM decide cuándo llamar a tools
2. **Flexibilidad**: Fácil agregar nuevas tools al sistema
3. **Transparencia**: El sistema muestra claramente cuándo se llama a una tool
4. **Escalabilidad**: El patrón se puede extender a múltiples tools

## 🎯 Conclusiones

El proyecto demuestra exitosamente:
1. Implementación de function calling con Llama 3.2 (Ollama)
2. Creación de una tool personalizada para la vertical de Retail
3. Manejo correcto de casos que requieren y no requieren tools
4. Integración fluida entre el LLM y funciones Python