import { Resume, JobMatchResult, ATSScanResult } from '../types/resume';

export async function generateResumeWithAI(params: {
  targetRole: string;
  experienceLevel?: string;
  industry?: string;
  keyAchievements?: string;
  rawDetails?: string;
}): Promise<Partial<Resume>> {
  const res = await fetch('/api/ai/generate-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to generate resume (${res.status})`);
  }
  const data = await res.json();
  return data.resume;
}

export async function enhanceBulletWithAI(params: {
  bullet: string;
  role?: string;
  company?: string;
  targetJobKeywords?: string;
}): Promise<{
  variations: Array<{
    type: string;
    text: string;
    explanation: string;
  }>;
}> {
  const res = await fetch('/api/ai/enhance-bullet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to enhance bullet (${res.status})`);
  }
  return res.json();
}

export async function generateSummaryWithAI(params: {
  targetRole?: string;
  yearsExperience?: string;
  topSkills?: string[];
  recentHighlights?: string;
}): Promise<{
  options: Array<{ tone: string; summary: string }>;
}> {
  const res = await fetch('/api/ai/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to generate summary (${res.status})`);
  }
  return res.json();
}

export async function matchJobWithAI(params: {
  resume: Resume;
  jobDescription: string;
  targetTitle?: string;
}): Promise<JobMatchResult> {
  const res = await fetch('/api/ai/match-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to match job description (${res.status})`);
  }
  const data = await res.json();
  return data.result;
}

export async function tailorResumeWithAI(params: {
  resume: Resume;
  jobDescription: string;
}): Promise<Resume> {
  const res = await fetch('/api/ai/tailor-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to tailor resume (${res.status})`);
  }
  const data = await res.json();
  return data.tailoredResume;
}

export async function scanATSWithAI(params: {
  resume: Resume;
}): Promise<ATSScanResult> {
  const res = await fetch('/api/ai/ats-scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to run ATS scan (${res.status})`);
  }
  const data = await res.json();
  return data.scanResult;
}

export async function fetchServerResumes(): Promise<Resume[]> {
  try {
    const res = await fetch('/api/resumes');
    if (!res.ok) return [];
    const data = await res.json();
    return data.resumes || [];
  } catch (err) {
    console.warn('Could not fetch resumes from server:', err);
    return [];
  }
}

export async function saveServerResume(resume: Resume): Promise<void> {
  try {
    await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });
  } catch (err) {
    console.warn('Could not save resume to server:', err);
  }
}
