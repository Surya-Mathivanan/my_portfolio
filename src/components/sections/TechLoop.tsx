'use client';

import LogoLoop from '@/components/bits/LogoLoop';
import {
  SiDjango,
  SiExpress,
  SiFlask,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiOpencv,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiRailway,
  SiReact,
  SiRender,
  SiSocketdotio,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWhatsapp
} from 'react-icons/si';

const build = [
  { node: <SiPython />, title: 'Python', hoverColor: '#f0b429' },
  { node: <SiDjango />, title: 'Django', hoverColor: '#4fb5a5' },
  { node: <SiFlask />, title: 'Flask', hoverColor: '#f1e6d0' },
  { node: <SiReact />, title: 'React / RN', hoverColor: '#4fb5a5' },
  { node: <SiNextdotjs />, title: 'Next.js', hoverColor: '#f1e6d0' },
  { node: <SiTypescript />, title: 'TypeScript', hoverColor: '#4fb5a5' },
  { node: <SiJavascript />, title: 'JavaScript', hoverColor: '#f0b429' },
  { node: <SiNodedotjs />, title: 'Node.js', hoverColor: '#4fb5a5' },
  { node: <SiExpress />, title: 'Express', hoverColor: '#f1e6d0' },
  { node: <SiSocketdotio />, title: 'Socket.IO', hoverColor: '#f1e6d0' },
  { node: <SiPostgresql />, title: 'PostgreSQL', hoverColor: '#4fb5a5' },
  { node: <SiMysql />, title: 'MySQL', hoverColor: '#f0b429' },
  { node: <SiMongodb />, title: 'MongoDB', hoverColor: '#4fb5a5' }
];

const ship = [
  { node: <SiGooglegemini />, title: 'Gemini API', hoverColor: '#f0b429' },
  { node: <SiPandas />, title: 'Pandas', hoverColor: '#e4572e' },
  { node: <SiNumpy />, title: 'NumPy', hoverColor: '#4fb5a5' },
  { node: <SiOpencv />, title: 'OpenCV', hoverColor: '#e4572e' },
  { node: <SiWhatsapp />, title: 'WhatsApp API', hoverColor: '#4fb5a5' },
  { node: <SiGit />, title: 'Git', hoverColor: '#e4572e' },
  { node: <SiGithub />, title: 'GitHub', hoverColor: '#f1e6d0' },
  { node: <SiVercel />, title: 'Vercel', hoverColor: '#f1e6d0' },
  { node: <SiRender />, title: 'Render', hoverColor: '#f1e6d0' },
  { node: <SiRailway />, title: 'Railway', hoverColor: '#f1e6d0' },
  { node: <SiNetlify />, title: 'Netlify', hoverColor: '#4fb5a5' },
  { node: <SiVite />, title: 'Vite', hoverColor: '#f0b429' }
];

/** Two counter-running loops of the tools I build and ship with, each icon labelled with its name. Drag them. */
export default function TechLoop() {
  return (
    <section
      aria-label="Tools I build with"
      className="tech-loop relative border-y border-line bg-ink-2/60 py-10 text-paper-dim"
      data-cursor="drag"
      data-cursor-label="Drag"
    >
      <LogoLoop
        logos={build}
        speed={46}
        direction="left"
        logoHeight={34}
        gap={52}
        hoverSpeed={12}
        scaleOnHover
        labels="below"
        scrollBoost={0.35}
        layout="wave"
        bend={0.35}
        ariaLabel="Languages and frameworks"
      />
      <div className="mt-8">
        <LogoLoop
          logos={ship}
          speed={38}
          direction="right"
          logoHeight={28}
          gap={56}
          hoverSpeed={10}
          scaleOnHover
          labels="below"
          muted={0.25}
          scrollBoost={0.35}
          ariaLabel="AI, data and deployment tools"
        />
      </div>
      <style>{`
        .tech-loop .logoloop__label {
          font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: .1em;
          text-transform: uppercase; color: var(--paper-dim); opacity: 1;
        }
        .tech-loop .logoloop__item:hover .logoloop__label { color: var(--mustard); }
      `}</style>
    </section>
  );
}
