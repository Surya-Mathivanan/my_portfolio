'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { motion, type TargetAndTransition } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Factory, Hammer, Workflow, Zap, type LucideIcon } from 'lucide-react';
import { SiDjango, SiFlask, SiGit, SiGooglegemini, SiPostgresql, SiPython, SiReact } from 'react-icons/si';
import Parallax from '@/components/ui/Parallax';
import { profile } from '@/content/site';

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;
const STATEMENT = 'Some people learn by reading. I learn by building — and I don’t stop at the demo.';

const TRAITS: { icon: LucideIcon; title: string; line: string; motion: TargetAndTransition }[] = [
  { icon: Hammer, title: 'Learn by building', line: 'Every skill came from shipping something real.', motion: { rotate: [0, -28, 0] } },
  { icon: Workflow, title: 'End to end', line: 'Requirement, build, deploy, fix — all of it.', motion: { scale: [1, 1.15, 1] } },
  { icon: Factory, title: 'Floor-ready', line: 'Software people get paid by, every month.', motion: { y: [0, -3, 0] } },
  { icon: Zap, title: 'Quick learner', line: 'New stack on Monday, shipping by Friday.', motion: { rotate: [0, 12, -12, 0] } }
];

type Planet = { node: ReactNode; label: string };
const INNER: Planet[] = [
  { node: <SiPython />, label: 'Python' },
  { node: <SiReact />, label: 'React' },
  { node: <SiDjango />, label: 'Django' }
];
const OUTER: Planet[] = [
  { node: <SiGooglegemini />, label: 'Gemini' },
  { node: <SiPostgresql />, label: 'Postgres' },
  { node: <SiGit />, label: 'Git' },
  { node: <SiFlask />, label: 'Flask' }
];

/** A ring of planets that orbits the photo; each planet counter-spins so its icon stays upright. */
function Ring({ planets, size, seconds, reverse = false, offset = 0 }: { planets: Planet[]; size: string; seconds: number; reverse?: boolean; offset?: number }) {
  const spin = { animation: `spin-slow ${seconds}s linear infinite${reverse ? ' reverse' : ''}` };
  const counter = { animation: `spin-slow ${seconds}s linear infinite${reverse ? '' : ' reverse'}` };
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: 'rgba(241,230,208,.18)' }} />
      <div className="absolute inset-0" style={spin}>
        {planets.map((p, i) => {
          const a = ((360 / planets.length) * i + offset) * (Math.PI / 180);
          // Round so the server HTML and the client render the same style string (no hydration mismatch).
          const left = Math.round((50 + 50 * Math.sin(a)) * 1000) / 1000;
          const top = Math.round((50 - 50 * Math.cos(a)) * 1000) / 1000;
          return (
            <div
              key={p.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div style={counter}>
                <motion.div
                  className="group flex flex-col items-center gap-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full border bg-ink-2 text-lg text-paper shadow-[3px_3px_0_var(--ink)] transition-colors group-hover:border-mustard group-hover:text-mustard sm:h-12 sm:w-12 sm:text-xl" style={{ borderColor: 'var(--line-strong)' }}>
                    {p.node}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-paper-dim">{p.label}</span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Orbit() {
  return (
    <motion.div
      className="relative mx-auto aspect-square w-[min(86vw,440px)]"
      initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 1.1, ease }}
    >
      {/* a striped synthwave sun setting behind the photo */}
      <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-[46%] rounded-full bg-mustard/25 blur-3xl" />
      <div className="about-sun absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-[46%] overflow-hidden rounded-full opacity-80">
        <div className="about-sun-stripes absolute inset-x-0 bottom-0 h-[50%]" />
      </div>
      <Ring planets={OUTER} size="96%" seconds={46} reverse offset={20} />
      <Ring planets={INNER} size="66%" seconds={30} offset={0} />
      {/* the photo */}
      <div className="absolute left-1/2 top-1/2 w-[38%] -translate-x-1/2 -translate-y-1/2">
        <div className="relative aspect-square overflow-hidden rounded-full border-2 border-mustard shadow-[6px_6px_0_var(--rust)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/portrait-full.webp" alt={profile.name} width={720} height={914} loading="lazy" decoding="async" className="h-full w-full object-cover object-[50%_18%] [filter:sepia(.25)_contrast(1.05)]" />
        </div>
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink shadow-[2px_2px_0_var(--ink)] sm:text-[10px]">
          {profile.role}
        </span>
      </div>
    </motion.div>
  );
}

/** About: the statement lights up word by word over a synthwave floor, beside the orbit graphic. */
export default function About() {
  const lineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true }
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section overflow-hidden">
      {/* Synthwave backdrop: a grid floor that rolls toward you */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%]">
        <div className="absolute inset-0 overflow-hidden [perspective:380px]">
          <div className="absolute inset-x-[-60%] bottom-[-30%] h-[150%] origin-bottom [transform:rotateX(64deg)]">
            <div className="about-grid absolute inset-x-0 -top-14 bottom-0" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/25 to-transparent" />
      </div>

      <Parallax speed={0.35} className="pointer-events-none absolute -right-10 top-10 select-none">
        <span className="outline-text font-display text-[22vw] font-black leading-none opacity-[0.08]" aria-hidden="true">
          01
        </span>
      </Parallax>

      <div className="container-x relative">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-mustard">01</span>
          <span className="h-px w-10" style={{ background: 'var(--line-strong)' }} />
          About
        </p>

        <div className="mt-8 grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p
              ref={lineRef}
              className="font-display text-[clamp(1.8rem,4.2vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-paper"
            >
              {STATEMENT.split(' ').map((w, i) => (
                <span key={i} data-word className={`inline-block pr-[0.25em] ${w.startsWith('building') ? 'text-mustard' : ''}`}>
                  {w}
                </span>
              ))}
            </p>
            <div className="mt-8 space-y-4">
              {profile.about.map(p => (
                <p key={p} className="justify text-lg leading-relaxed text-paper-dim">
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              {TRAITS.map((t, i) => {
                const Icon = t.icon;
                return (
                  <motion.div
                    key={t.title}
                    className="group rounded-2xl border bg-ink-2/85 p-4 backdrop-blur-sm transition-colors hover:border-mustard sm:p-5"
                    style={{ borderColor: 'var(--line-strong)' }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                  >
                    <motion.span
                      className="grid h-10 w-10 place-items-center rounded-xl bg-mustard text-ink shadow-[3px_3px_0_var(--rust)]"
                      animate={t.motion}
                      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6 + i * 0.4, ease: 'easeInOut' }}
                    >
                      <Icon size={19} strokeWidth={2.2} />
                    </motion.span>
                    <p className="mt-4 font-display text-[13px] font-black uppercase leading-tight text-paper sm:text-sm">{t.title}</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-paper-dim">{t.line}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Orbit />
          </div>
        </div>

      </div>

      <style>{`
        .about-grid {
          background-image:
            linear-gradient(rgba(240,180,41,.55) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(228,87,46,.45) 1.5px, transparent 1.5px);
          background-size: 56px 56px;
          animation: about-grid-run 1.6s linear infinite;
        }
        @keyframes about-grid-run { from { transform: translateY(0); } to { transform: translateY(56px); } }
        .about-sun { background: linear-gradient(to bottom, #f0b429 0%, #e4572e 58%, #9b4f78 100%); }
        .about-sun-stripes {
          background: repeating-linear-gradient(to bottom, transparent 0 9px, var(--ink) 9px 14px);
          animation: about-sun-stripes 3s linear infinite;
        }
        @keyframes about-sun-stripes { to { background-position: 0 14px; } }
      `}</style>
    </section>
  );
}
