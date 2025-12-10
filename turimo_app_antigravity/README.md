# Tourist Application (Antigravity)

Esta aplicación sugiere sitios turísticos entre dos puntos utilizando un LLM local.

## Prerrequisitos

- Python 3.8+
- [Ollama](https://ollama.com/) instalado y ejecutándose con el modelo `llama3.2` (o el configurado en la app).

## Instalación

1.  Navega a la carpeta del proyecto:
    ```bash
    cd turimo_app_antigravity
    ```

2.  (Opcional) Crea y activa un entorno virtual:
    ```bash
    python -m venv venv
    # En Windows:
    .\venv\Scripts\activate
    # En macOS/Linux:
    source venv/bin/activate
    ```

3.  Instala las dependencias:
    ```bash
    pip install -r requirements.txt
    ```

## Ejecución

Para iniciar la aplicación, ejecuta el siguiente comando desde la carpeta `turimo_app_antigravity`:

```bash
uvicorn main:app --reload
```

La aplicación estará disponible en [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Documentación
Puedes consultar la documentación interactiva de la API (Swagger UI) en:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
