import React, { useState, useEffect } from 'react';
import { Department, ReportEntry, ReportStatus } from './types';
import { REPORT_DEFINITIONS, generateMockHistory } from './constants';
import ReportRow from './components/ReportRow';
import TemplatesModal from './components/TemplatesModal';
import ChatBot from './components/ChatBot';
import { Building2, Calendar, Moon, Sun, Download, Layers } from 'lucide-react';

const STORAGE_KEY = 'REGULABANK_DATA_V2';

// Helper to get local date string YYYY-MM-DD
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const App = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Department>(Department.REGULATORIO);
  const [darkMode, setDarkMode] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load Data Logic
  useEffect(() => {
    const today = getTodayString();
    const isPast = selectedDate < today;

    // Check LocalStorage first
    const saved = localStorage.getItem(STORAGE_KEY);
    let allReports: ReportEntry[] = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        allReports = parsed.map((r: any) => ({ ...r, currentFile: null }));
      } catch (e) {
        console.error("Parse error", e);
      }
    }

    // Filter for selected date
    let dateReports = allReports.filter(r => r.date === selectedDate);

    // If no reports exist for this date, generate them (Auto-populate ALL reports)
    if (dateReports.length === 0) {
      const generated: ReportEntry[] = [];
      Object.entries(REPORT_DEFINITIONS).forEach(([dept, definitions]) => {
        definitions.forEach(def => {
          // If past date, generate mock history
          const history = isPast ? generateMockHistory(selectedDate, def.name) : [];
          // Determine status based on history
          let status = ReportStatus.PENDING;
          let lastUpdated = null;
          
          if (history.length > 0) {
            const last = history[history.length - 1];
            status = last.status;
            lastUpdated = last.timestamp;
          }

          generated.push({
            id: crypto.randomUUID(),
            date: selectedDate,
            department: dept as Department,
            reportName: def.name,
            lastUpdated: lastUpdated,
            status: status,
            history: history,
            currentFile: null
          });
        });
      });
      dateReports = generated;
      // Merge new generated ones with existing state (to keep other dates)
      allReports = [...allReports.filter(r => r.date !== selectedDate), ...generated];
    }

    setReports(allReports);
  }, [selectedDate]);

  // Save to Storage
  useEffect(() => {
    if (reports.length > 0) {
      const toSave = reports.map(({ currentFile, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [reports]);

  const handleUpdateReport = (updated: ReportEntry) => {
    setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const filteredReports = reports.filter(r => r.date === selectedDate && r.department === activeTab);
  const todayStr = getTodayString();
  const isReadOnly = selectedDate < todayStr;

  // Reports for the currently selected date to pass to AI
  const currentViewReports = reports.filter(r => r.date === selectedDate);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 pb-20">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">RegulaBank MX</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Plataforma de Cumplimiento</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-4">
               <span className="text-xs text-gray-400 dark:text-slate-500">Ambiente</span>
               <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800">SIMULACIÓN</span>
             </div>
             
             <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
                title="Cambiar tema"
             >
               {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="date-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Fecha de Reporte:
            </label>
            <input 
              id="date-filter"
              type="date" 
              max={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block rounded-md border-0 py-1.5 text-gray-900 dark:text-white dark:bg-slate-800 ring-1 ring-inset ring-gray-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 cursor-pointer"
            />
          </div>
          
          <button 
             onClick={() => setIsTemplatesOpen(true)}
             className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            Descargar Plantillas
          </button>
        </div>

        {/* Read Only Warning */}
        {isReadOnly && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg flex items-center gap-3">
             <Layers className="w-5 h-5 text-amber-600 dark:text-amber-500" />
             <p className="text-sm text-amber-800 dark:text-amber-200">
               <strong>Modo Histórico:</strong> Estás visualizando registros de una fecha pasada. Las cargas y envíos están deshabilitados.
             </p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {Object.values(Department).map((dept) => {
              // Calculate logic for indicators
              const deptReports = reports.filter(r => r.date === selectedDate && r.department === dept);
              const isAllCompleted = deptReports.length > 0 && deptReports.every(r => r.status === ReportStatus.SUCCESS);
              const hasReports = deptReports.length > 0;
              
              return (
                <button
                  key={dept}
                  onClick={() => setActiveTab(dept)}
                  className={`
                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 transition-colors relative
                    ${activeTab === dept
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}
                  `}
                >
                  {dept}
                  
                  {/* Status Indicator */}
                  {hasReports && (
                    <span className="relative flex h-2 w-2">
                      {isAllCompleted ? (
                        /* All Complete: Green, Static */
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      ) : (
                        /* Incomplete: Red, Animated */
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
              <thead className="bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Nombre Reporte</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Último Envío</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Estatus</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <ReportRow 
                      key={report.id} 
                      report={report} 
                      onUpdate={handleUpdateReport}
                      readOnly={isReadOnly}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No hay reportes configurados para este departamento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 dark:bg-slate-900 px-6 py-3 border-t border-gray-200 dark:border-slate-800 text-xs text-gray-500 dark:text-slate-500 flex justify-between">
            <span>Total: {filteredReports.length}</span>
            <span>{isReadOnly ? 'Solo Lectura' : 'Edición Habilitada'}</span>
          </div>
        </div>
      </main>

      {/* AI Assistant ChatBot */}
      <ChatBot currentReports={currentViewReports} />

      <TemplatesModal 
        isOpen={isTemplatesOpen} 
        onClose={() => setIsTemplatesOpen(false)} 
        dateStr={selectedDate}
      />
    </div>
  );
};

export default App;