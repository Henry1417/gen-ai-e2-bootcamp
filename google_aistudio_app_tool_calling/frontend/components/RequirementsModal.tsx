import React from 'react';
import { X, ShieldCheck, CheckCircle2, FileCode, Columns, FileType } from 'lucide-react';
import { Department } from '../types';
import { REPORT_DEFINITIONS } from '../constants';

interface RequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department;
  reportName: string;
  requirements: string[]; // Note: We will look up the full definition now
}

const RequirementsModal: React.FC<RequirementsModalProps> = ({ 
  isOpen, onClose, department, reportName, requirements 
}) => {
  if (!isOpen) return null;

  // Find the full definition to get columns and format
  const deptReports = REPORT_DEFINITIONS[department] || [];
  const def = deptReports.find(d => d.name === reportName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-blue-50 dark:bg-slate-900/50">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Especificaciones Técnicas
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Reporte</h4>
            <p className="text-xl font-bold text-gray-900 dark:text-white break-all">{reportName}</p>
            <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
              {department}
            </span>
          </div>

          {def && (
            <div className="space-y-6">
              
              {/* Filename Format */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <FileCode className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nomenclatura del Archivo</span>
                </div>
                <code className="block bg-white dark:bg-slate-950 p-2 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400 break-all border border-slate-200 dark:border-slate-800">
                  {def.fileNameFormat}
                </code>
              </div>

              {/* Columns Structure */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Columns className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Estructura de Columnas (Separador "|")</span>
                </div>
                <div className="flex flex-wrap gap-2">
                   {def.columns.map((col, idx) => (
                     <span key={idx} className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono text-slate-600 dark:text-slate-300">
                       {idx + 1}. {col}
                     </span>
                   ))}
                </div>
              </div>

              {/* Validations */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Reglas de Validación
                </h4>
                <ul className="space-y-2">
                  {def.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 ml-1">
                      <span className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mt-1.5 shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Global Format */}
              <div className="border-t border-gray-100 dark:border-slate-700 pt-4 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-500">
                 <FileType className="w-4 h-4" />
                 <span>Formato TXT Obligatorio</span>
                 <span className="mx-1">•</span>
                 <span>Codificación UTF-8</span>
              </div>

            </div>
          )}

        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementsModal;