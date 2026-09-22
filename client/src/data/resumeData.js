// Centralized mock data for the Student Resume & ATS Command Center

export const initialActiveResume = {
  fileName: "Aarav_Kulkarni_Resume_v2.4.pdf",
  version: "v2.4",
  status: "Active",
  updatedAt: "18 Aug 2026",
  fileSize: "1.8 MB",
  format: "PDF",
  atsScore: 82,
  matchRating: "Strong Profile Match",
  summary:
    "Your resume is structurally ready for most campus placement applications. Coursework, projects, and key technical skills are well-indexed.",
};

export const resumeVersions = [
  {
    version: "v2.4",
    status: "Active",
    date: "18 Aug 2026",
    atsScore: 82,
    matchRating: "Strong Profile Match",
    summary:
      "Your resume is structurally ready for most campus placement applications. Coursework, projects, and key technical skills are well-indexed.",
    changeNote:
      "Added Distributed Task Queue Engine details, refined React & Node.js proficiency tags.",
    fileName: "Aarav_Kulkarni_Resume_v2.4.pdf",
    fileSize: "1.8 MB",
  },
  {
    version: "v2.3",
    status: "Archived",
    date: "10 Aug 2026",
    atsScore: 76,
    matchRating: "Good Profile Match",
    summary:
      "Solid foundation. Project descriptions were slightly task-oriented rather than outcome-driven.",
    changeNote:
      "Updated academic CGPA to 8.85 and added NexHire Capstone project description.",
    fileName: "Aarav_Kulkarni_Resume_v2.3.pdf",
    fileSize: "1.6 MB",
  },
  {
    version: "v2.2",
    status: "Archived",
    date: "02 Aug 2026",
    atsScore: 71,
    matchRating: "Developing Profile Match",
    summary:
      "Initial draft import. Needed standardized technical skills categorization and contact headers.",
    changeNote:
      "Initial conversion from university placement cell baseline template.",
    fileName: "Aarav_Kulkarni_Resume_v2.2.pdf",
    fileSize: "1.4 MB",
  },
];

export const atsBreakdown = [
  {
    category: "Resume Structure & Sections",
    score: 90,
    status: "Strong",
    tone: "emerald",
    note: "Single-column layout with standard heading semantics (Education, Skills, Projects).",
  },
  {
    category: "Technical Skills Alignment",
    score: 88,
    status: "Strong",
    tone: "emerald",
    note: "Covers key campus drive keywords: React.js, Node.js, MongoDB, REST APIs, TypeScript.",
  },
  {
    category: "Education & Credentials",
    score: 92,
    status: "Strong",
    tone: "emerald",
    note: "Clear institutional record: K. J. Somaiya School of Engineering, 8.85 CGPA, 0 backlogs.",
  },
  {
    category: "Content Relevance to SDE",
    score: 80,
    status: "Good",
    tone: "indigo",
    note: "Project scopes closely match Junior Software Engineer / Backend Intern drive profiles.",
  },
  {
    category: "Formatting & Parsability",
    score: 88,
    status: "Strong",
    tone: "emerald",
    note: "Clean font hierarchy, no tables or complex multi-column text frames that trip ATS engines.",
  },
  {
    category: "Experience & Impact Signals",
    score: 72,
    status: "Developing",
    tone: "amber",
    note: "Project bullet points can be strengthened with more quantitative outcomes and scale indicators.",
  },
];

export const standoutInsights = [
  {
    id: "insight-1",
    title: "Strong Technical Coverage",
    description:
      "Your resume clearly communicates core technical competencies including React.js, Node.js, MongoDB, and REST APIs, matching 88% of campus drive job descriptions.",
    tag: "Technical Alignment",
  },
  {
    id: "insight-2",
    title: "Clear Academic Credentials",
    description:
      "Education section highlights B.Tech Computer Engineering with 8.85 CGPA and verified Somaiya institutional standing, clearing all Tier-1 drive eligibility gates.",
    tag: "Eligibility Verified",
  },
  {
    id: "insight-3",
    title: "Verifiable Project Evidence",
    description:
      "Capstone and systems projects provide concrete engineering signals rather than generic academic homework assignments.",
    tag: "Domain Depth",
  },
];

