import { Department, ValidationResult, ReportStatus } from '../types';
import { DEPARTMENT_ABBREVIATIONS, REPORT_DEFINITIONS } from '../constants';

const MAX_SIZE_MB = 2;

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simulateBackendUpload = async (
  file: File,
  department: Department,
  reportName: string,
  expectedDateStr: string // Added expected date parameter
): Promise<ValidationResult> => {
  await delay(1500); // Simulate network latency

  // 1. Validate Size
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_UPLOAD,
      message: `El archivo excede el tamaño máximo de ${MAX_SIZE_MB}MB.`,
    };
  }

  // 2. Validate Extension and Basic Nomenclature
  const fileName = file.name;
  if (!fileName.endsWith('.txt')) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_FORMAT,
      message: 'Extensión inválida. Se requiere archivo .txt',
    };
  }

  const deptAbbr = DEPARTMENT_ABBREVIATIONS[department];
  
  // Clean extension for splitting
  const nameWithoutExt = fileName.slice(0, -4);
  const parts = nameWithoutExt.split('_');
  
  // Expected structure: [REPORT_NAME_PARTS]_[DEPT]_[DATE]_[SEQ]
  // We pop the last 3 parts which are standard: Seq, Date, Dept.
  // Whatever remains at the start MUST be the Report Name.
  
  if (parts.length < 4) {
     return {
      isValid: false,
      errorType: ReportStatus.ERROR_FORMAT,
      message: 'Nomenclatura incorrecta. Formato esperado: REPORTE_DEPTO_YYYYMMDD_SEQ.txt',
    };
  }

  const seq = parts.pop();
  const dateStrInFile = parts.pop();
  const fileDept = parts.pop();
  const reportNameInFile = parts.join('_'); // Reconstruct the report name part
  
  // 2.1 Validate Department
  if (fileDept !== deptAbbr) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_FORMAT,
      message: `El departamento en el nombre del archivo (${fileDept}) no coincide con el departamento seleccionado (${deptAbbr}).`,
    };
  }

  // 2.2 Validate Report Name Match (Prevents uploading R02 to R01 slot)
  if (reportNameInFile !== reportName) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_FORMAT,
      message: `El archivo no corresponde a este reporte. Esperado: "${reportName}", Recibido: "${reportNameInFile}".`,
    };
  }

  // 2.3 Validate Date Format and Match
  if (!dateStrInFile || !/^\d{8}$/.test(dateStrInFile)) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_FORMAT,
      message: 'Formato de fecha en nombre de archivo inválido. Use YYYYMMDD.',
    };
  }

  const expectedDateClean = expectedDateStr.replace(/-/g, '');
  if (dateStrInFile !== expectedDateClean) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_FORMAT,
      message: `La fecha del archivo (${dateStrInFile}) no coincide con la fecha del reporte seleccionado (${expectedDateClean}).`,
    };
  }

  // 2.4 Validate Sequence
  if (!seq || !/^\d+$/.test(seq)) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_FORMAT,
      message: 'Secuencia inválida en nombre de archivo.',
    };
  }

  // Find Definition for Dynamic Content Validation
  const deptReports = REPORT_DEFINITIONS[department];
  const definition = deptReports?.find(r => r.name === reportName);

  if (!definition) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_UPLOAD,
      message: 'Definición de reporte no encontrada en el sistema.',
    };
  }

  // 3. Validate Content Dynamically
  try {
    const text = await file.text();
    
    if (!text.trim()) {
      return {
        isValid: false,
        errorType: ReportStatus.ERROR_FORMAT,
        message: 'El archivo está vacío.',
      };
    }

    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    const expectedColumnsCount = definition.columns.length;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const columns = line.split('|');
      
      if (columns.length !== expectedColumnsCount) {
        return {
          isValid: false,
          errorType: ReportStatus.ERROR_FORMAT,
          message: `Error en línea ${i + 1}: Se encontraron ${columns.length} columnas, se esperaban ${expectedColumnsCount} (${definition.columns.join(', ')}).`,
        };
      }

      // Basic empty check for all columns
      for (let j = 0; j < columns.length; j++) {
        if (!columns[j].trim()) {
           return {
            isValid: false,
            errorType: ReportStatus.ERROR_FORMAT,
            message: `Error en línea ${i + 1}: Columna ${j+1} (${definition.columns[j]}) está vacía.`,
          };
        }
      }
    }

    // Success
    return { isValid: true };

  } catch (e) {
    return {
      isValid: false,
      errorType: ReportStatus.ERROR_UPLOAD,
      message: 'Error de lectura de archivo (Encoding o Corrupción).',
    };
  }
};