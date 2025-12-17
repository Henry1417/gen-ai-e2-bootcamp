# RegulaBank MX - Sistema de Reportes Regulatorios

**RegulaBank MX** es una simulación de alta fidelidad de una plataforma bancaria diseñada para la gestión, validación y envío de reportes regulatorios a entidades ficticias (como CNBV o Banxico). 

La aplicación se centra en la integridad de los datos, validando estrictamente la nomenclatura de archivos, la estructura de columnas y la consistencia de fechas antes de permitir un "envío" exitoso.

## 🚀 Características Principales

*   **Validación Estricta de Archivos:**
    *   Verificación de nomenclatura: `NOMBRE_DEPTO_YYYYMMDD_SEQ.txt`.
    *   Coherencia de datos: Valida que la fecha en el nombre del archivo coincida con la fecha de reporte seleccionada.
    *   Integridad de estructura: Valida dinámicamente que el archivo contenga el número exacto de columnas requeridas para cada tipo de reporte.
    *   Validación cruzada: Impide subir un reporte de "Riesgos" en un slot de "Auditoría".
*   **Simulación de Backend:** Servicio (`mockBackendService`) que simula latencia de red, validaciones asíncronas y respuestas de error/éxito.
*   **Generador de Plantillas:** Funcionalidad para descargar archivos `.txt` de prueba con datos aleatorios que cumplen con la estructura válida de cada reporte.
*   **Historial de Envíos:** Registro detallado de intentos fallidos y exitosos con mensajes de retroalimentación.
*   **Interfaz Moderna:** Diseño responsivo con soporte completo para **Modo Oscuro**, construido con Tailwind CSS.

## 🛠️ Stack Tecnológico

*   **Core:** React 19 + TypeScript.
*   **Estilos:** Tailwind CSS.
*   **Iconografía:** Lucide React.
*   **Empaquetado/Ejecución:** Compatible con Vite o entornos de ejecución directa de módulos ES.

## 📋 Reglas de Negocio y Validación

Para que un archivo sea aceptado por el sistema, debe cumplir las siguientes reglas (definidas en `constants.ts`):

1.  **Formato:** Archivo de texto plano (`.txt`) con codificación UTF-8.
2.  **Nomenclature:** Debe seguir el patrón estricto `REPORTE_DEPTO_YYYYMMDD_SEQ.txt`.
    *   *Ejemplo:* `R01_Saldos_Diarios_REG_20231027_001.txt`
3.  **Contenido:** Las columnas deben estar separadas por `|` (pipe).
    *   Si el reporte espera 4 columnas y una línea tiene 3 o 5, el archivo será rechazado.
4.  **Fecha:** La fecha incrustada en el nombre del archivo debe coincidir exactamente con la fecha seleccionada en el selector de la interfaz.

## 📦 Instalación y Ejecución

Este proyecto está diseñado como una aplicación React moderna.

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Ejecutar entorno de desarrollo:**
    ```bash
    npm run dev
    ```

3.  **Construir para producción:**
    ```bash
    npm run build
    ```

## 📂 Estructura del Proyecto

*   `components/`: Componentes de UI (Modales, Filas de reportes, Badges).
*   `services/`: Lógica de simulación de backend (`mockBackendService.ts`).
*   `types.ts`: Definiciones de tipos TypeScript e Interfaces.
*   `constants.ts`: **Archivo crítico**. Contiene la definición de todos los reportes, sus columnas esperadas, reglas de validación y datos de prueba (`REPORT_DEFINITIONS`).
*   `App.tsx`: Controlador principal y gestión de estado.

---
*Desarrollado como simulación de arquitectura de software para sistemas regulatorios financieros.*