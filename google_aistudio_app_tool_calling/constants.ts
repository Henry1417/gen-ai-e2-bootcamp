import { Department, ReportStatus, ReportDefinition } from './types';

export const DEPARTMENT_ABBREVIATIONS: Record<Department, string> = {
  [Department.REGULATORIO]: 'REG',
  [Department.CUMPLIMIENTO]: 'CUM',
  [Department.RIESGOS]: 'RIE',
  [Department.AUDITORIA]: 'AUD',
  [Department.OPERACIONES]: 'OPE',
};

// Helper to generate mock history for past dates
export const generateMockHistory = (dateStr: string, reportName: string) => {
  if (!dateStr || !dateStr.includes('-')) return [];
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0,0,0,0);

  if (isNaN(date.getTime())) return [];
  if (date >= today) return [];

  const hash = reportName.length + day;
  const isSuccess = hash % 3 !== 0; 
  
  const submissions = [];
  
  const firstAttemptDate = new Date(date);
  firstAttemptDate.setHours(10, 0, 0, 0);

  submissions.push({
    id: crypto.randomUUID(),
    timestamp: firstAttemptDate.toISOString(),
    filename: `${reportName}_${dateStr.replace(/-/g,'')}_001.txt`,
    status: isSuccess ? ReportStatus.SUCCESS : ReportStatus.ERROR_FORMAT,
    message: isSuccess ? 'Procesado correctamente.' : 'Error: Columnas insuficientes en línea 5.',
  });

  if (!isSuccess) {
    const secondAttemptDate = new Date(date);
    secondAttemptDate.setHours(14, 0, 0, 0);

    submissions.push({
      id: crypto.randomUUID(),
      timestamp: secondAttemptDate.toISOString(),
      filename: `${reportName}_${dateStr.replace(/-/g,'')}_002.txt`,
      status: ReportStatus.SUCCESS,
      message: 'Corrección aplicada. Estructura válida.',
    });
  }

  return submissions;
};

