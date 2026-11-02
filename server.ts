import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory document database for resumes (simulating MongoDB collection)
interface ResumeDoc {
  id: string;
  [key: string]: any;
}

let resumesCollection: ResumeDoc[] = [];

// Helper to ensure Gemini API key exists
function checkApiKey(res: Response): boolean {
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please verify your settings.',
    });
    return false;
  }
  return true;
}

// ==========================================
// RESUME CRUD API (Document Store / MongoDB equivalent)
// ==========================================
app.get('/api/resumes', (req: Request, res: Response) => {
  res.json({ success: true, resumes: resumesCollection });
});

app.post('/api/resumes', (req: Request, res: Response) => {
  const resume = req.body;
  if (!resume || !resume.id) {
    return res.status(400).json({ error: 'Valid resume object with id is required' });
  }
  const existingIdx = resumesCollection.findIndex((r) => r.id === resume.id);
  if (existingIdx >= 0) {
    resumesCollection[existingIdx] = { ...resume, updatedAt: new Date().toISOString() };
  } else {
    resumesCollection.push({ ...resume, updatedAt: new Date().toISOString() });
  }
  res.json({ success: true, resume });
});

app.put('/api/resumes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedResume = req.body;
  const existingIdx = resumesCollection.findIndex((r) => r.id === id);
  if (existingIdx >= 0) {
    resumesCollection[existingIdx] = { ...updatedResume, id, updatedAt: new Date().toISOString() };
    res.json({ success: true, resume: resumesCollection[existingIdx] });
  } else {
    resumesCollection.push({ ...updatedResume, id, updatedAt: new Date().toISOString() });
    res.json({ success: true, resume: updatedResume });
  }
});

app.delete('/api/resumes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  resumesCollection = resumesCollection.filter((r) => r.id !== id);
  res.json({ success: true, message: 'Resume deleted successfully' });
});

// ==========================================
// AI-POWERED RESUME BUILDER ENDPOINTS
// ==========================================

// 1. Full AI Resume Generator
app.post('/api/ai/generate-resume', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  const { targetRole, experienceLevel, keyAchievements, industry, rawDetails } = req.body;

  if (!targetRole) {
    return res.status(400).json({ error: 'targetRole is required' });
  }

  const prompt = `You are a world-class executive resume architect and top ATS optimization expert.
Generate a complete, highly persuasive, ATS-compliant professional resume in strictly valid JSON.

Candidate Details:
- Target Role: ${targetRole}
- Experience Level: ${experienceLevel || 'Mid to Senior'}
- Industry: ${industry || 'Technology & Software'}
- Key Achievements / Context: ${keyAchievements || 'Strong track record delivering scalable outcomes'}
- Extra Details: ${rawDetails || 'None provided'}

Instructions:
1. Craft an impactful 3-4 sentence Executive Summary emphasizing domain authority, key tech stack, and quantified business impact.
2. Generate 2 to 3 detailed Work Experience entries. Each entry must have 3 to 4 strong bullet points adhering strictly to the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]". Include realistic, impressive metrics (e.g. latency cut by 40%, revenue increased by $1.8M, 99.9% availability, 120k users).
3. Provide realistic Education details relevant to the role.
4. Provide categorized Skills (technical, frameworks, toolsAndCloud, softSkills) containing modern high-demand industry keywords.
5. Provide 1 to 2 impactful Projects with technology stack, live/repo links format, and quantified results.
6. Provide 1 to 2 industry-recognized Certifications.

Output strictly valid JSON with this structure:
{
  "title": "${targetRole} - Master Resume",
  "targetRole": "${targetRole}",
  "personalInfo": {
    "fullName": "First Last",
    "headline": "${targetRole} | Specialist Headline",
    "email": "candidate@example.com",
    "phone": "+1 (555) 234-5678",
    "location": "City, State",
    "website": "portfolio.dev",
    "linkedin": "linkedin.com/in/profile",
    "github": "github.com/profile"
  },
  "summary": "Executive summary...",
  "experience": [
    {
      "id": "exp-1",
      "role": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "Present",
      "current": true,
      "highlights": ["Accomplished X by doing Y resulting in Z metric..."]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "University Name",
      "degree": "Degree",
      "fieldOfStudy": "Major",
      "location": "City, State",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "gpa": "3.8 / 4.0",
      "honors": "Dean's List"
    }
  ],
  "skills": {
    "technical": ["Skill 1", "Skill 2"],
    "frameworks": ["Framework 1", "Framework 2"],
    "toolsAndCloud": ["Tool 1", "Cloud 1"],
    "softSkills": ["Leadership", "Stakeholder Management"]
  },
  "projects": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "role": "Role",
      "description": "Brief description",
      "technologies": ["Tech 1", "Tech 2"],
      "link": "https://github.com/...",
      "metrics": "Key metric result",
      "highlights": ["Impact highlight bullet..."]
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "Certification Name",
      "issuer": "Issuing Org",
      "date": "2024"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, resume: parsed });
  } catch (error: any) {
    console.error('Gemini generate-resume error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate resume using Gemini API',
    });
  }
});

// 2. AI Bullet Point Enhancer (Google XYZ Formula)
app.post('/api/ai/enhance-bullet', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  const { bullet, role, company, targetJobKeywords } = req.body;
  if (!bullet) {
    return res.status(400).json({ error: 'Original bullet point is required' });
  }

  const prompt = `You are an elite Silicon Valley resume coach. Transform the following resume bullet point into three high-impact, ATS-optimized variations.
Follow the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]".
Always use strong action verbs (e.g., Engineered, Spearheaded, Accelerated, Architected, Optimized).
Incorporate realistic metrics, percentages, time savings, or dollar values where applicable.

