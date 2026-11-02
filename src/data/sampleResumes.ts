import { Resume } from '../types/resume';

export const SAMPLE_RESUMES: Resume[] = [
  {
    id: 'sample-fullstack',
    title: 'Senior Full-Stack Engineer (AI & Cloud)',
    targetRole: 'Senior Full Stack Engineer',
    updatedAt: new Date().toISOString(),
    personalInfo: {
      fullName: 'Alex Vance',
      headline: 'Senior Full-Stack Engineer | React, Node.js & GenAI Systems',
      email: 'alex.vance.dev@gmail.com',
      phone: '+1 (555) 432-8910',
      location: 'San Francisco, CA (Open to Remote)',
      website: 'alexvance.dev',
      linkedin: 'linkedin.com/in/alexvance',
      github: 'github.com/alexvance',
    },
    summary:
      'High-impact Full-Stack Software Engineer with 6+ years designing scalable cloud architectures, high-throughput Node.js microservices, and reactive TypeScript web applications. Proven track record leading distributed systems that handle 2.5M+ daily requests with 99.98% uptime. Experienced integrating generative AI models into production workflows to improve customer retention by 34%.',
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Full-Stack Engineer',
        company: 'Synthetix Cloud Labs',
        location: 'San Francisco, CA',
        startDate: '2023-01',
        endDate: 'Present',
        current: true,
        highlights: [
          'Architected an event-driven AI workflow automation engine using Node.js, Express, Redis, and Gemini API, cutting enterprise processing latency by 44% for 120k active teams.',
          'Spearheaded transition of core monolith to modular micro-frontends with React 19, Vite, and Tailwind CSS, improving Lighthouse performance score from 68 to 98 and reducing bundle payload by 52%.',
          'Designed high-availability MongoDB cluster with automated sharding and indexing strategies, eliminating query timeout spikes during 4x traffic bursts.',
          'Mentored 6 junior and mid-level engineers through structured bi-weekly code design sessions, increasing sprint velocity by 28% and code review turnaround time by 35%.',
        ],
      },
      {
        id: 'exp-2',
        role: 'Full-Stack Software Engineer',
        company: 'Veloce Data Platforms',
        location: 'Austin, TX',
        startDate: '2020-06',
        endDate: '2022-12',
        current: false,
        highlights: [
          'Engineered real-time telemetry streaming pipelines using WebSockets and Node.js, supporting 18,000 concurrent socket connections with sub-45ms round-trip latency.',
          'Built comprehensive RESTful & GraphQL backend APIs with automated Jest unit and integration test suites, achieving 94% test coverage across critical billing modules.',
          'Optimized PostgreSQL and MongoDB aggregation queries, saving $14,000 monthly in cloud database resource over-provisioning costs.',
          'Collaborated closely with UX designers and product leaders to release self-serve analytics dashboards that boosted monthly active user engagement by 41%.',
        ],
      },
      {
        id: 'exp-3',
        role: 'Software Engineer',
        company: 'Horizon Web Solutions',
        location: 'Seattle, WA',
        startDate: '2018-08',
        endDate: '2020-05',
        current: false,
        highlights: [
          'Developed responsive customer portals using modern JavaScript, React, and Redux, serving 450,000+ monthly unique visitors.',
          'Integrated secure Stripe payment gateways and role-based access control (RBAC), resulting in zero compliance infractions across 3 major annual audits.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of Washington',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Software Engineering',
        location: 'Seattle, WA',
        startDate: '2014-09',
        endDate: '2018-06',
        gpa: '3.82 / 4.0',
        honors: 'Dean’s List (7 Semesters), Magna Cum Laude',
      },
    ],
    skills: {
      technical: [
        'TypeScript',
        'JavaScript (ESNext)',
        'Node.js',
        'Python',
        'RESTful APIs',
        'GraphQL',
        'Microservices',
        'System Design',
      ],
      frameworks: [
        'React',
        'Next.js',
        'Express.js',
        'Tailwind CSS',
        'Vite',
        'Jest / Vitest',
      ],
      toolsAndCloud: [
        'MongoDB',
        'PostgreSQL',
        'Redis',
        'Docker',
        'AWS (ECS, S3, CloudFront)',
        'CI/CD (GitHub Actions)',
        'Git',
        'Gemini API',
      ],
      softSkills: [
        'Cross-Functional Leadership',
        'Agile / Scrum',
        'Technical Mentorship',
        'Root Cause Analysis',
      ],
    },
    projects: [
      {
        id: 'proj-1',
        name: 'ResumAI Platform & ATS Engine',
        role: 'Lead Architect',
        description: 'End-to-end AI resume generator and semantic ATS matching platform.',
        technologies: ['React 19', 'Node.js', 'Express', 'MongoDB', 'Gemini 3.8 Flash'],
        link: 'https://github.com/alexvance/resumai-engine',
        metrics: '99.2% ATS parse rate; 5,000+ generated resumes',
        highlights: [
          'Engineered a deterministic token-based ATS syntax parser that identifies missing job description keywords and formats PDF output for ATS robots.',
          'Integrated server-side Gemini 3.8 Flash streaming pipeline for 1.4s response times on complex multi-section resume generation.',
        ],
      },
      {
        id: 'proj-2',
        name: 'Distributed Distributed Task Queue',
        role: 'Creator & Maintainer',
        description: 'Lightweight fault-tolerant job queue for Node.js microservices with backpressure handling.',
        technologies: ['TypeScript', 'Redis', 'Docker'],
        link: 'https://github.com/alexvance/fast-queue-node',
        metrics: '1,200+ GitHub Stars',
        highlights: [
          'Handled 25,000 ops/sec with memory overhead under 40MB on standard containers.',
        ],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2023',
      },
      {
        id: 'cert-2',
        name: 'MongoDB Certified Developer Associate',
        issuer: 'MongoDB Inc.',
        date: '2022',
      },
    ],
    settings: {
      template: 'modern',
      accentColor: '#1e40af', // Deep classic executive navy
      fontFamily: 'sans',
      fontSize: 'base',
      spacing: 'normal',
      showIcons: true,
      sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
    },
  },
  {
    id: 'sample-ai-pm',
    title: 'Lead Product Manager (AI & Enterprise SaaS)',
    targetRole: 'Staff Product Manager',
    updatedAt: new Date().toISOString(),
    personalInfo: {
      fullName: 'Maya Lin',
      headline: 'Product Lead | AI Applications, Monetization & 0→1 Platform Scale',
      email: 'maya.lin.pm@outlook.com',
      phone: '+1 (555) 782-3490',
      location: 'New York, NY',
      website: 'mayalin.co',
      linkedin: 'linkedin.com/in/mayalin-pm',
    },
    summary:
      'Data-driven Product Leader with 7+ years of experience steering 0→1 AI product development, self-serve growth, and enterprise monetization. Owned core product roadmaps resulting in $18M ARR growth and 3.2x product adoption across Fortune 500 customers. Adept at translating ambiguous technical capabilities into high-converting user experiences.',
    experience: [
      {
        id: 'exp-pm-1',
        role: 'Staff Product Manager, AI & Automation',
        company: 'Aether Systems',
        location: 'New York, NY',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        highlights: [
          'Defined product vision and GTM roadmap for flagship Generative AI Copilot, achieving $12M ARR within 14 months of public launch.',
          'Partnered with Engineering, ML Research, and Design to reduce AI prompt hallucinations by 65% and increase task completion rate to 91%.',
          'Conducted 80+ customer interviews and usability discovery sessions, translating customer pain points into high-impact PRDs and sprint backlogs.',
        ],
      },
      {
        id: 'exp-pm-2',
        role: 'Senior Product Manager',
        company: 'Catalyst Analytics',
        location: 'Boston, MA',
        startDate: '2019-02',
        endDate: '2022-02',
        current: false,
        highlights: [
          'Led onboarding funnel redesign that elevated trial-to-paid conversion from 4.8% to 8.6%, unlocking $4.2M in annual recurring revenue.',
          'Managed cross-functional team of 14 engineers, 2 UX researchers, and 2 data scientists across two international timezones.',
        ],
      },
    ],
    education: [
      {
        id: 'edu-pm-1',
        institution: 'Columbia University',
        degree: 'Bachelor of Arts',
        fieldOfStudy: 'Economics & Information Science',
        location: 'New York, NY',
        startDate: '2013-09',
        endDate: '2017-05',
      },
    ],
    skills: {
      technical: [
        'Product Strategy',
        '0→1 Product Lifecycle',
        'A/B Testing & Experimentation',
        'SQL & Amplitude Analytics',
        'User Journey Mapping',
      ],
      frameworks: [
        'Agile / Scrum',
        'Design Thinking',
        'PRD & Spec Writing',
        'OKRs & KPI Tracking',
      ],
      toolsAndCloud: [
        'Jira',
        'Figma',
        'Mixpanel',
        'Tableau',
        'Postman',
        'Google Workspace',
      ],
      softSkills: [
        'Executive Stakeholder Management',
        'Cross-Functional Alignment',
        'Public Speaking',
      ],
    },
    projects: [
      {
        id: 'proj-pm-1',
        name: 'Enterprise AI Governance Framework',
        role: 'Lead Author',
        description: 'Standardized safety and compliance playbook adopted by 40+ enterprise clients.',
        technologies: ['Gemini Enterprise', 'Data Privacy', 'SOC2 Compliance'],
        highlights: [
          'Reduced enterprise security review delays by 3 weeks per deal cycle.',
        ],
      },
    ],
    certifications: [
      {
        id: 'cert-pm-1',
        name: 'Reforge Product Management & Growth',
        issuer: 'Reforge',
        date: '2021',
      },
    ],
    settings: {
      template: 'executive',
      accentColor: '#0f766e', // Crisp executive teal
      fontFamily: 'serif',
      fontSize: 'base',
      spacing: 'normal',
      showIcons: true,
      sectionOrder: ['summary', 'experience', 'projects', 'skills', 'education', 'certifications'],
    },
  },
];

