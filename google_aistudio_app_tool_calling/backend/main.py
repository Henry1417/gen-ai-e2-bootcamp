from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from groq import Groq
from dotenv import load_dotenv
import enum
import uuid
import datetime
import json
import os

# Load environment variables (GROQ_API_KEY)
load_dotenv()

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TYPES & MODELS ---

class Department(str, enum.Enum):
    REGULATORIO = "Regulatorio"
    CUMPLIMIENTO = "Cumplimiento"
    RIESGOS = "Riesgos"
    AUDITORIA = "Auditoría"
    OPERACIONES = "Operaciones"

class ReportStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    ERROR_FORMAT = "ERROR_FORMAT"
    ERROR_UPLOAD = "ERROR_UPLOAD"
    READY = "READY"

class SubmissionHistory(BaseModel):
    id: str
    timestamp: str
    filename: str
    status: ReportStatus
    message: str

class ReportEntry(BaseModel):
    id: str
    reportName: str
    department: Department
    status: ReportStatus
    date: str
    lastUpdated: Optional[str] = None
    history: List[SubmissionHistory] = []

class ChatRequest(BaseModel):
    message: str

# --- CONSTANTS (Mirrored from frontend) ---

DEPARTMENT_ABBREVIATIONS = {
    Department.REGULATORIO: 'REG',
    Department.CUMPLIMIENTO: 'CUM',
    Department.RIESGOS: 'RIE',
    Department.AUDITORIA: 'AUD',
    Department.OPERACIONES: 'OPE',
}

# Simplified definitions for validation logic
REPORT_DEFINITIONS = {
    Department.REGULATORIO: [
        {"name": 'R01_Saldos_Diarios', "columns": ['ID_CUENTA', 'TIPO_DIVISA', 'SALDO_MXN', 'ESTATUS_CONTABLE']},
        {"name": 'R02_Liquidez_Banxico', "columns": ['FECHA_VALOR', 'BANDA_TIEMPO', 'FLUJO_ENTRADA', 'FLUJO_SALIDA', 'BRECHA']},
        {"name": 'R24_Capital_Neto', "columns": ['COMPONENTE', 'MONTO_CAPITAL', 'PONDERACION_RIESGO', 'ACTIVOS_SUJETOS_RIESGO']},
    ],
    Department.CUMPLIMIENTO: [
        {"name": 'C01_PLD_Operaciones_Relevantes', "columns": ['ID_OPERACION', 'ID_CLIENTE', 'MONTO_USD', 'TIPO_OPERACION', 'BENEFICIARIO']},
        {"name": 'C02_PLD_Inusuales', "columns": ['ID_ALERTA', 'ID_CLIENTE', 'MOTIVO_INUSUALIDAD', 'NIVEL_RIESGO', 'FECHA_DETECCION']},
        {"name": 'C03_Personas_Bloqueadas', "columns": ['ID_CLIENTE', 'RFC', 'NOMBRE_COMPLETO', 'LISTA_ORIGEN', 'ESTATUS_CUENTA']},
    ],
    Department.RIESGOS: [
        {"name": 'RK1_Riesgo_Mercado', "columns": ['PORTAFOLIO', 'FACTOR_RIESGO', 'SENSIBILIDAD_DELTA', 'VAR_CALCULADO', 'LIMITE_AUTORIZADO']},
        {"name": 'RK2_Riesgo_Credito', "columns": ['ID_CREDITO', 'DIAS_ATRASO', 'CALIFICACION', 'RESERVA_REQUERIDA', 'SALDO_INSOLUTO']},
        {"name": 'RK3_VaR_Historico', "columns": ['FECHA_ESCENARIO', 'FACTOR_SHOCK', 'PERDIDA_SIMULADA', 'PERCENTIL_99']},
    ],
    Department.AUDITORIA: [
        {"name": 'AU1_Hallazgos_Mensual', "columns": ['ID_HALLAZGO', 'AREA_AUDITADA', 'DESCRIPCION', 'CRITICIDAD', 'FECHA_COMPROMISO']},
        {"name": 'AU2_Seguimiento_Plan', "columns": ['ID_PROYECTO', 'FASE_ACTUAL', 'AVANCE_PCT', 'ESTATUS', 'DESVIACION']},
    ],
    Department.OPERACIONES: [
        {"name": 'OP1_Transacciones_SPEI', "columns": ['CLAVE_RASTREO', 'INSTITUCION_DESTINO', 'MONTO', 'ESTADO', 'LATENCIA_MS']},
        {"name": 'OP2_Conciliacion_Corresponsales', "columns": ['ID_CORRESPONSAL', 'TOTAL_SISTEMA', 'TOTAL_ARCHIVO', 'DIFERENCIA', 'FECHA_CORTE']},
    ],
}

