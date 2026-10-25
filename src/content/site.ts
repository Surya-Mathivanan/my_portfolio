// Every piece of copy on the site lives here, so updating the portfolio never means touching layout code.

export const profile = {
  name: 'Surya Mathivanan',
  short: 'Surya M',
  role: 'AI Engineer',
  company: 'UK Textiles',
  location: 'Tiruppur, Tamil Nadu',
  email: 'kit26.ad59@gmail.com',
  phone: '+91 93448 59103',
  phoneHref: 'tel:+919344859103',
  whatsapp: 'https://wa.me/919344859103',
  site: 'https://surya-mathivanan.github.io',
  resume: '/resume/',
  tagline: 'I learn by building.',
  intro:
    'AI Engineer shipping a production HRMS for the garment floor — from the first requirement to the latest redeploy.',
  about: [
    'Some people learn by reading. I learn by building. Every project I take on starts with a real problem and ends deployed, used and maintained.',
    'Since June 2026 I have owned a complete production system at UK Textiles. That product is now Zyraa, and the VINKORE team takes it to garment units across Tiruppur.'
  ]
};

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Surya-Mathivanan' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/surya--mathivanan/' },
  { label: 'Codolio', href: 'https://codolio.com/profile/Surya-Mathivanan' },
  { label: 'Email', href: 'mailto:kit26.ad59@gmail.com' }
];

