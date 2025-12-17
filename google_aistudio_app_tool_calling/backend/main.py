from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import enum
import uuid
import datetime
import ollama
import json

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
    AUDITORIA = "Auditoría Interna"
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
    history: List[SubmissionHistory] = []

class ChatRequest(BaseModel):
    message: str
    # En un escenario real, pasaríamos el ID de sesión o contexto, 
    # aquí simplificamos asumiendo un contexto global o pasando el estado relevante si fuera necesario.
    # Pero como movemos el estado al backend, el backend ya lo tiene.

# --- CONSTANTS (Mirrored from frontend) ---

DEPARTMENT_ABBREVIATIONS = {
    Department.REGULATORIO: 'REG',
    Department.CUMPLIMIENTO: 'CUM',
    Department.RIESGOS: 'RIE',
    Department.AUDITORIA: 'AUD',
    Department.OPERACIONES: 'OPE',
}

# Simplified definitions for validation logic
# In a real app these might be in a database
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
# We simulate a database here
REPORTS_DB: List[Dict] = []  # List of ReportEntry

# initialize with some empty reports (optional, or let frontend create them? 
# In the original app, the frontend probably initialized them. 
# Let's add an endpoint to INITIALIZE or GET reports.
# Logic: When frontend mounts, it asks for reports. If empty, maybe backend generates them?
# Or frontend sends the initial list? 
# Better: Backend generates the initial structure based on REPORT_DEFINITIONS.

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
                "history": []
            })
            
initialize_db()


# --- VALIDATION LOGIC (Ported from TS) ---

MAX_SIZE_MB = 2

async def validate_file(file: UploadFile, department: Department, report_name: str, expected_date_str: str):
    # 1. Size
    # UploadFile doesn't have size immediately available without reading or checking headers (content-length)
    # Reading into memory for demo purpose
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
    # Min parts: ReportName (At least 1 part) + Dept + Date + Seq = 4
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

def tool_consultar_reportes(department: str = None, status: str = None):
    """
    Busca y filtra el listado de reportes regulatorios actuales.
    """
    print(f"🔧 [TOOL] Consultar Reportes: Dept={department}, Status={status}")
    
    filtered = []
    for r in REPORTS_DB:
        match_dept = True
        if department:
            # Case insensitive partial match
            if department.lower() not in r["department"].value.lower():
                match_dept = False
        
        match_status = True
        if status:
            if r["status"] != status:
                match_status = False
                
        if match_dept and match_status:
            # Format error message if exists
            error_msg = "N/A"
            if len(r["history"]) > 0 and "ERROR" in r["status"]:
                error_msg = r["history"][-1]["message"]
                
            filtered.append({
                "nombre": r["reportName"],
                "departamento": r["department"],
                "estatus": r["status"],
                "fecha": r["date"],
                "mensaje_error": error_msg
            })
            
    if not filtered:
        return json.dumps({"count": 0, "message": "No se encontraron reportes."})
        
    return json.dumps({"count": len(filtered), "reportes": filtered})


# --- LLM CHAT LOGIC ---

MODEL_NAME = "llama3.2"

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    user_msg = request.message
    print(f"💬 Chat Request: {user_msg}")
    
    # Define tool for Ollama
    tools = [{
        'type': 'function',
        'function': {
            'name': 'consultar_reportes',
            'description': 'Busca y filtra reportes. Útil para saber errores, faltantes o estado por departamento.',
            'parameters': {
                'type': 'object',
                'properties': {
                    'department': {
                        'type': 'string',
                        'description': 'Departamento (Riesgos, Cumplimiento, Regulatorio, Auditoría, Operaciones)'
                    },
                    'status': {
                        'type': 'string',
                        'description': 'Estado (PENDING, SUCCESS, ERROR_FORMAT, READY)'
                    }
                }
            }
        }
    }]
    
    try:
        messages = [{'role': 'user', 'content': user_msg}]
        
        response = ollama.chat(
            model=MODEL_NAME,
            messages=messages,
            tools=tools
        )
        
        msg = response['message']
        
        if msg.get('tool_calls'):
            messages.append(msg)
            for tool in msg['tool_calls']:
                fn_name = tool['function']['name']
                args = tool['function']['arguments']
                
                if fn_name == 'consultar_reportes':
                    # Map args names if necessary (Ollama sometimes hallucinates arg names, but usually fine)
                    # Our tool expects 'department' and 'status' (english), but prompt said 'departamento' (spanish)? 
                    # The tool definition uses 'department' and 'status'.
                    # Let's handle variations just in case
                    dept = args.get('department') or args.get('departamento')
                    stat = args.get('status') or args.get('estatus')
                    
                    result = tool_consultar_reportes(department=dept, status=stat)
                    
                    messages.append({
                        'role': 'tool',
                        'content': result
                    })
            
            # Final response
            final = ollama.chat(model=MODEL_NAME, messages=messages)
            return {"text": final['message']['content']}
            
        else:
            return {"text": msg['content']}

    except Exception as e:
        print(f"❌ Error LLM: {e}")
        return {"text": f"Error al procesar tu solicitud con el LLM: {str(e)}"}


# --- API ENDPOINTS ---

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
    # Find the report
    report_idx = next((i for i, r in enumerate(REPORTS_DB) if r["reportName"] == reportName and r["date"] == expectedDate), -1)
    
    timestamp = datetime.datetime.now().isoformat()
    
    if report_idx != -1:
        # Add to history
        new_entry = {
            "id": str(uuid.uuid4()),
            "timestamp": timestamp,
            "filename": file.filename,
            "status": status,
            "message": msg
        }
        REPORTS_DB[report_idx]["history"].append(new_entry)
        REPORTS_DB[report_idx]["status"] = status
        
        return {
            "isValid": is_valid,
            "errorType": status if not is_valid else None,
            "message": msg,
            "report": REPORTS_DB[report_idx]
        }
    else:
        # Validation passed but report not found in DB? 
        # Shouldn't happen if we initialized DB correctly or frontend is synced.
        # But if it happens, maybe create it?
        return {
            "isValid": False,
            "errorType": ReportStatus.ERROR_UPLOAD,
            "message": "Reporte no encontrado en base de datos."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
