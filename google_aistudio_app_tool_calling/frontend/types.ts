export enum Department {
  REGULATORIO = 'Regulatorio',
  CUMPLIMIENTO = 'Cumplimiento',
  RIESGOS = 'Riesgos',
  AUDITORIA = 'Auditoría',
  OPERACIONES = 'Operaciones',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  READY = 'READY',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  ERROR_FORMAT = 'ERROR_FORMAT',
  ERROR_UPLOAD = 'ERROR_UPLOAD',
}

export enum CreditStatus {
  ACTIVO = 'ACTIVO',
  VENCIDO = 'VENCIDO',
  CANCELADO = 'CANCELADO',
}

export interface SubmissionHistory {
  id: string;
  timestamp: string;
  filename: string;
  status: ReportStatus;
  message: string;
}

export interface ReportEntry {
  id: string;
  date: string; // YYYY-MM-DD
  department: Department;
  reportName: string;
  lastUpdated: string | null;
  status: ReportStatus;
  history: SubmissionHistory[];
  currentFile: File | null;
}

export interface ValidationResult {
  isValid: boolean;
  errorType?: ReportStatus;
  message?: string;
}

export interface ReportDefinition {
  name: string;
  requirements: string[];
  columns: string[];
  fileNameFormat: string;
  mockRows: string[];
}