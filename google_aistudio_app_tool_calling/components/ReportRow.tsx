import React, { useState, useRef } from 'react';
import { ReportEntry, ReportStatus, SubmissionHistory } from '../types';
import { REPORT_DEFINITIONS } from '../constants';
import StatusBadge from './StatusBadge';
import { simulateBackendUpload } from '../services/mockBackendService';
import HistoryModal from './HistoryModal';
import RequirementsModal from './RequirementsModal';
import { Upload, Send, RefreshCw, History, Shield, Lock } from 'lucide-react';

interface ReportRowProps {
  report: ReportEntry;
  onUpdate: (updatedReport: ReportEntry) => void;
  readOnly?: boolean;
}

const ReportRow: React.FC<ReportRowProps> = ({ report, onUpdate, readOnly = false }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReqsOpen, setIsReqsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find Requirements text
  const deptReports = REPORT_DEFINITIONS[report.department] || [];
  const def = deptReports.find(d => d.name === report.reportName);
  const requirements = def ? def.requirements : ['Revisar manual operativo.'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpdate({
        ...report,
        currentFile: file,
        status: ReportStatus.READY
      });
    }
  };

  const handleUploadClick = () => {
    if (!readOnly) {
      fileInputRef.current?.click();
    }
  };

  const handleSend = async () => {
    if (!report.currentFile || readOnly) return;

    onUpdate({ ...report, status: ReportStatus.UPLOADING });

    // Pass report.date to validate against filename date
    const result = await simulateBackendUpload(
      report.currentFile, 
      report.department, 
      report.reportName,
      report.date 
    );
    
    const now = new Date().toISOString();
    
    const historyEntry: SubmissionHistory = {
      id: crypto.randomUUID(),
      timestamp: now,
      filename: report.currentFile.name,
      status: result.isValid ? ReportStatus.SUCCESS : (result.errorType || ReportStatus.ERROR_UPLOAD),
      message: result.message || 'Procesado correctamente por el regulador.',
    };

    onUpdate({
      ...report,
      status: historyEntry.status,
      lastUpdated: result.isValid ? now : report.lastUpdated,
      history: [...report.history, historyEntry],
    });
  };

  const isSentOnce = report.history.length > 0;
  
  // Safe date helper
  const isValidDate = (d: string | null) => d && !isNaN(new Date(d).getTime());

  return (
    <>
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-100 dark:border-slate-700 group">
        
        <td className="px-6 py-4 whitespace-nowrap">
           <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{report.reportName}</span>
             <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">{report.department}</span>
           </div>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
           {isValidDate(report.lastUpdated) ? (
             <div className="flex flex-col">
               <span className="font-medium text-gray-700 dark:text-gray-300">
                 {new Date(report.lastUpdated!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
               <span className="text-xs">
                 {new Date(report.lastUpdated!).toLocaleDateString()}
               </span>
             </div>
           ) : <span className="text-gray-300 dark:text-gray-600">-</span>}
        </td>

        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={report.status} />
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            
            {/* Requirements Button */}
             <button
              onClick={() => setIsReqsOpen(true)}
              className="p-2 rounded-full text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
              title="Ver Requisitos"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Read Only Lock Indicator or Upload Actions */}
            {readOnly ? (
               <div className="p-2 text-gray-400" title="Solo lectura (Fecha pasada)">
                 <Lock className="w-5 h-5" />
               </div>
            ) : (
              <>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".txt"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handleUploadClick}
                  disabled={report.status === ReportStatus.UPLOADING}
                  className={`p-2 rounded-full transition-colors relative
                    ${report.status === ReportStatus.UPLOADING ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'}
                  `}
                  title={report.currentFile ? "Cambiar archivo" : "Cargar archivo TXT"}
                >
                  <Upload className="w-5 h-5" />
                  {report.currentFile && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  )}
                </button>

                {report.currentFile && (
                  <button
                    onClick={handleSend}
                    disabled={report.status === ReportStatus.UPLOADING}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-white shadow-sm transition-all
                      ${report.status === ReportStatus.UPLOADING 
                        ? 'bg-gray-400 cursor-wait' 
                        : isSentOnce 
                          ? 'bg-indigo-600 hover:bg-indigo-700' 
                          : 'bg-emerald-600 hover:bg-emerald-700'}
                    `}
                  >
                    {report.status === ReportStatus.UPLOADING ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                )}
              </>
            )}

            {/* History Button */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              disabled={report.history.length < 1}
              className={`p-2 rounded-full transition-colors 
                ${report.history.length > 0 ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 hover:text-indigo-600' : 'text-gray-200 dark:text-slate-700 cursor-not-allowed'}
              `}
              title="Ver Historial"
            >
              <History className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={report.history}
        reportName={report.reportName}
      />

      <RequirementsModal 
         isOpen={isReqsOpen}
         onClose={() => setIsReqsOpen(false)}
         department={report.department}
         reportName={report.reportName}
         requirements={requirements}
      />
    </>
  );
};

export default ReportRow;