Role: ${role || 'Software Engineer'}
Company: ${company || 'Technology Company'}
Keywords to weave in naturally: ${targetJobKeywords || 'scalable, latency, efficiency'}

Original Bullet:
"${bullet}"

Output strictly valid JSON in this format:
{
  "variations": [
    {
      "type": "Metrics-Focused",
      "text": "...",
      "explanation": "Emphasizes quantitative efficiency and speed gains."
    },
    {
      "type": "Leadership & Architecture",
      "text": "...",
      "explanation": "Highlights technical decision-making and cross-functional coordination."
    },
    {
      "type": "Concise ATS High-Impact",
      "text": "...",
      "explanation": "Crisp single-line bullet packed with relevant keywords."
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Gemini enhance-bullet error:', error);
    return res.status(500).json({ error: error.message || 'Failed to enhance bullet' });
  }
});

// 3. AI Executive Summary Generator
app.post('/api/ai/generate-summary', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  const { targetRole, yearsExperience, topSkills, recentHighlights } = req.body;

  const prompt = `Write 3 compelling variations of a professional executive summary for a resume:
1. "Impact & Results-Driven": Focuses on concrete metrics and business scale.
2. "Technical Authority": Focuses on architecture, tech stack mastery, and best practices.
3. "Balanced Modern Professional": Polished blend of technical execution and leadership.

Details:
- Target Role: ${targetRole || 'Full Stack Engineer'}
- Experience Level: ${yearsExperience || '5+ years'}
- Top Skills: ${topSkills ? JSON.stringify(topSkills) : 'React, Node.js, Cloud, TypeScript'}
- Highlights: ${recentHighlights || 'Built scalable systems and improved system latency'}

Output strictly valid JSON:
{
  "options": [
    { "tone": "Results-Driven", "summary": "..." },
    { "tone": "Technical Authority", "summary": "..." },
    { "tone": "Modern Leader", "summary": "..." }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Gemini generate-summary error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate summary' });
  }
});

// 4. Job Description Matcher & Semantic Gap Analyzer
app.post('/api/ai/match-job', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  const { resume, jobDescription, targetTitle } = req.body;
  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Both resume and jobDescription are required' });
  }

  const prompt = `You are a senior recruiter and ATS algorithm engineer at a top tech company.
Analyze this candidate's resume against the target job description.

Candidate Resume Data:
${JSON.stringify({
  targetRole: resume.targetRole,
  summary: resume.summary,
  experience: resume.experience,
  skills: resume.skills,
  projects: resume.projects,
  education: resume.education,
})}

Target Job Description:
"""
${jobDescription}
"""

Evaluate:
1. ATS Keyword match percentage (0-100)
2. Matching keywords extracted from both
3. Missing critical skills/technologies found in JD but omitted in the resume
4. Overall Match Score (0-100) with breakdown across Keyword Match, Skills Match, Experience Fit, Seniority Fit
5. Concrete strengths aligned with the JD
6. Critical gaps or risks that might cause ATS filtering or recruiter rejection
7. 3-5 specific actionable suggestions on how to tweak the resume to score >90% without inventing false credentials.
8. 3 likely interview questions based on the intersection of JD requirements and candidate background.

Output strictly valid JSON with this exact structure:
{
  "jobTitle": "${targetTitle || 'Target Role'}",
  "matchScore": 84,
  "categoryScores": {
    "keywordMatch": 82,
    "skillsMatch": 88,
    "experienceFit": 85,
    "seniorityFit": 80
  },
  "matchingKeywords": ["TypeScript", "Node.js", "React", "REST APIs"],
  "missingKeywords": ["Docker", "GraphQL", "CI/CD"],
  "topStrengths": [
    "Strong evidence of full-stack system architecture with quantified metrics",
    "Direct experience in modern web frameworks requested in JD"
  ],
  "criticalGaps": [
    "Does not explicitly mention Docker containerization or CI/CD pipelines in experience bullets",
    "Could emphasize cloud microservice deployment more prominently"
  ],
  "actionableSuggestions": [
    {
      "section": "experience",
      "issue": "Missing mention of CI/CD automation",
      "recommendation": "Add a bullet point showing how you automated testing or deployment workflows with GitHub Actions or Docker.",
      "suggestedAddition": "Configured CI/CD automated test pipelines reducing release deployment cycle time by 30%."
    },
    {
      "section": "skills",
      "issue": "Missing key keywords found in JD",
      "recommendation": "Include Docker, Kubernetes, or GraphQL in your tools section if you have familiarity."
    }
  ],
  "interviewQuestionsPrep": [
    "How have you architected microservices to maintain sub-50ms latency under peak load?",
    "Can you describe your experience designing scalable schemas in MongoDB vs SQL?"
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, result: parsed });
  } catch (error: any) {
    console.error('Gemini match-job error:', error);
    return res.status(500).json({ error: error.message || 'Failed to match job description' });
  }
});

