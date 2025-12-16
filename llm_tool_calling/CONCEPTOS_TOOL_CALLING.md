# 🧠 Tool Calling: Guía Técnica para Desarrolladores

## ¿Qué es Tool Calling?

En términos de arquitectura de software, **Tool Calling** convierte al LLM en un **Motor de Decisión** en tiempo de ejecución.

Imagina que el LLM es un **Controlador Frontal** que recibe peticiones en lenguaje natural. En lugar de procesar todo por sí mismo (alucinando datos), tiene acceso a una lista de **interfaces** (firmas de funciones).

## 🏗️ Arquitectura (Clean Code)

El código ha sido refactorizado siguiendo principios SOLID y patrones comunes en desarrollo Enterprise (similar a Java/Spring):

-   **`InventoryService` (Service Layer)**: Encapsula la lógica de negocio y acceso a datos. Es la única capa que "conoce" el inventario.
-   **`LLMAgent` (Controller/Orchestrator)**: Gestiona el ciclo de vida de la conversación y el "Dynamic Dispatch" de herramientas. Actúa como puente entre el lenguaje natural y el código ejecutable.
-   **`INVENTORY_MOCK` (Data Layer)**: Simulación de base de datos en memoria.

### Flujo de Ejecución (Analogy: Try-Catch-Recover)

1.  **Intention Analysis**: El LLM recibe el input.
2.  **Signature Matching**: Evalúa si el input requiere alguna de las "herramientas" registradas (similar a buscar un `Bean` que implemente una interfaz).
3.  **Structured Output (JSON)**: Si hay match, el LLM **PAUSA** la generación de texto y retorna un objeto JSON estructurado:
    ```json
    { "function": "getInventory", "args": { "id": "123" } }
    ```
4.  **Callback / Execution**: Tu código (Python/Java) intercepta este JSON, ejecuta la función real (BD, API, Cálculos) y obtiene un resultado.
5.  **Context Injection**: Inyectas el resultado de la función nuevamente al historial del chat.
6.  **Final Response**: El LLM recibe el dato real y genera la respuesta final en lenguaje natural.

---

## Diferencias Clave

| Concepto Clásico | Tool Calling (LLM) |
| :--- | :--- |
| **Invocación** | Explícita (`obj.method()`) | **Semántica** (El LLM decide cuándo llamar basado en el significado). |
| **Argumentos** | Tipados y posicionales definidos en compilación | Inferidos dinámicamente del contexto de la conversación. |
| **Flujo** | Imperativo (Tú controlas el flujo) | Declarativo (Tú ofreces las herramientas, el modelo orquesta). |

## ¿Por qué Python para esto?

Aunque Java es robusto, Python domina en IA por su manejo de diccionarios y JSON como ciudadanos de primera clase (similar a `Map<String, Object>` pero con sintaxis nativa), lo que facilita enormemente el manejo de los payloads dinámicos de los LLMs.

## Glosario Rápido del Código Refactorizado

-   **Type Hints (`List[Dict]`)**: El equivalente a Generics en Java. Ayuda al IDE y linters.
-   **Docstrings**: Javadoc. Es crucial porque el LLM **LEE** esta documentación para saber qué hace la función.
-   **Pydantic** (opcional pero común): Sería el equivalente a Lombok + Hibernate Validator.
