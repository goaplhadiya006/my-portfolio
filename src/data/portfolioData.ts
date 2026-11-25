/**
 * Content and structured data for the portfolio sections.
 * Update this file to personalize the site without changing its components.
 */

export interface ProjectItem {
  id: string;
  title: string;
  category: 'AI & ML' | 'Python & Flask';
  tagline: string;
  description: string;
  technologies: string[];
  highlights: string[];
  githubUrl: string;
  liveUrl: string | null;
  visualType: 'mytools' | 'resume';
}

export interface BlogArticle {
  id: string;
  title: string;
  topic: string;
  statusLabel: string;
  readingTime: string;
  summary: string;
  relatedTech: string[];
  outline: string[];
}

export interface TechnologyCategory {
  id: 'languages' | 'frontend' | 'backend' | 'aiml' | 'database' | 'tools';
  title: string;
  subtitle: string;
  technologies: { name: string; mark: string; detail: string }[];
}

export interface StatItem {
  id: 'education-span' | 'projects-completed' | 'focus-areas';
  numericValue: number;
  suffix: string;
  label: string;
  sublabel: string;
}

interface PortfolioConfig {
  personal: {
    firstName: string;
    lastName: string;
    fullName: string;
    initials: string;
    greeting: string;
    role: string;
    shortIntro: string;
    careerObjective: string;
    aboutParagraphs: string[];
    location: string;
    availabilityNote: string;
    profileImageUrl: string | null;
    email: string;
    phone: string;
    phoneHref: string;
    cvPath: string;
    cvDownloadName: string;
    education: { degree: string; period: string; institution: string; score?: string }[];
    languages: string[];
    softSkills: string[];
    profileHighlights: { label: string; value: string }[];
  };
  socialLinks: { id: 'github' | 'linkedin' | 'email'; label: string; displayValue: string; href: string | null }[];
  heroFloatingHighlights: { title: string; subtitle: string }[];
  projects: ProjectItem[];
  technologyCategories: TechnologyCategory[];
  blogArticles: BlogArticle[];
  stats: StatItem[];
}

const githubProfile = 'https://github.com/goaplhadiya006';

