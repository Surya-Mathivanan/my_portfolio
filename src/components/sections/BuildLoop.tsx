'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, type TargetAndTransition } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  Bug,
  CalendarRange,
  ClipboardList,
  FlaskConical,
  Hammer,
  Network,
  RefreshCw,
  Rocket,
  type LucideIcon
} from 'lucide-react';
import LazyMount from '@/components/LazyMount';
import SectionHeading from '@/components/ui/SectionHeading';
import { buildLoop } from '@/content/site';
import { useLowPower, useReducedMotion } from '@/lib/hooks';

gsap.registerPlugin(ScrollTrigger);

const SideRays = dynamic(() => import('@/components/bits/SideRays'), { ssr: false });

const ICONS: Record<string, LucideIcon> = {
  requirements: ClipboardList,
  planning: CalendarRange,
  mapping: Network,
  building: Hammer,
  testing: FlaskConical,
  deployment: Rocket,
  execution: Activity,
  fixing: Bug,
  redeploy: RefreshCw
};

// Each stage icon moves in its own way while active.
const ICON_MOTION: Record<string, TargetAndTransition> = {
  requirements: { rotate: [0, -8, 8, 0] },
  planning: { y: [0, -4, 0] },
  mapping: { scale: [1, 1.15, 1] },
  building: { rotate: [0, -30, 0] },
  testing: { rotate: [0, 12, -12, 0] },
  deployment: { y: [0, -8, 0], x: [0, 4, 0] },
  execution: { scaleX: [1, 1.3, 1] },
  fixing: { x: [0, -3, 3, 0] },
  redeploy: { rotate: [0, 360] }
};

const R = 42;
const C = 2 * Math.PI * R;

function Ring({ active, progressRef }: { active: number; progressRef: React.RefObject<SVGGElement | null> }) {
  const n = buildLoop.length;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <circle cx="50" cy="50" r={R} fill="none" stroke="var(--line-strong)" strokeWidth="0.35" strokeDasharray="0.8 1.6" />
      <circle
        data-arc
        cx="50"
        cy="50"
        r={R}
        fill="none"
        stroke="url(#loop-grad)"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C}
        transform="rotate(-90 50 50)"
      />
      <defs>
        <linearGradient id="loop-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e4572e" />
          <stop offset="55%" stopColor="#f0b429" />
          <stop offset="100%" stopColor="#4fb5a5" />
        </linearGradient>
        <radialGradient id="packet-glow">
          <stop offset="0%" stopColor="#f0b429" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f0b429" stopOpacity="0" />
        </radialGradient>
      </defs>
      {buildLoop.map((s, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + R * Math.cos(a);
        const y = 50 + R * Math.sin(a);
        const on = i <= active;
        const now = i === active;
        return (
          <g key={s.key} style={{ transition: 'transform .5s cubic-bezier(.22,1,.36,1)' }}>
            <circle
              cx={x}
              cy={y}
              r={now ? 3.2 : 2.1}
              fill={on ? (now ? '#f0b429' : '#e4572e') : '#1b1512'}
              stroke={on ? 'transparent' : 'rgba(241,230,208,.35)'}
              strokeWidth="0.4"
              style={{ transition: 'r .45s cubic-bezier(.22,1,.36,1), fill .35s ease' }}
            />
            <text
              x={50 + (R + 7.5) * Math.cos(a)}
              y={50 + (R + 7.5) * Math.sin(a)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono uppercase"
              style={{ fontSize: 3.1, letterSpacing: 0.3, fill: now ? '#f0b429' : on ? '#f1e6d0' : 'rgba(241,230,208,.4)', transition: 'fill .35s ease' }}
            >
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        );
      })}
      <g ref={progressRef} style={{ transformOrigin: '50px 50px' }}>
        <circle cx="50" cy={50 - R} r="7" fill="url(#packet-glow)" />
        <circle cx="50" cy={50 - R} r="1.4" fill="#f1e6d0" />
      </g>
    </svg>
  );
}