// 5. 1-Click Tailor Resume to Job Description
app.post('/api/ai/tailor-resume', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  const { resume, jobDescription } = req.body;
  if (!resume || !jobDescription) {
    return res.status(400).json({ error: 'Both resume and jobDescription are required' });
  }

  const prompt = `You are an expert resume optimizer. Given a candidate's existing resume and a target Job Description, tailor and enhance the resume to maximize ATS match score and recruiter appeal.

Rules:
- DO NOT invent fake companies or fake degrees.
- Rewrite the executive summary to directly address the JD's core problem statement and requirements.
- Re-align and sharpen work experience bullet points: weave in relevant keywords from the JD, emphasize matching accomplishments, and frame results using active verbs and metrics.
- Prioritize and reorganize skills: place the most relevant matching skills first.
- Keep the exact JSON schema of the input resume.

Candidate Resume:
${JSON.stringify(resume)}

Job Description:
"""
${jobDescription}
"""

Output the complete tailored Resume object in strictly valid JSON:
{
  ...same fields as input resume (personalInfo, summary, experience, education, skills, projects, certifications, settings)...
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    // Ensure ID and settings are preserved
    parsed.id = resume.id;
    parsed.settings = resume.settings || parsed.settings;
    parsed.updatedAt = new Date().toISOString();
    return res.json({ success: true, tailoredResume: parsed });
  } catch (error: any) {
    console.error('Gemini tailor-resume error:', error);
    return res.status(500).json({ error: error.message || 'Failed to tailor resume' });
  }
});

// 6. Comprehensive ATS Scanner & Rule Engine
app.post('/api/ai/ats-scan', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  const { resume } = req.body;
  if (!resume) {
    return res.status(400).json({ error: 'Resume is required' });
  }

  const prompt = `You are an Applicant Tracking System (ATS) parsing simulator and audit engine (like Workday, Taleo, Greenhouse, Lever).
Analyze this candidate's resume for ATS compliance, parseability, content strength, and formatting pitfalls.

Candidate Resume:
${JSON.stringify(resume)}

Analyze:
1. Overall ATS score (0-100).
2. Readability score (0-100).
3. Impact Quantification score (0-100: percentage of bullets with numbers, %, $).
4. Formatting score (0-100).
5. Bullet Strength score (0-100: action verbs, clarity, avoid passive voice like 'helped with', 'responsible for').
6. Detailed checks with status ('pass', 'warning', 'fail'), title, description, recommendation, and whether it can be auto-fixed.
7. Concrete quantification improvements: pick up to 3 bullets that lack numbers or are weak, and provide a revised high-impact alternative with rationale.

Output strictly valid JSON:
{
  "atsScore": 88,
  "readabilityScore": 92,
  "impactQuantificationScore": 84,
  "formattingScore": 95,
  "bulletStrengthScore": 86,
  "checks": [
    {
      "id": "contact_info",
      "status": "pass",
      "title": "Contact Header Completeness",
      "description": "Full name, email, phone, and professional profile links are cleanly structured.",
      "recommendation": "Keep standard plain text formatting."
    },
    {
      "id": "quantified_bullets",
      "status": "warning",
      "title": "Metric Quantification Density",
      "description": "78% of your experience bullets contain quantifiable metrics. ATS algorithms favor high metric density.",
      "recommendation": "Add measurable outcomes (time saved, % improvement, revenue, team size) to all bullets.",
      "canAutoFix": true
    },
    {
      "id": "action_verbs",
      "status": "pass",
      "title": "Strong Action Verbs",
      "description": "Bullets begin with impactful action verbs like 'Architected', 'Spearheaded', 'Engineered'.",
      "recommendation": "Maintain dynamic verb variety across positions."
    },
    {
      "id": "skills_categorization",
      "status": "pass",
      "title": "Categorized Skills Section",
      "description": "Skills are cleanly categorized, making automated keyword extraction seamless for ATS bots.",
      "recommendation": "Ensure keywords match exact spellings in job postings."
    }
  ],
  "quantificationSuggestions": [
    {
      "experienceId": "${resume.experience?.[0]?.id || 'exp-1'}",
      "bulletIndex": 0,
      "originalBullet": "Worked on backend APIs and databases.",
      "suggestedBullet": "Architected resilient Node.js REST APIs and MongoDB data models, improving query throughput by 38% under 2M daily requests.",
      "rationale": "Replaces generic passive phrasing with specific tech and quantified throughput gain."
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, scanResult: parsed });
  } catch (error: any) {
    console.error('Gemini ats-scan error:', error);
    return res.status(500).json({ error: error.message || 'Failed to scan resume' });
  }
});

// ==========================================
// STATIC ASSETS & VITE INTEGRATION
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: Mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumAI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
