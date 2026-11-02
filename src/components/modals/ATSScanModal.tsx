import React, { useState, useEffect } from 'react';
import { Resume, ATSScanResult } from '../../types/resume';
import { scanATSWithAI } from '../../services/api';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  X, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface ATSScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
  onApplyBulletFix: (experienceId: string, bulletIndex: number, newBullet: string) => void;
}

export const ATSScanModal: React.FC<ATSScanModalProps> = ({
  isOpen,
  onClose,
  resume,
  onApplyBulletFix,
}) => {
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ATSScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !scanResult) {
      runScan();
    }
  }, [isOpen]);

  const runScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await scanATSWithAI({ resume });
      setScanResult(result);
    } catch (err: any) {
      setError(err.message || 'Error running ATS analysis');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400 border-amber-500';
    return 'text-rose-600 dark:text-rose-400 border-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                ATS Compatibility & Improvement Audit
              </h2>
              <p className="text-xs text-slate-500">
                Full-spectrum scan of parsing rules, metric quantification, and action verbs
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
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm block">
                  Simulating ATS Parser & Audit Engine...
                </span>
                <span className="text-xs text-slate-400">
                  Checking font encoding, action verb variety, metric density, and keyword extractability
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-lg text-red-700 dark:text-red-300">
              {error}
              <button
                onClick={runScan}
                className="block mt-2 font-bold text-xs underline"
              >
                Try Again
              </button>
            </div>
          )}

          {scanResult && !loading && (
            <div className="space-y-4">
              {/* Overall Score Dial */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-lg tabular-nums ${getScoreColor(
                      scanResult.atsScore
                    )}`}
                  >
                    {scanResult.atsScore}
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Overall ATS Readiness Score
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {scanResult.atsScore >= 85
                        ? 'High probability of passing automated filters and reaching recruiters.'
                        : 'Actionable improvements needed to maximize visibility.'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={runScan}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Re-Scan
                </button>
              </div>

              {/* Sub-Score Category Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="text-slate-400 block mb-0.5">Readability</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tabular-nums">
                    {scanResult.readabilityScore}%
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="text-slate-400 block mb-0.5">Quantification</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tabular-nums">
                    {scanResult.impactQuantificationScore}%
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="text-slate-400 block mb-0.5">Formatting</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tabular-nums">
                    {scanResult.formattingScore}%
                  </span>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <span className="text-slate-400 block mb-0.5">Action Verbs</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm tabular-nums">
                    {scanResult.bulletStrengthScore}%
                  </span>
                </div>
              </div>

              {/* Check items */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs uppercase tracking-wider">
                  Audit Findings & Recommendations:
                </span>
                {scanResult.checks.map((check) => {
                  const isPass = check.status === 'pass';
                  const isWarn = check.status === 'warning';
                  const Icon = isPass ? CheckCircle2 : isWarn ? AlertTriangle : XCircle;
                  const iconColor = isPass
                    ? 'text-emerald-500'
                    : isWarn
                    ? 'text-amber-500'
                    : 'text-rose-500';

                  return (
                    <div
                      key={check.id}
                      className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {check.title}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 ml-6 text-xs leading-relaxed">
                        {check.description}
                      </p>
                      {check.recommendation && (
                        <p className="text-slate-500 dark:text-slate-400 ml-6 text-[11px] font-medium">
                          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                            Tip:
                          </span>{' '}
                          {check.recommendation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quantification Suggestions with Auto-Fix */}
              {scanResult.quantificationSuggestions &&
                scanResult.quantificationSuggestions.length > 0 && (
                  <div className="p-3 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-lg space-y-2.5">
                    <span className="font-bold text-indigo-950 dark:text-indigo-200 block text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Suggested Metric Upgrades (1-Click Auto-Fix)
                    </span>
                    <div className="space-y-2">
                      {scanResult.quantificationSuggestions.map((sug, i) => (
                        <div
                          key={i}
                          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5"
                        >
                          <div className="text-[11px] text-slate-400 line-through">
                            {sug.originalBullet}
                          </div>
                          <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            {sug.suggestedBullet}
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-500 italic">
                              {sug.rationale}
                            </span>
                            <button
                              onClick={() => {
                                onApplyBulletFix(
                                  sug.experienceId,
                                  sug.bulletIndex,
                                  sug.suggestedBullet
                                );
                                alert('Applied upgraded metric bullet to your resume!');
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
                            >
                              <span>Apply Upgrade</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