function StageDetail({ index }: { index: number }) {
  const stage = buildLoop[index];
  const Icon = ICONS[stage.key];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.key}
        initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -24, filter: 'blur(6px)' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-4">
          <motion.span
            className="grid h-11 w-11 place-items-center rounded-2xl border border-mustard/50 bg-mustard text-ink shadow-[4px_4px_0_var(--rust)] sm:h-14 sm:w-14"
            animate={ICON_MOTION[stage.key]}
            transition={{ duration: stage.key === 'redeploy' ? 1.6 : 1.1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Icon size={26} strokeWidth={2.2} />
          </motion.span>
          <span className="font-mono text-sm tracking-[0.14em] text-paper-dim">
            {String(index + 1).padStart(2, '0')} / {String(buildLoop.length).padStart(2, '0')}
          </span>
        </div>
        <h3 className="retro-shadow mt-4 font-display text-[clamp(1.9rem,3.6vw,3.6rem)] font-black uppercase leading-[0.92] text-paper sm:mt-6">
          {stage.title}
        </h3>
        <p className="justify mt-3 max-w-md text-base leading-relaxed text-paper-dim sm:mt-5 sm:text-lg">{stage.line}</p>
      </motion.div>
    </AnimatePresence>
  );
}

export default function BuildLoop() {
  const low = useLowPower();
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(0);

  // Every screen size: pin the ring and drive the packet round the loop with the scroll.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    const n = buildLoop.length;
    const arc = stage.querySelector<SVGCircleElement>('[data-arc]');
    const phone = window.innerWidth < 768;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${window.innerHeight * (phone ? 2.2 : 2.6)}`,
        pin: true,
        scrub: phone ? 0.4 : true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: self => {
          const p = self.progress;
          if (packetRef.current) packetRef.current.style.transform = `rotate(${p * 360}deg)`;
          if (arc) arc.style.strokeDashoffset = String(C * (1 - p));
          setActive(Math.min(n - 1, Math.floor(p * n)));
        }
      });
    }, stage);
    // The pin adds spacing; let triggers further down re-measure.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(id);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section id="build" className="relative overflow-clip">
      {/* A viewport-sized backdrop that stays put while the section scrolls: same look, a fraction of the pixels. */}
      <div className="pointer-events-none absolute inset-0">
      <LazyMount className="sticky top-0 h-[100svh] w-full opacity-80">
        <SideRays
          rayColor1="#f0b429"
          rayColor2="#e4572e"
          origin="top-left"
          speed={1.6}
          intensity={1.5}
          spread={2.2}
          density={6}
          falloff={1.9}
          glow={0.8}
          dust={low ? 0.25 : 0.4}
          followMouse
          maxDevicePixelRatio={low ? 1.25 : 1.5}
        />
      </LazyMount>
      </div>

      <div className="section pb-0">
        <div className="container-x relative">
          <SectionHeading index="05" eyebrow="Build loop · end to end" title="Requirement" accent="to redeploy." />
          <p className="justify mt-8 max-w-xl text-lg text-paper-dim">
            I own the whole loop — and when it closes, I start it again.
          </p>
        </div>
      </div>

      {reduced ? (
        // Reduced motion: the same stages as a calm, static list.
        <div className="section pt-12">
          <ol className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {buildLoop.map((s, i) => {
              const Icon = ICONS[s.key];
              return (
                <li key={s.key} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mustard text-ink">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.14em] text-paper-mute">{String(i + 1).padStart(2, '0')}</p>
                    <h3 className="font-display text-xl font-black uppercase text-paper">{s.title}</h3>
                    <p className="justify mt-1 text-paper-dim">{s.line}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div ref={stageRef} className="relative flex h-[100svh] items-center px-[var(--gutter)]">
          <div className="container-x grid items-center gap-4 pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-0">
            <div className="relative mx-auto aspect-square w-[min(74vw,44svh)] lg:col-span-6 lg:max-h-[78svh] lg:w-full">
              <Ring active={active} progressRef={packetRef} />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="eyebrow">the loop</p>
                  <p className="mt-1 font-display text-4xl font-black text-paper sm:mt-2 sm:text-6xl">∞</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim sm:text-[11px]">and counting</p>
                </div>
              </div>
            </div>
            <div className="min-h-[15.5rem] lg:col-span-6 lg:min-h-[22rem]">
              <StageDetail index={active} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