export const nav = [
  { label: 'Home', href: '/#top' },
  { label: 'Journey', href: '/#journey' },
  { label: 'Ventures', href: '/#ventures' },
  { label: 'Work', href: '/#work' },
  { label: 'Build loop', href: '/#build' },
  { label: 'Growth', href: '/#growth' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Résumé', href: '/resume/' },
  { label: 'Contact', href: '/#contact' }
];

export const stats = [
  { value: 5, suffix: '', label: 'months in production' },
  { value: 3, suffix: '', label: 'apps in one HRMS' },
  { value: 59, suffix: '', label: 'public repos' },
  { value: 850, suffix: '+', label: 'problems solved' }
];

export const ventures = {
  zyraa: {
    name: 'Zyraa',
    badge: 'My product',
    href: 'https://zyraaportal.vercel.app/',
    line: 'HRMS for garment and knitwear units — one record of the month, from the punch to the payslip.',
    chips: ['Biometric attendance', 'Production pay', 'Approvals', 'Gate passes', '140+ reports'],
    facts: [
      { value: '3', label: 'apps · admin, web, mobile' },
      { value: '12', label: 'request pipelines' },
      { value: '140+', label: 'Excel & PDF reports' }
    ],
    image: '/projects/zyraa.webp'
  },
  vinkore: {
    name: 'VINKORE',
    badge: 'Distribution',
    href: 'https://vinkore.vercel.app/',
    line: 'VINKORE AI Solution builds software for the garment industry. I work with the team that takes Zyraa to units across Tiruppur.',
    chips: ['HRMS', 'ERP', 'Order tracker', 'Custom builds'],
    facts: [
      { value: '6', label: 'people · 3 dev, 3 industry' },
      { value: '15+', label: 'years of floor insight' }
    ],
    image: '/projects/vinkore.webp'
  }
};

export const buildLoop = [
  { key: 'requirements', title: 'Requirements', line: 'Sit with HR, the floor and the MD until the real problem is clear.' },
  { key: 'planning', title: 'Planning', line: 'Cut the scope into releases people can use next week.' },
  { key: 'mapping', title: 'Mapping', line: 'Turn shifts, rules and approvals into data and flows.' },
  { key: 'building', title: 'Building', line: 'Web, mobile and backend — one record underneath.' },
  { key: 'testing', title: 'Testing', line: 'Replay real months of punches before anyone trusts a payslip.' },
  { key: 'deployment', title: 'Deployment', line: 'Ship to the units, with backups and a way back.' },
  { key: 'execution', title: 'Execution', line: 'Run it live with the people who depend on it.' },
  { key: 'fixing', title: 'Bug fixing', line: 'Answer the phone, trace the edge case, fix it properly.' },
  { key: 'redeploy', title: 'Redeploy', line: 'Ship the fix — and start the loop again, sharper.' }
];

// Five months of building in production (June → October 2026). Edit the phases freely.
export const growth = {
  range: 'Jun → Oct 2026',
  phases: [
    { tag: '01', title: 'Requirements & design', skills: ['Requirement analysis', 'System design', 'Database design'] },
    { tag: '02', title: 'Attendance engine', skills: ['Biometric device sync', 'Shift rules', 'Late / OT logic'] },
    { tag: '03', title: 'Payroll & approvals', skills: ['PF / ESI payroll', 'Role-based workflows', 'Excel & PDF reports'] },
    { tag: '04', title: 'Web + mobile', skills: ['React employee app', 'React Native', 'WhatsApp automation'] },
    { tag: '05', title: 'Product & AI', skills: ['Zyraa productisation', 'AI for the garment floor', 'Live operations'] }
  ],
  before: ['Python', 'Django', 'Flask', 'React', 'REST APIs', 'MySQL', 'PostgreSQL', 'RAG', 'Gemini API'],
  after: [
    'React Native',
    'Biometric integration',
    'Payroll engines',
    'Approval workflows',
    'Background jobs',
    'WhatsApp automation',
    'Production support',
    'Railway deploys',
    'Product thinking'
  ]
};

export type Project = {
  title: string;
  year: string;
  kind: string;
  stack: string[];
  line: string;
  repo?: string;
  live?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    title: 'Zyraa HRMS',
    year: '2026',
    kind: 'Product',
    stack: ['React', 'React Native', 'Python', 'Biometrics'],
    line: 'Attendance, payroll and approvals for garment units — admin portal, employee web app and mobile app.',
    live: 'https://zyraaportal.vercel.app/',
    image: '/projects/zyraa.webp'
  },
  {
    title: 'VINKORE AI Solution',
    year: '2026',
    kind: 'Company site',
    stack: ['Web', 'SaaS'],
    line: 'Home of HRMS, ERP and Order Tracker for the garment industry.',
    live: 'https://vinkore.vercel.app/',
    image: '/projects/vinkore.webp'
  },
  {
    title: 'Cognivue AI',
    year: '2026',
    kind: 'LLM',
    stack: ['LLM', 'Python', 'React'],
    line: 'LLM-powered cognitive interview assistant for HR screening — my final-year project.',
    repo: 'https://github.com/Surya-Mathivanan/Cognivue-AI',
    live: 'https://cognivue-ai-kappa.vercel.app',
    image: '/projects/cognivue.webp'
  },
  {
    title: 'RedeemHub',
    year: '2026',
    kind: 'Full stack',
    stack: ['Flask', 'MySQL', 'JavaScript'],
    line: 'Reward-code redemption with copy limits, misuse detection and automatic suspension.',
    repo: 'https://github.com/Surya-Mathivanan/gpay-reward-application',
    live: 'https://redeem-appp.vercel.app/login',
    image: '/projects/gpay.webp'
  },
  {
    title: 'QuizMaster Live',
    year: '2026',
    kind: 'Real-time',
    stack: ['React', 'Socket.IO', 'TypeScript', 'PostgreSQL'],
    line: 'Live quizzes with synced questions, scoring, leaderboard and an admin console.',
    repo: 'https://github.com/Surya-Mathivanan/live-quiz-app',
    live: 'https://live-quiz-app.vercel.app',
    image: '/projects/livequiz.webp'
  },
  {
    title: 'SASNIK Sports',
    year: '2026',
    kind: 'Web',
    stack: ['TypeScript', 'React'],
    line: 'Digital presence and services for school sports.',
    repo: 'https://github.com/Surya-Mathivanan/SASNIK_SPORTS',
    live: 'https://sasnik-sports.vercel.app',
    image: '/projects/sasnik.webp'
  },
  {
    title: 'DSA Pathway',
    year: '2025',
    kind: 'MERN',
    stack: ['MongoDB', 'Express', 'React', 'Node'],
    line: 'Personalised, AI-assisted learning paths for data structures and algorithms.',
    repo: 'https://github.com/Surya-Mathivanan/MERN_STACK_CAPSTONE_PROJECT',
    live: 'https://mern-stack-capstone-project.vercel.app',
    image: '/projects/dsa.webp'
  },
  {
    title: 'Campus Carbon Analyzer',
    year: '2026',
    kind: 'Data',
    stack: ['Django', 'React', 'PostgreSQL', 'JWT'],
    line: 'Track, visualise and reduce campus carbon emissions.',
    repo: 'https://github.com/Surya-Mathivanan/Campus-Carbon-Footprint-Analyzer'
  },
  {
    title: 'Wikipedia Voice Assistant',
    year: '2025',
    kind: 'Python',
    stack: ['Flask', 'TTS', 'MySQL'],
    line: 'Search Wikipedia, listen to summaries and export them as PDF or audio.',
    repo: 'https://github.com/Surya-Mathivanan/wikipedia-voice-assistant'
  },
  {
    title: 'Typing Speed Test',
    year: '2025',
    kind: 'React',
    stack: ['React', 'JavaScript'],
    line: 'WPM and accuracy trainer.',
    repo: 'https://github.com/Surya-Mathivanan/Typing-Speed-Test',
    live: 'https://typing-test-speed-v1.netlify.app/',
    image: '/projects/typing.webp'
  },
  {
    title: 'Realtime Chat',
    year: '2025',
    kind: 'Real-time',
    stack: ['Node.js', 'Socket.io'],
    line: 'Instant messaging for many users at once.',
    repo: 'https://github.com/Surya-Mathivanan/my-chat-app',
    live: 'https://my-chat-app-v1.netlify.app/',
    image: '/projects/chat.webp'
  }
];

