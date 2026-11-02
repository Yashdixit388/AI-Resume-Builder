import React, { useState } from 'react';
import { Resume } from '../../types/resume';
import { generateResumeWithAI } from '../../services/api';
import { Sparkles, X, Check, Loader2, ArrowRight } from 'lucide-react';

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGenerated: (newResume: Partial<Resume>) => void;
}

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  isOpen,
  onClose,
  onApplyGenerated,
}) => {
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Senior (5-8 years)');
  const [industry, setIndustry] = useState('Enterprise Cloud & AI');
  const [keyAchievements, setKeyAchievements] = useState(
    'Led migration to microservices, optimized latency by 40%, integrated GenAI models, managed team of 6 engineers.'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResume, setGeneratedResume] = useState<Partial<Resume> | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError('Please provide a target role title');
      return;
    }
    setLoading(true);
    setError(null);
    setGeneratedResume(null);

    try {
      const result = await generateResumeWithAI({
        targetRole,
        experienceLevel,
        industry,
        keyAchievements,
      });
      setGeneratedResume(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate resume with AI. Please check your network and API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedResume) {
      onApplyGenerated(generatedResume);
      onClose();
    }
  };

  const rolePresets = [
    {
      title: 'Senior Full-Stack Engineer',
      level: 'Senior (5-8 years)',
      industry: 'Cloud & AI SaaS',
      achievements: 'Architected high-throughput Node.js microservices, built React 19 UI, cut latency by 45%, managed sharded MongoDB database.',
    },
    {
      title: 'AI Product Manager',
      level: 'Lead / Staff (7+ years)',
      industry: 'Enterprise Software & ML',
      achievements: 'Launched GenAI copilot generating $12M ARR, reduced hallucination rate by 65%, aligned engineering, design, and GTM teams.',
    },
    {
      title: 'Cloud DevOps & Systems Architect',
      level: 'Senior (6+ years)',
      industry: 'Infrastructure & Security',
      achievements: 'Engineered multi-region AWS/Kubernetes architecture with 99.99% uptime, reduced cloud spend by $180k/yr, automated CI/CD pipelines.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                AI Resume Architect
              </h2>
              <p className="text-xs text-slate-500">
                Generate a tailored, ATS-optimized master resume using Gemini 3.8 Flash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Quick presets */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Quick Role Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {rolePresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTargetRole(preset.title);
                    setExperienceLevel(preset.level);
                    setIndustry(preset.industry);
                    setKeyAchievements(preset.achievements);
                  }}
                  className="px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all text-slate-700 dark:text-slate-300"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Job Title *
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Senior Full-Stack Engineer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Seniority Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Entry-level (0-2 years)">Entry-level (0-2 years)</option>
                <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
                <option value="Senior (5-8 years)">Senior (5-8 years)</option>
                <option value="Lead / Staff (8-12 years)">Lead / Staff (8-12 years)</option>
                <option value="Director / Executive">Director / Executive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Industry / Domain
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="e.g. Fintech, Cloud SaaS, HealthTech"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Key Achievements, Projects, or Raw Background Notes
            </label>
            <textarea
              rows={3}
              value={keyAchievements}
              onChange={(e) => setKeyAchievements(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Mention any tech stacks, quantifiable results, company names, or accomplishments..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Generated Preview Card */}
          {generatedResume && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Resume Generated Successfully
                </span>
                <span className="text-[11px] text-slate-500">
                  {generatedResume.experience?.length || 0} Positions · {generatedResume.projects?.length || 0} Projects
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                <span className="font-semibold">Summary Preview: </span>
                {generatedResume.summary}
              </p>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-900/40">
                <button
                  onClick={handleApply}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors"
                >
                  <span>Apply to Current Resume</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Crafting Resume with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Resume</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
