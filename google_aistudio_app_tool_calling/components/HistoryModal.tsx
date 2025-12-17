import React from 'react';
import { SubmissionHistory, ReportStatus } from '../types';
import { X, FileText, Check, AlertTriangle } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SubmissionHistory[];
  reportName: string;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, reportName }) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error("Invalid date");
      return date.toLocaleString('es-MX');
    } catch (e) {
      return dateString || 'Fecha inválida';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Historial de Envíos: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{reportName}</span>
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6 bg-white dark:bg-slate-800">
          {history.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No hay historial de envíos registrados.</p>
          ) : (
            <ol className="relative border-l border-gray-200 dark:border-slate-700 ml-3">
              {history.slice().reverse().map((entry) => (
                <li key={entry.id} className="mb-8 ml-6 last:mb-0">
                  <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white dark:ring-slate-800 ${
                    entry.status === ReportStatus.SUCCESS 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400' 
                      : 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400'
                  }`}>
                    {entry.status === ReportStatus.SUCCESS ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </span>
                  
                  <div className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <time className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400 sm:order-last sm:mb-0 bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded border border-gray-100 dark:border-slate-700">
                        {formatDate(entry.timestamp)}
                      </time>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white break-all pr-2">
                        {entry.filename}
                      </h3>
                    </div>
                    
                    <div className="text-sm">
                      <span className={`font-medium ${
                        entry.status === ReportStatus.SUCCESS ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {entry.status === ReportStatus.SUCCESS ? 'Envío Exitoso' : 'Fallo en Envío'}
                      </span>
                      {entry.message && (
                         <p className="mt-2 text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 p-3 rounded text-xs font-mono border-l-2 border-gray-300 dark:border-slate-600">
                           {entry.message}
                         </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex justify-end">
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

export default HistoryModal;