# --- IN-MEMORY STATE ---
REPORTS_DB: List[Dict] = []  # List of ReportEntry

def initialize_db():
    if REPORTS_DB:
        return
    
    # Generate initial pending reports for today
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    
    for dept, reports in REPORT_DEFINITIONS.items():
        for rep_def in reports:
            REPORTS_DB.append({
                "id": str(uuid.uuid4()),
                "reportName": rep_def["name"],
                "department": dept,
                "status": ReportStatus.PENDING,
                "date": today_str,
                "lastUpdated": None,
                "history": []
            })
            
initialize_db()


# --- VALIDATION LOGIC ---

MAX_SIZE_MB = 2

async def validate_file(file: UploadFile, department: Department, report_name: str, expected_date_str: str):
    # 1. Size
    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
         return False, ReportStatus.ERROR_UPLOAD, f"El archivo excede {MAX_SIZE_MB}MB."

    # 2. Name & Extension
    filename = file.filename
    if not filename.endswith('.txt'):
        return False, ReportStatus.ERROR_FORMAT, "Extensión inválida. Se requiere .txt"

    dept_abbr = DEPARTMENT_ABBREVIATIONS.get(department)
    name_without_ext = filename[:-4]
    parts = name_without_ext.split('_')
    
    # REPORTE_DEPTO_YYYYMMDD_SEQ
    if len(parts) < 4:
         return False, ReportStatus.ERROR_FORMAT, "Nomenclatura incorrecta. Formato: REPORTE_DEPTO_YYYYMMDD_SEQ.txt"
         
    seq = parts.pop()
    date_str_file = parts.pop()
    file_dept = parts.pop()
    file_report_name = "_".join(parts)
    
    # 2.1 Dept
    if file_dept != dept_abbr:
        return False, ReportStatus.ERROR_FORMAT, f"Departamento incorrecto ({file_dept}). Esperado: {dept_abbr}"
        
    # 2.2 Report Name
    if file_report_name != report_name:
        return False, ReportStatus.ERROR_FORMAT, f"Nombre incorrecto. Esperado: {report_name}"
        
    # 2.3 Date
    if len(date_str_file) != 8 or not date_str_file.isdigit():
        return False, ReportStatus.ERROR_FORMAT, "Fecha inválida en nombre (YYYYMMDD)."
        
    expected_clean = expected_date_str.replace("-", "")
    if date_str_file != expected_clean:
         return False, ReportStatus.ERROR_FORMAT, f"Fecha no coincide. Archivo: {date_str_file}, Reporte: {expected_clean}"
         
    # 2.4 Columns
    try:
        text = content.decode('utf-8')
    except:
        return False, ReportStatus.ERROR_UPLOAD, "Error de encoding. Use UTF-8."
        
    if not text.strip():
        return False, ReportStatus.ERROR_FORMAT, "Archivo vacío."
        
    lines = [l for l in text.splitlines() if l.strip()]
    
    dept_defs = REPORT_DEFINITIONS.get(department, [])
    definition = next((r for r in dept_defs if r["name"] == report_name), None)
    
    if not definition:
        return False, ReportStatus.ERROR_UPLOAD, "Definición no encontrada."
        
    expected_cols_count = len(definition["columns"])
    
    for i, line in enumerate(lines):
        cols = line.split('|')
        if len(cols) != expected_cols_count:
             return False, ReportStatus.ERROR_FORMAT, f"Línea {i+1}: Columnas incorrectas. Esperadas {expected_cols_count}, recibidas {len(cols)}"
        
        for j, col in enumerate(cols):
            if not col.strip():
                return False, ReportStatus.ERROR_FORMAT, f"Línea {i+1}: Columna {j+1} vacía."
                
    return True, ReportStatus.SUCCESS, "Validación exitosa."


