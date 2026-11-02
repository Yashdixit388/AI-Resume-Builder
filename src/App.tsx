import React, { useState, useEffect } from 'react';
import { Resume } from './types/resume';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { TopBar } from './components/navigation/TopBar';
import { ResumeEditor } from './components/editor/ResumeEditor';
import { ResumeDocument } from './components/templates/ResumeDocument';
import { AIGenerateModal } from './components/modals/AIGenerateModal';
import { JobMatchModal } from './components/modals/JobMatchModal';
import { ATSScanModal } from './components/modals/ATSScanModal';
import { saveServerResume, fetchServerResumes } from './services/api';
import { 
  FileDown, 
  Sparkles, 
  Eye, 
  Edit3, 
  Layers, 
  CheckCircle,
  Briefcase,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

export default function App() {
  const [resumesList, setResumesList] = useState<Resume[]>(() => {
    try {
      const saved = localStorage.getItem('resumai_resumes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading local storage:', e);
    }
    return SAMPLE_RESUMES;
  });

  const [currentResumeId, setCurrentResumeId] = useState<string>(
    resumesList[0]?.id || SAMPLE_RESUMES[0].id
  );

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [activeTabMobile, setActiveTabMobile] = useState<'editor' | 'preview'>('editor');
  const [zoomScale, setZoomScale] = useState<number>(0.95);

  // Modals
  const [showAIGenerator, setShowAIGenerator] = useState<boolean>(false);
  const [showJobMatcher, setShowJobMatcher] = useState<boolean>(false);
  const [showATSScanner, setShowATSScanner] = useState<boolean>(false);

  // Current active resume
  const currentResume = resumesList.find((r) => r.id === currentResumeId) || resumesList[0] || SAMPLE_RESUMES[0];

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist to localStorage and sync with server
  const handleUpdateCurrentResume = (updated: Resume) => {
    const updatedList = resumesList.map((r) => (r.id === updated.id ? updated : r));
    setResumesList(updatedList);
    try {
      localStorage.setItem('resumai_resumes', JSON.stringify(updatedList));
      saveServerResume(updated);
    } catch (e) {
      console.warn('Failed to persist resume:', e);
    }
  };

  const handleSelectResume = (resume: Resume) => {
    setCurrentResumeId(resume.id);
  };

  const handleNewResume = () => {
    const newResume: Resume = {
      id: `resume-${Date.now()}`,
      title: 'New Resume Draft',
      targetRole: 'Software Engineer',
      updatedAt: new Date().toISOString(),
      personalInfo: {
        fullName: 'Candidate Name',
        headline: 'Professional Software Engineer',
        email: 'email@example.com',
        phone: '+1 (555) 000-0000',
        location: 'City, State',
        website: '',
        linkedin: '',
        github: '',
      },
      summary: 'Results-oriented engineer with experience designing and shipping scalable software solutions.',
      experience: [
        {
          id: `exp-${Date.now()}`,
          role: 'Software Engineer',
          company: 'Acme Corporation',
          location: 'San Francisco, CA',
          startDate: '2022-01',
          endDate: 'Present',
          current: true,
          highlights: [
            'Architected scalable backend services using Node.js and TypeScript, reducing request latency by 30%.',
            'Collaborated with cross-functional teams to build responsive frontend interfaces in React.',
          ],
        },
      ],
      education: [
        {
          id: `edu-${Date.now()}`,
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          location: 'City, State',
          startDate: '2018-09',
          endDate: '2022-05',
        },
      ],
      skills: {
        technical: ['TypeScript', 'JavaScript', 'Python', 'RESTful APIs'],
        frameworks: ['React', 'Express.js', 'Node.js', 'Tailwind CSS'],
        toolsAndCloud: ['Git', 'Docker', 'MongoDB', 'AWS'],
        softSkills: ['Team Collaboration', 'Problem Solving'],
      },
      projects: [],
      certifications: [],
      settings: {
        template: 'modern',
        accentColor: '#1e40af',
        fontFamily: 'sans',
        fontSize: 'base',
        spacing: 'normal',
        showIcons: true,
        sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
      },
    };

    const nextList = [newResume, ...resumesList];
    setResumesList(nextList);
    setCurrentResumeId(newResume.id);
    localStorage.setItem('resumai_resumes', JSON.stringify(nextList));
  };

  const handleApplyGenerated = (generated: Partial<Resume>) => {
    const merged: Resume = {
      ...currentResume,
      ...generated,
      id: currentResume.id,
      settings: currentResume.settings,
      updatedAt: new Date().toISOString(),
    };
    handleUpdateCurrentResume(merged);
  };

  const handleApplyTailoredResume = (tailored: Resume) => {
    handleUpdateCurrentResume(tailored);
  };

  const handleAddMissingSkill = (skill: string) => {
    const currentSkills = currentResume.skills.technical || [];
    if (!currentSkills.includes(skill)) {
      handleUpdateCurrentResume({
        ...currentResume,
        skills: {
          ...currentResume.skills,
          technical: [...currentSkills, skill],
        },
      });
    }
  };

  const handleApplyBulletFix = (
    experienceId: string,
    bulletIndex: number,
    newBullet: string
  ) => {
    const updatedExp = currentResume.experience.map((exp) => {
      if (exp.id === experienceId) {
        const nextHighlights = [...exp.highlights];
        nextHighlights[bulletIndex] = newBullet;
        return { ...exp, highlights: nextHighlights };
      }
      return exp;
    });
    handleUpdateCurrentResume({
      ...currentResume,
      experience: updatedExp,
    });
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Bar Contract (3 Zones) */}
      <TopBar
        currentResume={currentResume}
        resumesList={resumesList}
        onSelectResume={handleSelectResume}
        onNewResume={handleNewResume}
        onOpenAIGenerator={() => setShowAIGenerator(true)}
        onOpenJobMatcher={() => setShowJobMatcher(true)}
        onOpenATSScanner={() => setShowATSScanner(true)}
        onExportPDF={handleExportPDF}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Mobile view switcher tab */}
      <div className="no-print lg:hidden px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveTabMobile('editor')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTabMobile === 'editor'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          onClick={() => setActiveTabMobile('preview')}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTabMobile === 'preview'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: EDITING WORKBENCH */}
        <div
          className={`no-print lg:col-span-6 xl:col-span-5 h-[calc(100vh-5.5rem)] sticky top-16 ${
            activeTabMobile === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResumeEditor
            resume={currentResume}
            onChange={handleUpdateCurrentResume}
            onOpenAIGenerator={() => setShowAIGenerator(true)}
            onOpenJobMatcher={() => setShowJobMatcher(true)}
            onOpenATSScanner={() => setShowATSScanner(true)}
          />
        </div>

        {/* RIGHT COLUMN: DOCUMENT PREVIEW & PDF PRINT CONTAINER */}
        <div
          className={`print-container lg:col-span-6 xl:col-span-7 flex flex-col items-center ${
            activeTabMobile === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Preview Toolbar (Hidden in Print) */}
          <div className="no-print w-full max-w-[850px] mb-3 flex items-center justify-between text-xs px-2 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                A4 Document Preview
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[11px] text-slate-500 capitalize">
                {currentResume.settings?.template || 'Modern'} Template
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomScale((z) => Math.max(0.65, z - 0.05))}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] tabular-nums font-mono">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                onClick={() => setZoomScale((z) => Math.min(1.2, z + 0.05))}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="h-3 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1 px-2.5 py-1 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors font-medium text-xs"
              >
                <FileDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Render Document */}
          <div
            className="w-full max-w-[850px] shadow-lg rounded-sm overflow-hidden bg-white border border-slate-200 dark:border-slate-800 transition-transform origin-top"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
            }}
          >
            <ResumeDocument resume={currentResume} />
          </div>
        </div>
      </main>

      {/* MODALS */}
      <AIGenerateModal
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onApplyGenerated={handleApplyGenerated}
      />

      <JobMatchModal
        isOpen={showJobMatcher}
        onClose={() => setShowJobMatcher(false)}
        resume={currentResume}
        onApplyTailoredResume={handleApplyTailoredResume}
        onAddMissingSkill={handleAddMissingSkill}
      />

      <ATSScanModal
        isOpen={showATSScanner}
        onClose={() => setShowATSScanner(false)}
        resume={currentResume}
        onApplyBulletFix={handleApplyBulletFix}
      />
    </div>
  );
}
