import React from 'react';
import { Resume } from '../../types/resume';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  ExternalLink 
} from 'lucide-react';

interface ResumeDocumentProps {
  resume: Resume;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications, settings } = resume;
  const accentColor = settings?.accentColor || '#1e40af';
  const template = settings?.template || 'modern';
  const fontClass = 
    settings?.fontFamily === 'serif' ? 'font-serif' :
    settings?.fontFamily === 'mono' ? 'font-mono' : 'font-sans';

  const spacingClass = 
    settings?.spacing === 'compact' ? 'space-y-3' :
    settings?.spacing === 'spacious' ? 'space-y-6' : 'space-y-4';

  const textSizeClass =
    settings?.fontSize === 'sm' ? 'text-[13px]' :
    settings?.fontSize === 'lg' ? 'text-[15px]' : 'text-[14px]';

  // Format dates cleanly
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'present') return 'Present';
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const [year, month] = dateStr.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(month, 10) - 1]} ${year}`;
    }
    return dateStr;
  };

  return (
    <div 
      className={`resume-sheet bg-white text-slate-900 ${fontClass} ${textSizeClass} leading-relaxed p-8 sm:p-12 transition-all duration-150 select-text`}
      style={{
        minHeight: '1050px',
        maxWidth: '850px',
        margin: '0 auto',
      }}
    >
      {/* 1. HEADER SECTION */}
      {template === 'executive' ? (
        <header className="border-b-2 pb-5 mb-5 text-center" style={{ borderColor: accentColor }}>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 uppercase mb-1">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {personalInfo.headline && (
            <p className="text-base font-medium tracking-wide text-slate-700 mb-3" style={{ color: accentColor }}>
              {personalInfo.headline}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>{personalInfo.location}</span>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-700">{personalInfo.linkedin}</span>
              </>
            )}
            {personalInfo.github && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-700">{personalInfo.github}</span>
              </>
            )}
            {personalInfo.website && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-700">{personalInfo.website}</span>
              </>
            )}
          </div>
        </header>
      ) : template === 'minimal' ? (
        <header className="border-b border-slate-300 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <span className="text-sm font-medium text-slate-600">
              {personalInfo.headline}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && (
              <>
                <span aria-hidden="true">·</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.location && (
              <>
                <span aria-hidden="true">·</span>
                <span>{personalInfo.location}</span>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <span aria-hidden="true">·</span>
                <span>{personalInfo.linkedin}</span>
              </>
            )}
            {personalInfo.github && (
              <>
                <span aria-hidden="true">·</span>
                <span>{personalInfo.github}</span>
              </>
            )}
          </div>
        </header>
      ) : (
        /* Modern Clean (Default) */
        <header className="border-b border-slate-200 pb-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              {personalInfo.headline && (
                <p className="text-sm font-semibold mt-1" style={{ color: accentColor }}>
                  {personalInfo.headline}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:items-end text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5">
                {personalInfo.email && (
                  <span className="text-slate-800 font-medium">{personalInfo.email}</span>
                )}
                {personalInfo.phone && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">|</span>
                    <span>{personalInfo.phone}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {personalInfo.linkedin && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">|</span>
                    <span>{personalInfo.linkedin}</span>
                  </>
                )}
                {personalInfo.github && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">|</span>
                    <span>{personalInfo.github}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* BODY SECTIONS */}
      <main className={spacingClass}>
        {/* EXECUTIVE SUMMARY */}
        {summary && (
          <section className="page-break-inside-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}33` }}
            >
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {experience && experience.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}33` }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="page-break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-slate-700 font-medium"> · {exp.company}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 tabular-nums">
                      <span>{formatDate(exp.startDate)}</span>
                      <span> – </span>
                      <span>{exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                      {exp.location && <span> · {exp.location}</span>}
                    </div>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1.5 space-y-1 list-disc list-outside ml-4 text-slate-700">
                      {exp.highlights.map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <section>
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}33` }}
            >
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="page-break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.role && (
                        <span className="text-xs text-slate-500 font-medium">({proj.role})</span>
                      )}
                    </div>
                    {proj.metrics && (
                      <span className="text-xs font-semibold text-slate-700 tabular-nums">
                        {proj.metrics}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      <span className="text-slate-700">Technologies: </span>
                      {proj.technologies.join(' · ')}
                    </p>
                  )}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4 text-slate-700">
                      {proj.highlights.map((hl, i) => (
                        <li key={i} className="leading-snug">{hl}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills && (
          <section className="page-break-inside-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}33` }}
            >
              Technical & Professional Skills
            </h2>
            <div className="space-y-1.5 text-xs">
              {skills.technical && skills.technical.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                  <span className="font-semibold text-slate-900 shrink-0 w-32">Languages & Core:</span>
                  <span className="text-slate-700">{skills.technical.join(' · ')}</span>
                </div>
              )}
              {skills.frameworks && skills.frameworks.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                  <span className="font-semibold text-slate-900 shrink-0 w-32">Frameworks & Libs:</span>
                  <span className="text-slate-700">{skills.frameworks.join(' · ')}</span>
                </div>
              )}
              {skills.toolsAndCloud && skills.toolsAndCloud.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                  <span className="font-semibold text-slate-900 shrink-0 w-32">Tools, Cloud & DBs:</span>
                  <span className="text-slate-700">{skills.toolsAndCloud.join(' · ')}</span>
                </div>
              )}
              {skills.softSkills && skills.softSkills.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                  <span className="font-semibold text-slate-900 shrink-0 w-32">Leadership & Ops:</span>
                  <span className="text-slate-700">{skills.softSkills.join(' · ')}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section className="page-break-inside-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}33` }}
            >
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-slate-700 font-medium"> · {edu.institution}</span>
                    {edu.honors && <span className="text-slate-500 text-xs"> ({edu.honors})</span>}
                  </div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    {edu.location && ` · ${edu.location}`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <section className="page-break-inside-avoid">
            <h2 
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: accentColor, borderColor: `${accentColor}33` }}
            >
              Certifications & Credentials
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-center gap-1.5 text-slate-700">
                  <span className="font-semibold text-slate-900">{cert.name}</span>
                  <span className="text-slate-500">· {cert.issuer} ({cert.date})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
