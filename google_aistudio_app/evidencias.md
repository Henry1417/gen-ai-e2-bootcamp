# RegulaBankMX app

## Objetivo final
Generar una aplicación funcional end-to-end que simule de forma realista el proceso de envío de información bancaria a una entidad regulatoria, con validaciones, estados visuales claros y manejo de errores.

## Proceso
### Prompt Inicial - ChatGPT

```
enfoca todo tu conocimiento en genración de prompts y genera el prompt para: crear una aplicación que gestione el envio de información sencible de clientes a una entidad regulatoria, usar nombres ficticios, el banco es mexicano asi como la entidad, el banco necesita enviar información a la entidad regulatoria meidnate archivos, la información tendra solo información necesario para identificar a un cliente y su estatus crediticio, el usuario podra subir los archivos desde el frontend y enviar el archivo, este archivo debe seguir una formato y nomeclatura, la entidad regulatoria expone un API con un endpoint para recibir el archivo y este regresara un codigo de estatus donde indique si el archivo es recibido y cumple con las especifiaciones (para simular esto genera este back end con fastapi de python usando uvicorn), en la pantalla debes mostrar los archivos y su estatus, ejemplo: Usuario sube el archivo al sistema mientras el archivo termina de cargar se muestra "Cargando o un icono a fin, cuando termina la carga el estatus sera ("Completado/Verde", "Error de Carga/Rojo", "Formato incorrecto/Rojo", Icono a fin de cada estatus con su respectivo color) en este proceso es donde se utiliza el API expuesto por la entidad regulatoria, Ten en cuenta contar con 2 botones 1.cargar(para seleccionar el archivo desde el frontend), 2.enviar(para enviar el archivo a la entidad regulatoria, cuando se haga el primer envio independientemente si es correcto o tiene un error, se debera mostrar ahora re-enviar), 3.historial(mostraremos el historial de envios, hbilitarlo solo si se cuenta con mas de 1 envio/re-envio)todo esto mostrarlo en el fontend con un estilo tipo tabla donde tendremos las columnas: fecha, Nombre reporte, Departamento ("Regulatorio", y dame 4 clasificaciones mas para trabajar), Fecha/Hora ultimo envio y la columna de los botones,
utilizar html,css y javascript, backend utiliza puthon con uvicorn
```

#### Respuesta ChatGPT

```
Actúa como arquitecto de software senior y desarrollador fullstack con experiencia en sistemas bancarios regulatorios, seguridad de información, frontend web y backend en Python (FastAPI + Uvicorn).
Contexto:
Un banco mexicano ficticio envía información mínima y sensible ficticia de clientes a una entidad regulatoria mexicana ficticia mediante archivos TXT con formato y nomenclatura obligatorios.
Requisitos
Archivo
Datos:
id_cliente
nombre_ficticio
rfc_ficticio
estatus_crediticio (ACTIVO|VENCIDO|CANCELADO)
Formato: TXT
Separador definido: |
Nomenclatura: [Nonmbre corto del reporte]_[Nombre corto/abreviatura del departamento]_YYYYMMDD_SEQ.txt
Backend (Entidad regulatoria simulada)
Python + FastAPI + Uvicorn
Endpoint para recepción de archivo
Validaciones:
Extensión correcta
Nomenclatura válida
Archivo no vacío
Tamaño máximo 2MB
Estructura correcta
Codificación UTF-8
Valores permitidos en estatus_crediticio
Respuestas HTTP:
OK (archivo válido)
Error de carga
Formato incorrecto
Frontend
Agregar calendario para filtrar los reportes mostrados
Por defecto mostrar la fecha actual
Vista tipo tabla
Columnas:
Fecha
Departamento:Regulatorio,Cumplimiento,Riesgos,Auditoría,Operaciones
Nombre reporte: Lista ficticia dependiente del departamento, Actualizar al cambiar el departamento
Fecha/Hora último envío
Estatus (texto + icono + color):
Completado (verde)
Error de carga (rojo)
Formato incorrecto (rojo)
Acciones
Flujo / Botones
Cargar: seleccionar archivo; mostrar “Cargando…” o icono
Enviar: enviar archivo al API regulatorio
Tras primer envío (éxito o error) cambiar a Re-enviar
Historial: mostrar envíos/re-envíos; habilitar solo si hay >1
Persistencia
Usar un archivo JSON
Guardar:
fecha
departamento
nombre reporte
estatus
historial de envíos , en este apartado define la mejor forma de manejar el hitorial de envios 
Restricciones
Datos y nombres 100% ficticios
Sin base de datos
Código claro y comentado
Entregables
Estructura del proyecto
Arquitectura resumida
Backend completo (FastAPI)
Frontend completo
Simulación del flujo
Instrucciones de ejecución local
Objetivo
Aplicación end-to-end funcional que simule el envío bancario-regulatorio con validaciones, estados visuales y manejo de errores.
```

## Google AI Studio
La respuesta de **ChatGPT** se ingreso en **Google AI Studio** y el resultado es:

### V1

**📹 [Versión 1](https://drive.google.com/file/d/1PLZfaVVuLOP4cY74LFsFtYLw0tC5TSwX/view?usp=sharing)**

### V2
Se interactua con el **Agente** para realizar mejoras en la aplicacion, se agregaron funcionalidades y validaciones.

**📹 [Versión 2](https://drive.google.com/file/d/1O-dJZUfOsiuAMxjtKHv6I965GCePbVb0/view?usp=sharing)**
