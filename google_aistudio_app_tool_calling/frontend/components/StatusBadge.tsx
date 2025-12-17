import React from 'react';
import { ReportStatus } from '../types';
import { CheckCircle, XCircle, AlertCircle, Clock, UploadCloud } from 'lucide-react';

interface StatusBadgeProps {
  status: ReportStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case ReportStatus.SUCCESS:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completado
        </span>
      );
    case ReportStatus.ERROR_FORMAT:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800">
          <XCircle className="w-3 h-3 mr-1" />
          Formato Incorrecto
        </span>
      );
    case ReportStatus.ERROR_UPLOAD:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error de Carga
        </span>
      );
    case ReportStatus.UPLOADING:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 animate-pulse dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
          <UploadCloud className="w-3 h-3 mr-1" />
          Enviando...
        </span>
      );
    case ReportStatus.READY:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Listo para enviar
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
          <Clock className="w-3 h-3 mr-1" />
          Pendiente
        </span>
      );
  }
};

export default StatusBadge;