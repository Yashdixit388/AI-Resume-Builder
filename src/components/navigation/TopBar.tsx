import React from 'react';
import { 
  FileDown, 
  Sparkles, 
  Moon, 
  Sun, 
  Layers, 
  Briefcase, 
  CheckCircle,
  Copy,
  Download
} from 'lucide-react';
import { Resume } from '../../types/resume';

interface TopBarProps {
  currentResume: Resume;
  resumesList: Resume[];
  onSelectResume: (resume: Resume) => void;
  onNewResume: () => void;
  onOpenAIGenerator: () => void;
  onOpenJobMatcher: () => void;
  onOpenATSScanner: () => void;
  onExportPDF: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentResume,
  resumesList,
  onSelectResume,
  onNewResume,
  onOpenAIGenerator,
  onOpenJobMatcher,
  onOpenATSScanner,
  onExportPDF,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentResume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentResume.targetRole.replace(/\s+/g, '_')}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <header className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="/" className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 whitespace-nowrap">
          <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
            R
          </span>
          <span>ResumAI</span>
        </a>

        {/* Resume Profile Switcher */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200 dark:border-slate-800">
          <select
            value={currentResume.id}
            onChange={(e) => {
              const selected = resumesList.find((r) => r.id === e.target.value);
              if (selected) onSelectResume(selected);
            }}
            className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none max-w-[200px] truncate"
          >
            {resumesList.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title || r.targetRole}
              </option>
            ))}
          </select>
          <button
            onClick={onNewResume}
            className="text-xs px-2 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Create new blank resume"
          >
            + New
          </button>
        </div>
      </div>

      {/* Zone 2: 4-5 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
        <button
          onClick={onOpenAIGenerator}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>AI Generator</span>
        </button>
        <button
          onClick={onOpenJobMatcher}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
        >
          <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
          <span>Job Matcher</span>
        </button>
        <button
          onClick={onOpenATSScanner}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
          <span>ATS Health</span>
        </button>
        <button
          onClick={downloadJSON}
          className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          title="Export resume data as JSON"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>JSON Backup</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action button + theme toggle */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle light/dark theme"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-white rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export PDF</span>
        </button>
      </div>
    </header>
  );
};