export const portfolioConfig: PortfolioConfig = {
  personal: {
    firstName: 'Gopal',
    lastName: 'Hadiya',
    fullName: 'Gopal Hadiya',
    initials: 'GH',
    greeting: 'AI/ML ENGINEER  ·  PYTHON DEVELOPER',
    role: 'AI/ML Engineer | Python Developer',
    shortIntro:
      'I am a BCA graduate interested in Python, artificial intelligence, and full-stack development. I enjoy learning new tools through hands-on work and building reliable software that solves practical problems.',
    careerObjective:
      'Looking for an entry-level software development opportunity where I can contribute, learn from a team, and build reliable applications.',
    aboutParagraphs: [
      'MyTools brings together image utilities, compression, and AI-assisted background removal in a Flask application. SmartResume explores resume content analysis and report generation.',
      'These projects helped me connect Python and Flask with data workflows and responsive interfaces. I keep building on that foundation through hands-on practice and a steady interest in learning new technologies.',
    ],
    location: 'Surat, Gujarat, India',
    availabilityNote: 'Open to entry-level roles and internships',
    profileImageUrl: '/profilephoto.jpeg',
    email: 'goaplahir006@gmail.com',
    phone: '+91 99259 10316',
    phoneHref: 'tel:+919925910316',
    cvPath: '/assets/aistudio/New_Resume_4543b1ad.pdf',
    cvDownloadName: 'Gopal-Hadiya-Resume.pdf',
    education: [
      {
        degree: 'Bachelor of Computer Applications (BCA)',
        period: '2023–2026',
        institution: 'Surat, Gujarat',
      },
      {
        degree: 'Higher Secondary (12th)',
        period: '2023',
        institution: 'Surat, Gujarat',
      },
      {
        degree: 'Secondary (10th)',
        period: '2021',
        institution: 'Veer Narmad South Gujarat',
        score: 'CGPA: 7/10 · SGPA: 8/10',
      },
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    softSkills: ['Teamwork', 'Leadership', 'Communication', 'Problem solving'],
    profileHighlights: [
      { label: 'Primary Focus', value: 'AI & Machine Learning' },
      { label: 'Development Focus', value: 'Python & Full Stack' },
      { label: 'Current Focus', value: 'Building projects, strengthening skills' },
      { label: 'Career Goal', value: 'Entry-level software development' },
    ],
  },
  socialLinks: [
    { id: 'github', label: 'GitHub', displayValue: 'github.com/goaplhadiya006', href: githubProfile },
    { id: 'linkedin', label: 'LinkedIn', displayValue: 'linkedin.com/in/gopal-hadiya-6959843a0', href: 'https://www.linkedin.com/in/gopal-hadiya-6959843a0' },
    { id: 'email', label: 'Email', displayValue: 'goaplahir006@gmail.com', href: 'mailto:goaplahir006@gmail.com' },
  ],
  heroFloatingHighlights: [
    { title: 'AI & Machine Learning', subtitle: 'Applied model integration' },
    { title: 'Python Development', subtitle: 'Flask · Data · Web apps' },
  ],
  projects: [
    {
      id: 'mytools',
      title: 'MyTools',
      category: 'AI & ML',
      tagline: 'AI-powered image utilities',
      description:
        'A Flask application bringing image utilities together, including background removal and batch compression, with database-backed workflows.',
      technologies: ['Python', 'Flask', 'ONNX Runtime', 'rembg', 'Pillow', 'MySQL / TiDB'],
      highlights: [
        'Integrated image background removal using a segmentation model.',
        'Designed batch image compression and ZIP export workflows.',
        'Connected application data storage with MySQL-compatible databases.',
      ],
      githubUrl: githubProfile,
      liveUrl: null,
      visualType: 'mytools',
    },
    {
      id: 'smartresume',
      title: 'SmartResume',
      category: 'Python & Flask',
      tagline: 'Resume analysis and reporting',
      description:
        'A resume analysis tool that extracts PDF content, checks key sections and skills, and prepares downloadable reports.',
      technologies: ['Python', 'Flask', 'PyPDF2', 'Pandas', 'ReportLab', 'MySQL'],
      highlights: [
        'Extracted resume text from PDF documents for analysis.',
        'Reviewed common resume sections and skills with structured results.',
        'Generated PDF reports and maintained analysis history.',
      ],
      githubUrl: githubProfile,
      liveUrl: null,
      visualType: 'resume',
    },
  ],
  technologyCategories: [
    {
      id: 'languages', title: 'Programming Languages', subtitle: 'Languages and web foundations',
      technologies: [
        { name: 'Python', mark: 'Py', detail: 'Used across Flask apps, data analysis, and project workflows.' },
        { name: 'JavaScript', mark: 'JS', detail: 'Used for interactive web interfaces and client-side behavior.' },
        { name: 'TypeScript', mark: 'TS', detail: 'Used in this portfolio and its Express server.' },
        { name: 'PHP', mark: 'PHP', detail: 'Listed in the resume technical skills.' },
        { name: 'HTML5', mark: '5', detail: 'Used to structure responsive web interfaces.' },
        { name: 'CSS3', mark: '3', detail: 'Used to style and adapt interfaces across screen sizes.' },
      ],
    },
    {
      id: 'frontend', title: 'Frontend Development', subtitle: 'Interfaces and responsive layouts',
      technologies: [
        { name: 'React.js', mark: '⚛', detail: 'Used to build this component-based portfolio interface.' },
        { name: 'Tailwind CSS', mark: 'TW', detail: 'Used for responsive styling in this portfolio.' },
        { name: 'Bootstrap', mark: 'B', detail: 'Listed in the resume as a framework used in project interfaces.' },
        { name: 'Responsive Web Design', mark: 'RWD', detail: 'Applied across portfolio layouts and project interfaces.' },
      ],
    },
    {
      id: 'backend', title: 'Backend Development', subtitle: 'Application services and APIs',
      technologies: [
        { name: 'Flask', mark: 'Fl', detail: 'Used to build the MyTools and SmartResume applications.' },
        { name: 'Node.js', mark: 'N', detail: 'Runtime for this portfolio’s server and development tooling.' },
        { name: 'Express.js', mark: 'Ex', detail: 'Used for the portfolio server and contact API.' },
        { name: 'REST APIs', mark: 'API', detail: 'Applied in the portfolio server and Flask project workflows.' },
      ],
    },
    {
      id: 'aiml', title: 'AI & Machine Learning', subtitle: 'Data, analysis, and image workflows',
      technologies: [
        { name: 'NumPy', mark: 'Np', detail: 'Listed in the resume technical skills.' },
        { name: 'Pandas', mark: 'Pd', detail: 'Used for resume data analysis and processing.' },
        { name: 'Matplotlib', mark: 'Mp', detail: 'Listed in the resume technical skills.' },
        { name: 'Seaborn', mark: 'Sb', detail: 'Listed in the resume technical skills.' },
        { name: 'Scikit-learn', mark: 'Sk', detail: 'Listed in the resume technical skills.' },
        { name: 'AI/ML Integration', mark: 'AI', detail: 'Applied with rembg and ONNX Runtime in MyTools.' },
        { name: 'Resume Analysis', mark: 'CV', detail: 'Implemented in the SmartResume project.' },
        { name: 'Image Processing', mark: 'IMG', detail: 'Implemented with Pillow and image utilities in MyTools.' },
      ],
    },
    {
      id: 'database', title: 'Database Management', subtitle: 'Relational data and application storage',
      technologies: [
        { name: 'MySQL', mark: 'My', detail: 'Used for user, resume, and application data in projects.' },
        { name: 'MongoDB', mark: 'Mo', detail: 'Listed in the resume technical skills.' },
        { name: 'TiDB', mark: 'Ti', detail: 'Used as a MySQL-compatible database in project work.' },
        { name: 'PyMySQL', mark: 'Py', detail: 'Listed in the resume project technology stack.' },
      ],
    },
    {
      id: 'tools', title: 'Developer Tools', subtitle: 'Version control and build workflows',
      technologies: [
        { name: 'Git', mark: 'Git', detail: 'Listed in the resume project technology stack.' },
        { name: 'GitHub', mark: 'GH', detail: 'Used to host and share project source code.' },
        { name: 'VS Code', mark: 'VS', detail: 'Listed in the resume technical skills.' },
        { name: 'npm', mark: 'npm', detail: 'Used to manage this portfolio’s dependencies and scripts.' },
        { name: 'Vite', mark: 'V', detail: 'Used to develop and build this portfolio.' },
      ],
    },
  ],
  blogArticles: [
    {
      id: 'image-workflows', title: 'Building an Image Utility Workflow with Flask', topic: 'AI & Image Processing',
      statusLabel: 'Outline in progress', readingTime: 'Draft outline',
      summary: 'Notes on connecting image uploads, model inference, batch processing, and useful exports in a small web application.',
      relatedTech: ['Flask', 'ONNX Runtime', 'Pillow'],
      outline: ['Handling uploads and validating image inputs', 'Integrating background removal inference', 'Batch compression and export design', 'Persisting application data'],
    },
    {
      id: 'resume-analysis', title: 'From Resume PDF to Structured Feedback', topic: 'Python & Data',
      statusLabel: 'Outline in progress', readingTime: 'Draft outline',
      summary: 'A project outline covering PDF text extraction, section checks, and clear report generation for resume analysis.',
      relatedTech: ['Flask', 'PyPDF2', 'Pandas', 'ReportLab'],
      outline: ['Extracting text from uploaded PDFs', 'Checking sections and skills', 'Presenting useful analysis results', 'Creating downloadable PDF reports'],
    },
    {
      id: 'project-learning', title: 'Learning Through End-to-End Project Builds', topic: 'Engineering Practice',
      statusLabel: 'Planned', readingTime: 'Draft outline',
      summary: 'Reflections on bringing interface, backend, data, and deployment considerations together while building portfolio projects.',
      relatedTech: ['Python', 'SQL', 'Web Development'],
      outline: ['Turning an idea into a small scope', 'Choosing a practical stack', 'Iterating from feedback', 'Documenting tradeoffs and next steps'],
    },
  ],
  stats: [
    { id: 'education-span', numericValue: 1, suffix: '', label: 'Computer Applications Degree', sublabel: 'Bachelor of Computer Applications' },
    { id: 'projects-completed', numericValue: 2, suffix: '+', label: 'Featured Project Builds', sublabel: 'AI, Python, and web applications' },
    { id: 'focus-areas', numericValue: 3, suffix: '', label: 'Core Focus Areas', sublabel: 'AI/ML · Python · Full Stack' },
  ],
};