# --- TOOL IMPLEMENTATION ---

def tool_consultar_reportes(department: str = None, status: str = None, date: str = None):
    """
    Busca y filtra el listado de reportes regulatorios actuales.
    """
    print(f"🔧 [TOOL] Consultar Reportes: Dept={department}, Status={status}, Date={date}")
    
    # Normalize inputs
    if date == "HOY" or date == "today":
        date = datetime.date.today().strftime("%Y-%m-%d")
    
    filtered = []
    for r in REPORTS_DB:
        match = True
        
        # Filter by Dept
        if department:
            if department.lower() not in r["department"].value.lower():
                match = False
        
        # Filter by Status
        if status:
            target_status = status.upper()
            if target_status in ["FALTA", "FALTAN", "PENDIENTE", "PENDIENTES", "MISSING"]:
                target_status = "PENDING"
            elif target_status in ["COMPLETADO", "COMPLETADOS", "ENVIADO", "ENVIADOS", "OK", "EXITO"]:
                target_status = "SUCCESS"
            elif target_status in ["ERROR", "ERRORES", "FALLIDO", "FALLIDOS"]:
                # Special case: match any error
                if "ERROR" not in r["status"]:
                    match = False
            
            # Direct match check (unless special error case handled above)
            if target_status not in ["ERROR", "ERRORES", "FALLIDO", "FALLIDOS"]:
                 if r["status"] != target_status and r["status"] != status: 
                    match = False
        
        # Filter by Date
        if date:
            if r["date"] != date:
                match = False
                
        if match:
            # Format error message if exists
            error_msg = "N/A"
            if len(r["history"]) > 0 and "ERROR" in r["status"]:
                error_msg = r["history"][-1]["message"]
                
            filtered.append({
                "nombre": r["reportName"],
                "departamento": r["department"],
                "estatus": r["status"],
                "fecha": r["date"],
                "mensaje_error": error_msg,
                "intentos": len(r["history"])
            })
            
    if not filtered:
        return json.dumps({"count": 0, "message": "No se encontraron reportes con los criterios especificados."})
        
    return json.dumps({"count": len(filtered), "reportes": filtered})


# --- GROQ/LLM CHAT LOGIC ---

MODEL_NAME = "llama-3.3-70b-versatile"

# Initialize Groq Client
# Ensure GROQ_API_KEY is in .env or environment
try:
    client = Groq()
