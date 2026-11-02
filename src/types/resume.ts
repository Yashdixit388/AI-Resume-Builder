export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillsCategory {
  technical: string[];
  frameworks: string[];
  toolsAndCloud: string[];
  softSkills: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  description: string;
  technologies: string[];
  link?: string;
  metrics?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeSettings {
  template: 'modern' | 'minimal' | 'executive' | 'compact';
  accentColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'sm' | 'base' | 'lg';
  spacing: 'compact' | 'normal' | 'spacious';
  showIcons: boolean;
  sectionOrder: string[];
}

export interface Resume {
  id: string;
  title: string;
  targetRole: string;
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillsCategory;
  projects: ProjectItem[];
  certifications: CertificationItem[];
  settings: ResumeSettings;
}

export interface JobMatchResult {
  jobTitle: string;
  company?: string;
  matchScore: number;
  categoryScores: {
    keywordMatch: number;
    skillsMatch: number;
    experienceFit: number;
    seniorityFit: number;
  };
  matchingKeywords: string[];
  missingKeywords: string[];
  topStrengths: string[];
  criticalGaps: string[];
  actionableSuggestions: Array<{
    section: 'summary' | 'experience' | 'skills' | 'projects';
    issue: string;
    recommendation: string;
    suggestedAddition?: string;
  }>;
  interviewQuestionsPrep: string[];
}

export interface ATSScanResult {
  atsScore: number;
  readabilityScore: number;
  impactQuantificationScore: number;
  formattingScore: number;
  bulletStrengthScore: number;
  checks: Array<{
    id: string;
    status: 'pass' | 'warning' | 'fail';
    title: string;
    description: string;
    recommendation: string;
    canAutoFix?: boolean;
    fixPayload?: any;
  }>;
  quantificationSuggestions: Array<{
    experienceId: string;
    bulletIndex: number;
    originalBullet: string;
    suggestedBullet: string;
    rationale: string;
  }>;
}