export const improvementRecommendations = [
  {
    id: "rec-1",
    priority: "High Priority",
    priorityTone: "indigo",
    title: "Strengthen project impact statements",
    summary:
      "Explain what you engineered and what changed or improved as a result, rather than listing duties.",
    detail:
      "For example, instead of 'Built background processing tasks using Redis', phrase as: 'Engineered an asynchronous distributed worker queue in Node.js with Redis message buffering, supporting exponential backoff retries and dead-letter queue telemetry.'",
    category: "Impact & Specificity",
  },
  {
    id: "rec-2",
    priority: "Medium Priority",
    priorityTone: "amber",
    title: "Add measurable outcomes where available",
    summary:
      "Incorporate concrete engineering benchmarks or scale indicators when you genuinely have them.",
    detail:
      "Mention benchmarks like 'Benchmarked processing throughput of 500+ simulated jobs/sec' or 'Reduced state synchronization overhead by 30% through memoized React context hooks'. Keep numbers authentic and defensible in technical interviews.",
    category: "Quantification",
  },
  {
    id: "rec-3",
    priority: "Optional",
    priorityTone: "slate",
    title: "Refine keyword alignment for target roles",
    summary:
      "Ensure standard terminology matching Software Engineer Intern drive specifications is explicitly visible.",
    detail:
      "Include explicit references to 'Object-Oriented Design', 'Asynchronous Architecture', and 'RESTful Web Services' within your technical skills summary to maximize automated parsing accuracy.",
    category: "Terminology",
  },
];

export const targetRoleAlignment = {
  role: "Software Engineer Intern",
  companyType: "Campus Engineering & Product Drives",
  matchScore: 88,
  matchedKeywords: [
    "React.js",
    "Node.js",
    "Data Structures",
    "Algorithms",
    "REST APIs",
    "MongoDB",
    "TypeScript",
  ],
  recommendedKeywords: ["Docker", "CI/CD Basics", "Unit Testing / Jest"],
  advisoryNote:
    "Advisory evaluation based on aggregated campus drive criteria from active recruiters on NexHire.",
};

export const documentPreviewData = {
  candidate: {
    name: "Aarav Kulkarni",
    role: "Computer Engineering Undergraduate",
    contact: "aarav.kulkarni@somaiya.edu · +91 98201 23456 · Mumbai, India",
    links: "github.com/aaravkulkarni · linkedin.com/in/aaravkulkarni",
  },
  education: {
    institution: "K. J. Somaiya School of Engineering",
    degree: "Bachelor of Technology in Computer Engineering",
    timeline: "2022 – 2026",
    metrics: "CGPA: 8.85 / 10.00 · Semester VII · 0 Active Backlogs",
  },
  skills: {
    languages: "JavaScript, TypeScript, Python, C++, SQL",
    webBackend: "React.js, Node.js, Express, REST APIs, Tailwind CSS",
    databasesTools: "MongoDB, Redis, Git, Linux, Postman",
    fundamentals: "Data Structures & Algorithms, OOP, DBMS, OS, Computer Networks",
  },
  projects: [
    {
      title: "NexHire Placement Management Portal",
      stack: "React.js, Node.js, Express, MongoDB, Tailwind CSS",
      highlights: [
        "Architected an institutional placement platform featuring role-based workflows for students, recruiters, and TPOs.",
        "Built centralized applicant tracking pipelines with status transitions, filterable application tables, and ATS indexing.",
      ],
    },
    {
      title: "Distributed Asynchronous Task Queue Engine",
      stack: "Node.js, Redis, Worker Threads",
      highlights: [
        "Implemented high-throughput background worker queue using Redis for task scheduling and priority buffering.",
        "Engineered automatic failure retry mechanisms with exponential backoff and dead-letter queue isolation.",
      ],
    },
  ],
};