// Report Definitions with specific requirements, columns, and mock data
export const REPORT_DEFINITIONS: Record<Department, ReportDefinition[]> = {
  [Department.REGULATORIO]: [
    { 
      name: 'R01_Saldos_Diarios', 
      requirements: ['Validar que la suma de saldos coincida con balanza', 'Cuentas en divisa extranjera convertidas a MXN', 'Sin saltos de línea al final'],
      columns: ['ID_CUENTA', 'TIPO_DIVISA', 'SALDO_MXN', 'ESTATUS_CONTABLE'],
      fileNameFormat: 'R01_Saldos_Diarios_REG_YYYYMMDD_SEQ.txt',
      mockRows: [
        '10005501|MXN|1500000.00|ACTIVO',
        '10005502|USD|45000.50|ACTIVO',
        '10005503|EUR|1200.00|BLOQUEADO'
      ]
    },
    { 
      name: 'R02_Liquidez_Banxico', 
      requirements: ['Solo incluir días hábiles', 'Reportar brechas de liquidez negativas', 'Formato ACLME estricto'],
      columns: ['FECHA_VALOR', 'BANDA_TIEMPO', 'FLUJO_ENTRADA', 'FLUJO_SALIDA', 'BRECHA'],
      fileNameFormat: 'R02_Liquidez_Banxico_REG_YYYYMMDD_SEQ.txt',
      mockRows: [
        '20231001|1-7 DIAS|5000000|4800000|200000',
        '20231001|8-30 DIAS|12000000|11500000|500000',
        '20231001|31-90 DIAS|8000000|8500000|-500000'
      ]
    },
    { 
      name: 'R24_Capital_Neto', 
      requirements: ['Incluir desglose Tier 1 y Tier 2', 'Validar cálculo de ICAP > 10.5%', 'Sin caracteres especiales'],
      columns: ['COMPONENTE', 'MONTO_CAPITAL', 'PONDERACION_RIESGO', 'ACTIVOS_SUJETOS_RIESGO'],
      fileNameFormat: 'R24_Capital_Neto_REG_YYYYMMDD_SEQ.txt',
      mockRows: [
        'CAPITAL_BASICO|850000000|1.0|850000000',
        'CAPITAL_COMPLEMENTARIO|50000000|0.5|25000000',
        'RIESGO_MERCADO|0|1.0|150000000'
      ]
    },
  ],
  [Department.CUMPLIMIENTO]: [
    { 
      name: 'C01_PLD_Operaciones_Relevantes', 
      requirements: ['Operaciones >= 7,500 USD', 'Datos del beneficiario obligatorios', 'Tipo de operación catálogo CNBV'],
      columns: ['ID_OPERACION', 'ID_CLIENTE', 'MONTO_USD', 'TIPO_OPERACION', 'BENEFICIARIO'],
      fileNameFormat: 'C01_PLD_Operaciones_Relevantes_CUM_YYYYMMDD_SEQ.txt',
      mockRows: [
        'OP-9921|CLI-8821|8000.00|TRANSFERENCIA_INT|JOHN DOE',
        'OP-9922|CLI-1102|15000.00|EFECTIVO|EMPRESA FANTASMA SA',
        'OP-9923|CLI-3312|7500.01|CHEQUE_VIAJERO|JANE SMITH'
      ]
    },
    { 
      name: 'C02_PLD_Inusuales', 
      requirements: ['Describir motivo de inusualidad', 'Clasificar riesgo (BAJO/MEDIO/ALTO)', 'Periodo de detección < 60 días'],
      columns: ['ID_ALERTA', 'ID_CLIENTE', 'MOTIVO_INUSUALIDAD', 'NIVEL_RIESGO', 'FECHA_DETECCION'],
      fileNameFormat: 'C02_PLD_Inusuales_CUM_YYYYMMDD_SEQ.txt',
      mockRows: [
        'ALT-001|CLI-5511|INCREMENTO_SUBITO_EFECTIVO|ALTO|20231025',
        'ALT-002|CLI-2211|OPERACION_JURISDICCION_RIESGO|MEDIO|20231026',
        'ALT-003|CLI-1122|ESTRUCTURACION_MONTO|ALTO|20231026'
      ]
    },
    { 
      name: 'C03_Personas_Bloqueadas', 
      requirements: ['Cruce positivo con lista OFAC/ONU', 'Estatus de cuenta debe ser CONGELADO', 'ID de la lista oficial'],
      columns: ['ID_CLIENTE', 'RFC', 'NOMBRE_COMPLETO', 'LISTA_ORIGEN', 'ESTATUS_CUENTA'],
      fileNameFormat: 'C03_Personas_Bloqueadas_CUM_YYYYMMDD_SEQ.txt',
      mockRows: [
        'CLI-6661|XAXX010101000|OSAMA BIN TEST|OFAC|CONGELADO',
        'CLI-6662|PPER880101H22|PABLO PEREZ|ONU_RES_123|CONGELADO'
      ]
    },
  ],
  [Department.RIESGOS]: [
    { 
      name: 'RK1_Riesgo_Mercado', 
      requirements: ['VaR calculado al 99%', 'Horizonte de tiempo 10 días', 'Incluir Delta y Gamma'],
      columns: ['PORTAFOLIO', 'FACTOR_RIESGO', 'SENSIBILIDAD_DELTA', 'VAR_CALCULADO', 'LIMITE_AUTORIZADO'],
      fileNameFormat: 'RK1_Riesgo_Mercado_RIE_YYYYMMDD_SEQ.txt',
      mockRows: [
        'MESA_DINERO|TASA_INTERES_TIIE|150200.00|500000.00|1000000.00',
        'MESA_DERIVADOS|TIPO_CAMBIO_USD|85000.00|320000.00|500000.00'
      ]
    },
    { 
      name: 'RK2_Riesgo_Credito', 
      requirements: ['Clasificación cartera A-E', 'Reservas calculadas conforme a metodología', 'Días de atraso numérico'],
      columns: ['ID_CREDITO', 'DIAS_ATRASO', 'CALIFICACION', 'RESERVA_REQUERIDA', 'SALDO_INSOLUTO'],
      fileNameFormat: 'RK2_Riesgo_Credito_RIE_YYYYMMDD_SEQ.txt',
      mockRows: [
        'CRE-1001|0|A|0.00|150000.00',
        'CRE-1002|45|B|1500.00|80000.00',
        'CRE-1003|120|D|45000.00|45000.00'
      ]
    },
    { 
      name: 'RK3_VaR_Historico', 
      requirements: ['Serie de 500 observaciones', 'Escenarios de estrés incluidos', 'Volatilidad anualizada'],
      columns: ['FECHA_ESCENARIO', 'FACTOR_SHOCK', 'PERDIDA_SIMULADA', 'PERCENTIL_99'],
      fileNameFormat: 'RK3_VaR_Historico_RIE_YYYYMMDD_SEQ.txt',
      mockRows: [
        '20220101|0.05|10000.00|NO',
        '20220102|-0.12|250000.00|SI',
        '20220103|0.01|2000.00|NO'
      ]
    },
  ],
  [Department.AUDITORIA]: [
    { 
      name: 'AU1_Hallazgos_Mensual', 
      requirements: ['Criticidad: ALTA, MEDIA, BAJA', 'Area responsable válida', 'Fecha compromiso obligatoria'],
      columns: ['ID_HALLAZGO', 'AREA_AUDITADA', 'DESCRIPCION', 'CRITICIDAD', 'FECHA_COMPROMISO'],
      fileNameFormat: 'AU1_Hallazgos_Mensual_AUD_YYYYMMDD_SEQ.txt',
      mockRows: [
        'AUD-23-01|TI|Falta parche seguridad servidor pagos|ALTA|20231231',
        'AUD-23-02|RH|Expediente incompleto empleado 551|BAJA|20231130'
      ]
    },
    { 
      name: 'AU2_Seguimiento_Plan', 
      requirements: ['Porcentaje de avance 0-100', 'Justificación si hay desviación', 'Recursos asignados'],
      columns: ['ID_PROYECTO', 'FASE_ACTUAL', 'AVANCE_PCT', 'ESTATUS', 'DESVIACION'],
      fileNameFormat: 'AU2_Seguimiento_Plan_AUD_YYYYMMDD_SEQ.txt',
      mockRows: [
        'PLAN-ANUAL-TI|EJECUCION|45|EN_TIEMPO|NINGUNA',
        'PLAN-CAPACITACION|CIERRE|90|RETRASADO|FALTA_PRESUPUESTO'
      ]
    },
  ],
  [Department.OPERACIONES]: [
    { 
      name: 'OP1_Transacciones_SPEI', 
      requirements: ['Clave de rastreo obligatoria', 'Estado: LIQUIDADO/DEVUELTO', 'Latencia en milisegundos'],
      columns: ['CLAVE_RASTREO', 'INSTITUCION_DESTINO', 'MONTO', 'ESTADO', 'LATENCIA_MS'],
      fileNameFormat: 'OP1_Transacciones_SPEI_OPE_YYYYMMDD_SEQ.txt',
      mockRows: [
        'ABC123456|BANAMEX|1500.00|LIQUIDADO|45',
        'DEF789012|BBVA|50000.00|DEVUELTO|120'
      ]
    },
    { 
      name: 'OP2_Conciliacion_Corresponsales', 
      requirements: ['ID Corresponsal (OXXO/711)', 'Diferencia debe ser 0 para conciliación exitosa', 'Fecha de corte'],
      columns: ['ID_CORRESPONSAL', 'TOTAL_SISTEMA', 'TOTAL_ARCHIVO', 'DIFERENCIA', 'FECHA_CORTE'],
      fileNameFormat: 'OP2_Conciliacion_Corresponsales_OPE_YYYYMMDD_SEQ.txt',
      mockRows: [
        'OXXO_PLAZA1|50000.00|50000.00|0.00|20231026',
        '711_CENTRO|25000.00|24950.00|-50.00|20231026'
      ]
    },
  ],
};