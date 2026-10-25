// Web version of the résumé (mirrors public/resume/Surya-Mathivanan-Resume.pdf). Update both together.

import { profile } from './site';

export const resumePdf = '/resume/Surya-Mathivanan-Resume.pdf';

export const resume = {
  name: 'Surya M',
  title: 'AI Engineer · Full-Stack Developer',
  location: 'Tiruppur, India',
  contacts: [
    { label: 'Phone', value: '+91 93448 59103', href: 'tel:+919344859103' },
    { label: 'Email', value: 'kit26.ad59@gmail.com', href: 'mailto:kit26.ad59@gmail.com' },
    { label: 'LinkedIn', value: 'linkedin.com/in/surya--mathivanan', href: 'https://www.linkedin.com/in/surya--mathivanan/' },
    { label: 'GitHub', value: 'github.com/Surya-Mathivanan', href: 'https://github.com/Surya-Mathivanan' },
    { label: 'Portfolio', value: profile.site.replace(/^https?:\/\//, ''), href: profile.site }
  ],
  profile:
    "Some people learn by reading. I learn by building. Every project I've worked on started with a problem I wanted to solve and ended with something deployed and functional. I've spent countless hours in hackathons, debugging sessions, and coding contests, and each one has made me sharper. Now I'm ready to bring that same drive into a team that takes what they build seriously.",
  experience: [
    {
      role: 'AI Engineer',
      org: 'UK Textiles',
      place: 'Tiruppur',
      period: 'Jun 2026 — Present',
      note: '3+ months of professional experience',
      points: [
        'Building, deploying, maintaining and continuously improving an entire production application — from requirement analysis and system design to development, integration, testing, deployment and live implementation.',
        'Exploring the practical role of AI and automation in the garment industry: where intelligent systems can improve efficiency, reduce manual work and support decision-making.',
        'Designed and developed an end-to-end HRMS from the ground up for a textile manufacturing environment, turning real HR and production requirements into a live, scalable application.',
        'Working closely with employees, HR teams and operations, translating industry-specific challenges into practical software across web and mobile.'
      ]
    },
    {
      role: 'Data Science Intern',
      org: 'Profeena Infotech',
      place: 'Pollachi',
      period: 'Jul 2024',
      points: [
        'Data cleaning, preprocessing and exploratory analysis on real-world datasets, contributing to a live recommendation system that tracks and predicts user behaviour.'
      ]
    }
  ],
  projects: [
    {
      name: 'HRMS — Human Resource Management System',
      context: 'UK Textiles · Full stack',
      points: [
        'Production-grade HRMS automating employee management, attendance, shifts, leave, payroll, salary processing, approvals and HR operations.',
        'Biometric devices with automated punch sync, shift-based attendance, late / early-out detection, overtime, missing punches, permissions and leave.',
        'Payroll covering salary structures, allowances, PF / ESI, salary slips, attendance-based calculation and Excel / PDF reporting.',
        'Role-based dashboards and approval workflows for Super Admin, HR, HOD, MD, Directors and employees, with automated WhatsApp notifications.',
        'Employee web app in React and a React Native mobile app for self-service attendance, leave, permissions, alerts and approvals.'
      ]
    },
    {
      name: 'GPay Reward Application',
      context: 'Full stack',
      href: 'https://github.com/Surya-Mathivanan/gpay-reward-application',
      points: [
        'Register, log in, redeem reward codes and track usage, with copy-limit rules and automatic suspension for suspicious activity.',
        'Flask and MySQL backend, session-based access control, automatic data cleanup and a responsive HTML / CSS / JavaScript UI.'
      ]
    }
  ],
  skills: [
    { group: 'Languages', items: ['Python', 'Java (basics)'] },
    { group: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'Chart.js'] },
    { group: 'Backend', items: ['Django', 'Flask', 'REST APIs', 'JWT auth'] },
    { group: 'Databases', items: ['MySQL', 'PostgreSQL'] },
    { group: 'AI & data', items: ['NumPy', 'Pandas', 'Matplotlib', 'OpenCV', 'Gemini API', 'Power BI', 'RAG', 'LLM integration'] },
    { group: 'Core', items: ['OOP', 'Data structures & algorithms'] },
    { group: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Netlify', 'Vercel', 'Render', 'Railway'] }
  ],
  highlights: [
    { group: 'Artificial intelligence', items: ['LLM integration', 'RAG', 'Gemini API', 'AI automation', 'Prompt engineering'] },
    { group: 'Software', items: ['Full-stack development', 'REST APIs', 'Authentication', 'Database design', 'CRUD'] },
    { group: 'Applications', items: ['Web', 'Mobile', 'Enterprise', 'Real-time systems'] }
  ],
  education: [
    { title: 'B.Tech — Artificial Intelligence & Data Science', place: 'KIT — Kalaignarkarunanidhi Institute of Technology, Coimbatore', period: '2022 — 2026', score: 'CGPA 8 / 10' },
    { title: 'Higher Secondary', place: 'Government Higher Secondary School, Tiruppur', period: '2019 — 2021', score: '85.33%' },
    { title: 'Secondary', place: "St. Joseph's Higher Secondary School, Pudukkottai", period: '2018 — 2019', score: '79.6%' }
  ],
  competitive: [
    'Hackathons — four 24-hour and two 30-hour hackathons (KIT)',
    'Rank 29 of 480 in GUVI Webkata · 40+ CodeChef contests',
    '750+ problems on LearnLogicify · 100+ on LeetCode',
    'Hands-on with 20+ AI platforms'
  ],
  certificates: [
    'Infosys — Python Foundation, Web Development, Artificial Intelligence Foundation',
    'Coursera — Foundations of Data Science, Software Engineering, Professional Data Engineer',
    'Altair — Machine Learning Master Certification'
  ],
  soft: ['Collaboration', 'Adaptability', 'Quick learner', 'Creative problem solver']
};