export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Senior Full Stack Engineer (Cloud & AI)',
    company: 'Stripe / TechCorp',
    text: `About the Role:
We are seeking a Senior Full-Stack Software Engineer to build next-generation cloud infrastructure and developer-facing interfaces. In this role, you will architect resilient backend services in Node.js and TypeScript, construct intuitive web applications with React and Tailwind CSS, and leverage state-of-the-art Generative AI models (e.g. Gemini API) to accelerate user workflows.

Requirements:
- 5+ years of software engineering experience with modern JavaScript / TypeScript.
- Strong proficiency in Node.js, Express, and microservice architectures.
- Deep expertise in React, modern hooks, responsive UI design, and state management.
- Hands-on experience with MongoDB or relational databases (PostgreSQL), including query optimization and sharding.
- Experience building event-driven systems, WebSockets, or high-throughput REST APIs.
- Familiarity with Cloud infrastructure (AWS / GCP / Docker) and CI/CD automation pipelines.
- Demonstrated experience integrating LLM/AI APIs into production systems with low latency.
- Strong communication skills, system design acumen, and passion for engineering mentorship.

Bonus Points:
- Contributions to open-source software.
- Experience with ATS, PDF parsing, or document rendering technologies.`,
  },
  {
    title: 'Principal Software Architect',
    company: 'Anthropic / Scale AI',
    text: `Job Responsibilities:
- Design distributed systems capable of scaling to tens of millions of concurrent API queries.
- Collaborate with ML engineers to productionize frontier AI models into resilient microservices.
- Enforce high standards of code hygiene, test coverage (Jest/Vitest), and CI/CD best practices.
- Oversee database scaling strategies across MongoDB, Redis, and distributed caches.
- Drive cross-functional engineering initiatives and mentor senior staff engineers.

Qualifications:
- 7+ years building enterprise SaaS or developer infrastructure.
- Masterful command of Node.js, TypeScript, and modern front-end frameworks (React).
- Deep knowledge of concurrency, caching topologies, and latency optimization.
- Bachelor's or Master's degree in Computer Science or equivalent practical experience.`,
  },
];