// Education and experience in one timeline, oldest first. `kind` sets the icon and accent colour.
export type JourneyKind = 'school' | 'college' | 'work' | 'venture';

export const journey: {
  kind: JourneyKind;
  period: string;
  year: string;
  title: string;
  org: string;
  place: string;
  line: string;
  score?: { value: number; decimals?: number; suffix: string; label: string };
  now?: boolean;
}[] = [
  {
    kind: 'school',
    period: '2018 — 2019',
    year: '2019',
    title: 'Secondary school · SSLC',
    org: "St. Joseph's Higher Secondary School",
    place: 'Pudukkottai',
    line: 'Built the foundations — and the habit of figuring things out.',
    score: { value: 79.6, decimals: 1, suffix: '%', label: 'SSLC' }
  },
  {
    kind: 'school',
    period: '2019 — 2021',
    year: '2021',
    title: 'Higher secondary · HSC',
    org: 'Government Higher Secondary School',
    place: 'Tiruppur',
    line: 'Computer Science, Mathematics and Physics — where code first made sense.',
    score: { value: 85.33, decimals: 2, suffix: '%', label: 'HSC' }
  },
  {
    kind: 'college',
    period: '2022 — 2026',
    year: '2026',
    title: 'B.Tech · AI & Data Science',
    org: 'KIT — Kalaignarkarunanidhi Institute of Technology',
    place: 'Coimbatore',
    line: 'Six hackathons, 850+ problems solved and a final-year LLM interview assistant.',
    score: { value: 8, decimals: 1, suffix: '', label: 'CGPA' }
  },
  {
    kind: 'work',
    period: 'Jul 2024',
    year: '2024',
    title: 'Data Science Intern',
    org: 'Profeena Infotech',
    place: 'Pollachi',
    line: 'Cleaned and explored real datasets for a live recommendation system.'
  },
  {
    kind: 'work',
    period: 'Jun 2026 — Now',
    year: '2026',
    title: 'AI Engineer',
    org: 'UK Textiles',
    place: 'Tiruppur',
    line: 'Designed and built the company HRMS end to end — biometric attendance, payroll, approvals, web and mobile — and run it live.',
    now: true
  },
  {
    kind: 'venture',
    period: '2026 — Now',
    year: '2026',
    title: 'Founder & builder',
    org: 'Zyraa',
    place: 'Tiruppur',
    line: 'Turned the HRMS into Zyraa, a product for garment and knitwear units.',
    now: true
  },
  {
    kind: 'venture',
    period: '2026 — Now',
    year: '2026',
    title: 'Product distribution',
    org: 'VINKORE AI Solution',
    place: 'Tiruppur',
    line: 'Working with the VINKORE team to bring Zyraa to more units.',
    now: true
  }
];

export const journeyExtras = [
  { value: '6', label: 'hackathons', note: 'four 24-hour · two 30-hour' },
  { value: '29/480', label: 'GUVI Webkata', note: 'national rank' },
  { value: '850+', label: 'problems solved', note: 'LearnLogicify · LeetCode · CodeChef' },
  { value: '3', label: 'certification tracks', note: 'Infosys · Coursera · Altair ML' }
];
