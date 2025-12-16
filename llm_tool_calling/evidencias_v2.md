# Evidencias de Ejecución - Retail AI Agent

## 📸 Trazas de Ejecución (Logs del Sistema)

A continuación se muestra la salida real de la consola al ejecutar el sistema refactorizado con `main.py`.

### Caso 1: Consulta de Stock (Tool Call Exitoso)

**Usuario**: "Necesito verificar el stock de la laptop-001"

```log
💬 USER: Necesito verificar el stock de la laptop-001

⚡ [LLM DECISION] Ejecutar: get_product_details con args {'product_id': 'laptop-001'}
   ⚙️ [SERVICE] Consultando DB para ID: laptop-001...
   
🤖 AI: Actualmente tenemos 15 unidades en stock de la Laptop Dell XPS 15 (ID: laptop-001).
```

---

### Caso 2: Consulta Compleja (Tool Call Exitoso)

**Usuario**: "¿Cuál es el precio del phone-002 y dónde está guardado?"

```log
💬 USER: ¿Cuál es el precio del phone-002 y dónde está guardado?

⚡ [LLM DECISION] Ejecutar: get_product_details con args {'product_id': 'phone-002'}
   ⚙️ [SERVICE] Consultando DB para ID: phone-002...

🤖 AI: El iPhone 15 Pro (phone-002) tiene un precio de $999.99 y se encuentra ubicado en A-1.
```

---

### Caso 3: Pregunta General (Sin Tool Call)

**Usuario**: "¿Qué opinas sobre el futuro del retail?"

```log
💬 USER: ¿Qué opinas sobre el futuro del retail?

🤖 AI: El futuro del retail parece dirigirse hacia una integración híbrida, donde la experiencia física y digital se fusionan (phygital). La personalización impulsada por IA y la automatización de la cadena de suministro serán clave.
```

## ✅ Validación Técnica

El sistema demuestra correctamente el patrón de **Tool Calling**:

1.  **Detección de Intención**: El modelo identifica correctamente cuándo necesita datos externos (Casos 1 y 2) y cuándo no (Caso 3).
2.  **Extracción de Parámetros**: Extrae correctamente los IDs (`laptop-001`, `phone-002`) del lenguaje natural.
3.  **Inyección de Dependencias**: El `InventoryService` es invocado dinámicamente sin que el LLM conozca su implementación interna.
