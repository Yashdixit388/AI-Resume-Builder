import React, { useState } from 'react';
import { Resume, ExperienceItem, ProjectItem, EducationItem, CertificationItem } from '../../types/resume';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award, 
  User, 
  FileText,
  Sliders,
  Check,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { enhanceBulletWithAI, generateSummaryWithAI } from '../../services/api';

interface ResumeEditorProps {
  resume: Resume;
  onChange: (updated: Resume) => void;
  onOpenAIGenerator: () => void;
  onOpenJobMatcher: () => void;
  onOpenATSScanner: () => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  onChange,
  onOpenAIGenerator,
  onOpenJobMatcher,
  onOpenATSScanner,
}) => {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [enhancingBullet, setEnhancingBullet] = useState<{ expId: string; index: number } | null>(null);
  const [bulletVariations, setBulletVariations] = useState<{
    expId: string;
    index: number;
    variations: Array<{ type: string; text: string; explanation: string }>;
  } | null>(null);
  const [isEnhancingLoading, setIsEnhancingLoading] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<Array<{ tone: string; summary: string }> | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // Helper updates
  const updatePersonalInfo = (key: keyof Resume['personalInfo'], val: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [key]: val,
      },
    });
  };

  const updateSummary = (summary: string) => {
    onChange({ ...resume, summary });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Company Name',
      location: 'City, State',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      highlights: ['Engineered scalable microservice improving system throughput by 35%.'],
    };
    onChange({ ...resume, experience: [newExp, ...resume.experience] });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: any) => {
    const updated = resume.experience.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onChange({ ...resume, experience: updated });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...resume,
      experience: resume.experience.filter((item) => item.id !== id),
    });
  };

  const addExperienceBullet = (expId: string) => {
    const updated = resume.experience.map((item) => {
      if (item.id === expId) {
        return {
          ...item,
          highlights: [...item.highlights, 'Accelerated feature deployment velocity by 25% by introducing automated test suites.'],
        };
      }
      return item;
    });
    onChange({ ...resume, experience: updated });
  };

  const updateExperienceBullet = (expId: string, index: number, text: string) => {
    const updated = resume.experience.map((item) => {
      if (item.id === expId) {
        const highlights = [...item.highlights];
        highlights[index] = text;
        return { ...item, highlights };
      }
      return item;
    });
    onChange({ ...resume, experience: updated });
  };

  const removeExperienceBullet = (expId: string, index: number) => {
    const updated = resume.experience.map((item) => {
      if (item.id === expId) {
        return {
          ...item,
          highlights: item.highlights.filter((_, i) => i !== index),
        };
      }
      return item;
    });
    onChange({ ...resume, experience: updated });
  };

  // AI Bullet enhancement trigger
  const handleEnhanceBullet = async (expId: string, index: number, originalBullet: string) => {
    const exp = resume.experience.find((e) => e.id === expId);
    setEnhancingBullet({ expId, index });
    setIsEnhancingLoading(true);
    setBulletVariations(null);

    try {
      const res = await enhanceBulletWithAI({
        bullet: originalBullet,
        role: exp?.role,
        company: exp?.company,
        targetJobKeywords: resume.targetRole,
      });
      setBulletVariations({
        expId,
        index,
        variations: res.variations,
      });
    } catch (err: any) {
      alert(err.message || 'Error enhancing bullet with AI');
    } finally {
      setIsEnhancingLoading(false);
    }
  };

  const applyBulletVariation = (expId: string, index: number, newText: string) => {
    updateExperienceBullet(expId, index, newText);
    setBulletVariations(null);
    setEnhancingBullet(null);
  };

  // AI Summary generator trigger
  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    setSummaryOptions(null);
    try {
      const topSkills = [
        ...(resume.skills.technical || []),
        ...(resume.skills.frameworks || []),
      ].slice(0, 8);
      const res = await generateSummaryWithAI({
        targetRole: resume.targetRole || resume.personalInfo.headline,
        yearsExperience: '5+ years',
        topSkills,
        recentHighlights: resume.experience[0]?.highlights?.[0] || '',
      });
      setSummaryOptions(res.options);
    } catch (err: any) {
      alert(err.message || 'Error generating summary');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // Skills handlers
  const handleSkillsChange = (category: keyof Resume['skills'], text: string) => {
    const items = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({
      ...resume,
      skills: {
        ...resume.skills,
        [category]: items,
      },
    });
  };

  // Projects handlers
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: 'Cloud Workflow Engine',
      role: 'Creator & Lead',
      description: 'Distributed microservice orchestration platform.',
      technologies: ['TypeScript', 'Node.js', 'Express', 'Redis'],
      metrics: 'Over 1,000 GitHub stars and 20k weekly downloads',
      highlights: ['Designed high-throughput Redis pipeline cutting job queue latency by 45%.'],
    };
    onChange({ ...resume, projects: [newProj, ...resume.projects] });
  };

  const updateProject = (id: string, field: keyof ProjectItem, val: any) => {
    const updated = resume.projects.map((item) => {
      if (item.id === id) return { ...item, [field]: val };
      return item;
    });
    onChange({ ...resume, projects: updated });
  };

  const removeProject = (id: string) => {
    onChange({
      ...resume,
      projects: resume.projects.filter((p) => p.id !== id),
    });
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'State University',
      degree: 'B.S.',
      fieldOfStudy: 'Computer Science',
      location: 'City, State',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.8 / 4.0',
    };
    onChange({ ...resume, education: [...resume.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: any) => {
    const updated = resume.education.map((item) => {
      if (item.id === id) return { ...item, [field]: val };
      return item;
    });
    onChange({ ...resume, education: updated });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...resume,
      education: resume.education.filter((e) => e.id !== id),
    });
  };

  // Settings update
  const updateSettings = (key: keyof Resume['settings'], val: any) => {
    onChange({
      ...resume,
      settings: {
        ...resume.settings,
        [key]: val,
      },
    });
  };

  const sections = [
    { id: 'personal', label: 'Contact & Header', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: `Experience (${resume.experience.length})`, icon: Briefcase },
    { id: 'projects', label: `Projects (${resume.projects.length})`, icon: FolderGit2 },
    { id: 'skills', label: 'Skills & Keywords', icon: Wrench },
    { id: 'education', label: `Education (${resume.education.length})`, icon: GraduationCap },
    { id: 'styling', label: 'Design & Templates', icon: Sliders },
  ];

  const accentColors = [
    { label: 'Executive Navy', hex: '#1e40af' },
    { label: 'Modern Teal', hex: '#0f766e' },
    { label: 'Monochrome Slate', hex: '#0f172a' },
    { label: 'Royal Violet', hex: '#6d28d9' },
    { label: 'Burgundy Crimson', hex: '#991b1b' },
    { label: 'Warm Bronze', hex: '#92400e' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
      {/* Top Action Bar */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate with AI</span>
          </button>
          <button
            onClick={onOpenJobMatcher}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Match Job Description</span>
          </button>
          <button
            onClick={onOpenATSScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Scan ATS Health</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-3 bg-white dark:bg-slate-900 overflow-x-auto gap-1">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Content Body */}
      <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">
        {/* SECTION: PERSONAL INFO */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Alex Vance"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Professional Headline
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.headline}
                  onChange={(e) => updatePersonalInfo('headline', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Senior Full-Stack Engineer | React & Node.js"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="alex@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location (City, State / Country)
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="linkedin.com/in/alexvance"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.github || ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="github.com/alexvance"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Portfolio / Website
                </label>
                <input
                  type="text"
                  value={resume.personalInfo.website || ''}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="alexvance.dev"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SUMMARY */}
        {activeSection === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Executive Summary
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-impact 3-4 sentence narrative framing your career scope, tech stack, and measurable impact.
                </p>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={isSummaryLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                {isSummaryLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Generate with AI</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={resume.summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="w-full text-xs p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              placeholder="e.g. High-impact Full-Stack Software Engineer with 6+ years designing scalable cloud architectures..."
            />

            {/* AI Generated Options */}
            {summaryOptions && summaryOptions.length > 0 && (
              <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-lg space-y-2.5">
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                  AI Generated Variations (Click to Apply):
                </span>
                <div className="space-y-2">
                  {summaryOptions.map((opt, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        updateSummary(opt.summary);
                        setSummaryOptions(null);
                      }}
                      className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs cursor-pointer hover:border-indigo-500 hover:shadow-xs transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {opt.tone}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          Use This <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {opt.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION: WORK EXPERIENCE */}
        {activeSection === 'experience' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Professional Experience
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quantify achievements with the Google XYZ formula: "Accomplished [X] measured by [Y] by doing [Z]".
                </p>
              </div>
              <button
                onClick={addExperience}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {exp.role || 'Position Title'} at {exp.company || 'Company'}
                    </span>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Remove Position"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Start Date
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="YYYY-MM (e.g. 2022-01)"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        End Date
                      </label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Present or YYYY-MM"
                      />
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Impact Bullet Points ({exp.highlights.length})
                      </span>
                      <button
                        onClick={() => addExperienceBullet(exp.id)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {exp.highlights.map((bullet, bIdx) => {
                      const isThisEnhancing =
                        enhancingBullet?.expId === exp.id && enhancingBullet?.index === bIdx;
                      const hasVariations =
                        bulletVariations?.expId === exp.id && bulletVariations?.index === bIdx;

                      return (
                        <div key={bIdx} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 text-xs mt-2">·</span>
                            <textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) =>
                                updateExperienceBullet(exp.id, bIdx, e.target.value)
                              }
                              className="flex-1 text-xs p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                            />
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => handleEnhanceBullet(exp.id, bIdx, bullet)}
                                disabled={isEnhancingLoading}
                                title="Enhance this bullet with AI using Google XYZ Formula"
                                className="p-1.5 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded border border-indigo-200 dark:border-indigo-800 transition-colors"
                              >
                                {isThisEnhancing && isEnhancingLoading ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => removeExperienceBullet(exp.id, bIdx)}
                                title="Delete bullet"
                                className="p-1.5 text-xs text-slate-400 hover:text-red-500 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* AI Enhancement Variations */}
                          {hasVariations && bulletVariations && (
                            <div className="p-3 ml-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-lg space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-indigo-600" />
                                  AI Metric Rewrites (Click to apply)
                                </span>
                                <button
                                  onClick={() => setBulletVariations(null)}
                                  className="text-[10px] text-slate-500 hover:text-slate-700"
                                >
                                  Close
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                {bulletVariations.variations.map((v, vIdx) => (
                                  <div
                                    key={vIdx}
                                    onClick={() => applyBulletVariation(exp.id, bIdx, v.text)}
                                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 rounded text-xs cursor-pointer transition-all hover:shadow-xs"
                                  >
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="font-semibold text-[11px] text-indigo-600 dark:text-indigo-400">
                                        {v.type}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        {v.explanation}
                                      </span>
                                    </div>
                                    <p className="text-slate-800 dark:text-slate-200 leading-snug">
                                      {v.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: SKILLS */}
        {activeSection === 'skills' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Technical Skills & Keywords
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comma-separated keywords parsed directly by ATS bots and recruiters.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Programming Languages & Core Tech
                </label>
                <input
                  type="text"
                  value={resume.skills.technical?.join(', ') || ''}
                  onChange={(e) => handleSkillsChange('technical', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="TypeScript, Python, JavaScript, Go, SQL..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Frameworks & Libraries
                </label>
                <input
                  type="text"
                  value={resume.skills.frameworks?.join(', ') || ''}
                  onChange={(e) => handleSkillsChange('frameworks', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="React, Next.js, Express, Node.js, Tailwind CSS..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tools, Databases & Cloud Infrastructure
                </label>
                <input
                  type="text"
                  value={resume.skills.toolsAndCloud?.join(', ') || ''}
                  onChange={(e) => handleSkillsChange('toolsAndCloud', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="MongoDB, PostgreSQL, Redis, Docker, AWS, Gemini API, Git..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Leadership, Agile & Methodology
                </label>
                <input
                  type="text"
                  value={resume.skills.softSkills?.join(', ') || ''}
                  onChange={(e) => handleSkillsChange('softSkills', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="System Design, Engineering Mentorship, Agile/Scrum, Stakeholder Management..."
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: PROJECTS */}
        {activeSection === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Featured Projects
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Demonstrate practical application of high-demand skills with measurable proof points.
                </p>
              </div>
              <button
                onClick={addProject}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {proj.name || 'Project Name'}
                    </span>
                    <button
                      onClick={() => removeProject(proj.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Metrics / Impact Summary
                      </label>
                      <input
                        type="text"
                        value={proj.metrics || ''}
                        onChange={(e) => updateProject(proj.id, 'metrics', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                        placeholder="e.g. 5,000+ active users, 1.2k stars"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Technologies Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.technologies?.join(', ') || ''}
                      onChange={(e) =>
                        updateProject(
                          proj.id,
                          'technologies',
                          e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      placeholder="React, Node.js, Express, Gemini API..."
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Brief Description
                    </label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      className="w-full text-xs p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: EDUCATION */}
        {activeSection === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  Education & Honors
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Degrees, institutions, academic honors, and graduation dates.
                </p>
              </div>
              <button
                onClick={addEducation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {edu.degree} in {edu.fieldOfStudy}
                    </span>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Degree & Field
                      </label>
                      <input
                        type="text"
                        value={`${edu.degree} in ${edu.fieldOfStudy}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(' in ');
                          updateEducation(edu.id, 'degree', parts[0] || e.target.value);
                          if (parts[1]) updateEducation(edu.id, 'fieldOfStudy', parts[1]);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Dates Attended
                      </label>
                      <input
                        type="text"
                        value={`${edu.startDate} – ${edu.endDate}`}
                        onChange={(e) => {
                          const [s, end] = e.target.value.split('–').map((x) => x.trim());
                          if (s) updateEducation(edu.id, 'startDate', s);
                          if (end) updateEducation(edu.id, 'endDate', end);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        GPA / Honors
                      </label>
                      <input
                        type="text"
                        value={edu.honors || edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                        placeholder="e.g. Magna Cum Laude, GPA: 3.8/4.0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: STYLING & TEMPLATES */}
        {activeSection === 'styling' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Resume Format & Visual Styling
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch templates, adjust color palettes, typography, and density for 100% ATS readability.
              </p>
            </div>

            {/* Template Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Template Layout
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'modern', name: 'Modern Clean', desc: 'Standard tech & corporate layout' },
                  { id: 'minimal', name: 'Silicon Valley ATS', desc: 'Single-column maximum parse rate' },
                  { id: 'executive', name: 'Executive Masthead', desc: 'Serif centered top title' },
                  { id: 'compact', name: 'Compact Density', desc: '1-Page optimized spacing' },
                ].map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => updateSettings('template', tmpl.id)}
                    className={`p-3 text-left border rounded-lg transition-all ${
                      resume.settings?.template === tmpl.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-xs font-bold">{tmpl.name}</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{tmpl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Accent Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {accentColors.map((color) => {
                  const isSelected = resume.settings?.accentColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => updateSettings('accentColor', color.hex)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-slate-900 dark:border-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Typography Style
                </label>
                <select
                  value={resume.settings?.fontFamily || 'sans'}
                  onChange={(e) => updateSettings('fontFamily', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="sans">Plus Jakarta Sans (Contemporary)</option>
                  <option value="serif">Lora (Executive Editorial Serif)</option>
                  <option value="mono">JetBrains Mono (Technical)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Font Size
                </label>
                <select
                  value={resume.settings?.fontSize || 'base'}
                  onChange={(e) => updateSettings('fontSize', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="sm">Small (Dense / Fit on 1 Page)</option>
                  <option value="base">Standard (Balanced)</option>
                  <option value="lg">Large (Roomy)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Vertical Spacing
                </label>
                <select
                  value={resume.settings?.spacing || 'normal'}
                  onChange={(e) => updateSettings('spacing', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                >
                  <option value="compact">Compact (Fit 1 page)</option>
                  <option value="normal">Normal (Recommended)</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
