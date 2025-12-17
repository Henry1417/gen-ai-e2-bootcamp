import React from 'react';
import { X, Download, FileText } from 'lucide-react';
import { Department } from '../types';
import { REPORT_DEFINITIONS, DEPARTMENT_ABBREVIATIONS } from '../constants';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
}

const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, dateStr }) => {
  if (!isOpen) return null;

  const downloadSample = (dept: Department, reportName: string) => {
    const deptAbbr = DEPARTMENT_ABBREVIATIONS[dept];
    const cleanDate = dateStr.replace(/-/g, '');
    
    // Find definition
    const def = REPORT_DEFINITIONS[dept]?.find(r => r.name === reportName);
    if (!def) return;

    const filename = `${reportName}_${deptAbbr}_${cleanDate}_001.txt`;
    
    // Use the specific mock rows from definition
    const content = def.mockRows.join('\n');

    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-slate-700">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Descargar Plantillas de Prueba
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-white dark:bg-slate-800">
          {Object.entries(REPORT_DEFINITIONS).map(([dept, reports]) => (
            <div key={dept} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-3 text-sm uppercase tracking-wide border-b border-slate-200 dark:border-slate-700 pb-2">
                {dept}
              </h4>
              <ul className="space-y-2">
                {reports.map((r) => (
                  <li key={r.name}>
                    <button
                      onClick={() => downloadSample(dept as Department, r.name)}
                      className="w-full flex items-center justify-between group p-2 rounded hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-indigo-100 dark:hover:border-slate-600 transition-all"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate group-hover:text-slate-900 dark:group-hover:text-white">
                          {r.name}
                        </span>
                      </div>
                      <Download className="w-3 h-3 text-slate-300 group-hover:text-indigo-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Nota: Las plantillas incluyen datos aleatorios con la estructura de columnas correcta para cada tipo de reporte.
          </p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 shadow-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;