import React, { useState } from 'react';
import { Resume, JobMatchResult } from '../../types/resume';
import { matchJobWithAI, tailorResumeWithAI } from '../../services/api';
import { SAMPLE_JOB_DESCRIPTIONS } from '../../data/sampleResumes';
import { 
  Briefcase, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Loader2,
  Plus,
  Wand2
} from 'lucide-react';

interface JobMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
  onApplyTailoredResume: (tailored: Resume) => void;
  onAddMissingSkill: (skill: string) => void;
}

export const JobMatchModal: React.FC<JobMatchModalProps> = ({
  isOpen,
  onClose,
  resume,
  onApplyTailoredResume,
  onAddMissingSkill,
}) => {
  const [jobDescription, setJobDescription] = useState<string>(
    SAMPLE_JOB_DESCRIPTIONS[0]?.text || ''
  );
  const [targetTitle, setTargetTitle] = useState<string>(
    SAMPLE_JOB_DESCRIPTIONS[0]?.title || 'Senior Full-Stack Engineer'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description to analyze');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await matchJobWithAI({
        resume,
        jobDescription,
        targetTitle,
      });
      setMatchResult(result);
    } catch (err: any) {
      setError(err.message || 'Error analyzing job match');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) return;
    setIsTailoring(true);
    setError(null);
    try {
      const tailored = await tailorResumeWithAI({
        resume,
        jobDescription,
      });
      onApplyTailoredResume(tailored);
      alert('Your resume has been intelligently tailored to this job description!');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error tailoring resume');
    } finally {
      setIsTailoring(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400 border-amber-500';
    return 'text-rose-600 dark:text-rose-400 border-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Job Description Matcher & ATS Gap Analyzer
              </h2>
              <p className="text-xs text-slate-500">
                Compare your resume directly against target employer requirements using Gemini
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
          {/* Sample Job Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Load Sample Job Description:
              </span>
              <span className="text-[11px] text-slate-400">
                or paste your target role below
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_JOB_DESCRIPTIONS.map((job, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTargetTitle(job.title);
                    setJobDescription(job.text);
                  }}
                  className="px-2.5 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all text-slate-700 dark:text-slate-300"
                >
                  {job.company} · {job.title}
                </button>
              ))}
            </div>
          </div>

          {/* Job Description Input */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Job Posting / Requirements
            </label>
            <textarea
              rows={5}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-[11px] leading-relaxed"
              placeholder="Paste job posting text here..."
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleRunMatch}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating ATS Match with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Alignment & Match Score</span>
                </>
              )}
            </button>

            {matchResult && (
              <button
                onClick={handleTailorResume}
                disabled={isTailoring}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors disabled:opacity-50"
              >
                {isTailoring ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Tailoring Resume...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>1-Click Tailor Resume to this JD</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* MATCH ANALYSIS RESULTS */}
          {matchResult && (
            <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              {/* Score strip */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-lg tabular-nums ${getScoreColor(
                      matchResult.matchScore
                    )}`}
                  >
                    {matchResult.matchScore}%
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Overall JD Match Score
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {matchResult.matchScore >= 80
                        ? 'Excellent qualification alignment. High likelihood of passing ATS filters.'
                        : matchResult.matchScore >= 60
                        ? 'Moderate match. Tailoring keywords will significantly boost interview callbacks.'
                        : 'Significant keyword and requirement gaps detected.'}
                    </span>
                  </div>
                </div>

                {/* Subcategory breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-slate-400 block">Keywords</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {matchResult.categoryScores.keywordMatch}%
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-slate-400 block">Skills</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {matchResult.categoryScores.skillsMatch}%
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-slate-400 block">Experience</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {matchResult.categoryScores.experienceFit}%
                    </span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-slate-400 block">Seniority</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {matchResult.categoryScores.seniorityFit}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Keywords Alignment: Matching vs Missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Matching Keywords */}
                <div className="p-3 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-lg space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matching Keywords ({matchResult.matchingKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 rounded text-[11px] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-3 border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Missing Critical Keywords ({matchResult.missingKeywords.length})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Click to add to skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingKeywords.map((kw, i) => (
                      <button
                        key={i}
                        onClick={() => onAddMissingSkill(kw)}
                        title="Add this skill to your resume"
                        className="px-2 py-0.5 bg-rose-100/70 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-800/60 text-rose-800 dark:text-rose-200 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>{kw}</span>
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    Key Strengths for this Role
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-outside ml-3.5">
                    {matchResult.topStrengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    Critical Gaps to Address
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-outside ml-3.5">
                    {matchResult.criticalGaps.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Suggestions */}
              {matchResult.actionableSuggestions && matchResult.actionableSuggestions.length > 0 && (
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                    Actionable Tailoring Suggestions:
                  </span>
                  <div className="space-y-2">
                    {matchResult.actionableSuggestions.map((sug, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200/80 dark:border-slate-700/60 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                            {sug.section}
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {sug.issue}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {sug.recommendation}
                        </p>
                        {sug.suggestedAddition && (
                          <div className="mt-1 p-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                            <span className="font-semibold">Suggested Bullet: </span>
                            {sug.suggestedAddition}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Likely Interview Questions */}
              {matchResult.interviewQuestionsPrep && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                    Targeted Interview Prep Questions
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-outside ml-3.5">
                    {matchResult.interviewQuestionsPrep.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