except Exception as e:
    print("Warning: Groq client failed to initialize. Check API Key.")
    client = None

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not client:
        return {"text": "Error: Groq client not initialized. Check server logs."}

    user_msg = request.message
    print(f"💬 Chat Request: {user_msg}")
    
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    
    SYSTEM_PROMPT = f"""
Eres el Asistente de Cumplimiento de RegulaBank.
Ayudas a consultar el estatus de reportes regulatorios.
Tienes acceso a la herramienta `consultar_reportes` para obtener datos REALES.

REGLAS:
1. SIEMPRE usa la herramienta si preguntan por estatus, faltantes, errores o historial.
2. Si preguntan "¿qué falta?", busca status='PENDING'.
3. La fecha de hoy es {today_str}.
4. Si el usuario solo saluda, responde amablemente sin usar herramientas.
    """

    # Define tool for Groq (OpenAI format)
    tools = [{
        'type': 'function',
        'function': {
            'name': 'consultar_reportes',
            'description': 'Consulta la Base de Datos de reportes. Filtra por departamento, estatus o fecha.',
            'parameters': {
                'type': 'object',
                'properties': {
                    'department': {
                        'type': 'string',
                        'description': 'Departamento (Riesgos, Cumplimiento, Regulatorio, Auditoría, Operaciones)'
                    },
                    'status': {
                        'type': 'string',
                        'description': 'Estado buscado: PENDING (Faltan), SUCCESS (Completados), ERROR_FORMAT (Errores), READY (Listos)'
                    },
                    'date': {
                        'type': 'string',
                        'description': f'Fecha en formato YYYY-MM-DD. Hoy es {today_str}.'
                    }
                }
            }
        }
    }]
    
    try:
        messages = [
            {'role': 'system', 'content': SYSTEM_PROMPT},
            {'role': 'user', 'content': user_msg}
        ]
        
        # 1. Initial Call
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls
        
        if tool_calls:
            # Append assistant's message with tool calls
            messages.append(response_message)
            
            for tool_call in tool_calls:
                fn_name = tool_call.function.name
                args = json.loads(tool_call.function.arguments)
                
                print(f"🤖 Tool Call: {fn_name} Args: {args}")
                
                if fn_name == 'consultar_reportes':
                    dept = args.get('department') or args.get('departamento')
                    stat = args.get('status') or args.get('estatus')
                    date_arg = args.get('date') or args.get('fecha')
                    
                    function_response = tool_consultar_reportes(department=dept, status=stat, date=date_arg)
                    
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": fn_name,
                        "content": function_response,
                    })
            
            # 2. Final Call with Tool Outputs
            second_response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=messages
            )
            return {"text": second_response.choices[0].message.content}
            
        else:
            # No tool called
            return {"text": response_message.content}

    except Exception as e:
        print(f"❌ Error LLM: {e}")
        return {"text": f"Error al procesar tu solicitud con Groq: {str(e)}"}


# --- API ENDPOINTS ---

# Existing endpoints...

@app.get("/tools/consultar-reportes")
def api_tool_consultar_reportes(department: Optional[str] = None, status: Optional[str] = None, date: Optional[str] = None):
    """
    Endpoint dedicado para n8n (Tool A). 
    Devuelve el estado de los reportes en formato JSON puro.
    """
    # Reutilizamos la lógica existente, pero convertimos el string JSON a objeto python
    # para que FastAPI lo devuelva como application/json correcto.
    result_str = tool_consultar_reportes(department, status, date)
    return json.loads(result_str)

@app.get("/tools/estructura-reporte")
def api_tool_estructura_reporte(report_name: str):
    """
    Endpoint dedicado para n8n (Tool B).
    Devuelve la definición de columnas para un reporte específico.
    """
    for dept, reports in REPORT_DEFINITIONS.items():
        for rep in reports:
            if rep["name"] == report_name:
                return {
                    "reportName": report_name,
                    "department": dept,
                    "columns": rep["columns"],
                    "separator": "|" # Metadata útil para el LLM
                }
    
    raise HTTPException(status_code=404, detail=f"Reporte '{report_name}' no encontrado en definiciones.")


@app.get("/reports")
def get_reports():
    return REPORTS_DB

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    department: Department = Form(...),
    reportName: str = Form(...),
    expectedDate: str = Form(...)
):
    print(f"📂 Uploading: {file.filename} for {reportName} ({department})")
    
    # 1. Validation
    is_valid, status, msg = await validate_file(file, department, reportName, expectedDate)
    
    # 2. Update DB
    report_idx = next((i for i, r in enumerate(REPORTS_DB) if r["reportName"] == reportName and r["date"] == expectedDate), -1)
    
    timestamp = datetime.datetime.now().isoformat()
    
    if report_idx != -1:
        new_entry = {
            "id": str(uuid.uuid4()),
            "timestamp": timestamp,
            "filename": file.filename,
            "status": status,
            "message": msg
        }
        REPORTS_DB[report_idx]["history"].append(new_entry)
        REPORTS_DB[report_idx]["status"] = status
        REPORTS_DB[report_idx]["lastUpdated"] = timestamp
        
        return {
            "isValid": is_valid,
            "errorType": status if not is_valid else None,
            "message": msg,
            "report": REPORTS_DB[report_idx]
        }
    else:
        return {
            "isValid": False,
            "errorType": ReportStatus.ERROR_UPLOAD,
            "message": "Reporte no encontrado en base de datos."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
