'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { SiGithub } from 'react-icons/si';
import { ChevronDown } from 'lucide-react';
import LazyMount from '@/components/LazyMount';
import SectionHeading from '@/components/ui/SectionHeading';
import { ArrowOut } from '@/components/ui/Icons';
import Magnetic from '@/components/ui/Magnetic';
import { scrollToTarget } from '@/components/providers/SmoothScroll';
import { projects } from '@/content/site';
import { useMediaQuery } from '@/lib/hooks';

const FlexCarousel = dynamic(() => import('@/components/bits/FlexCarousel'), { ssr: false });

const showcase = projects.filter(p => p.image && p.live);
// The index opens with three projects and reveals three more per click, so the page stays short.
const PAGE = 3;

function CarouselFallback() {
  return (
    <div className="flex h-full items-center justify-center gap-4 overflow-hidden">
      {[0, 1, 2].map(i => (
        <div key={i} className="shimmer aspect-[16/10] h-[52%] shrink-0 rounded-2xl" />
      ))}
    </div>
  );
}

export default function Projects() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const wide = useMediaQuery('(min-width: 768px)', true);
  const listRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26 });
  const sy = useSpring(y, { stiffness: 260, damping: 26 });
  const hovered = hover !== null ? projects[hover] : null;
  const [visible, setVisible] = useState(PAGE);
  const [revealFrom, setRevealFrom] = useState(0);
  const allShown = visible >= projects.length;

  const toggle = () => {
    if (allShown) {
      setRevealFrom(0);
      setVisible(PAGE);
      setHover(null);
      if (listRef.current) scrollToTarget(listRef.current.parentElement ?? listRef.current);
    } else {
      setRevealFrom(visible);
      setVisible(v => Math.min(v + PAGE, projects.length));
    }
  };

  return (
    <section id="work" className="section overflow-hidden">
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="04" eyebrow="Selected work" title="Built &" accent="shipped." />
          <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-[0.12em] text-paper-dim">
            Drag the reel · click the centre card to open it live
          </p>
        </div>
      </div>

      <LazyMount
        className="relative mt-12 h-[min(64svh,620px)] min-h-[380px] w-full"
        margin="40% 0px"
        fallback={<CarouselFallback />}
      >
        <div className="h-full w-full" data-cursor="drag" data-cursor-label="Drag">
          <FlexCarousel
            items={showcase.map(p => ({ src: p.image!, alt: `${p.title} screenshot`, title: p.title, subtitle: `${p.kind} · ${p.year}` }))}
            preset="liquid"
            intro="rise"
            fit="landscape"
            cardHeight={wide ? 0.62 : 0.42}
            gap={18}
            radius={16}
            squeeze={0.16}
            focusOnClick={false}
            captureWheel={false}
            onSelect={(i: number) => {
              const link = showcase[i]?.live;
              if (link) window.open(link, '_blank', 'noopener,noreferrer');
            }}
          />
        </div>
      </LazyMount>

      <div className="container-x relative mt-24">
        <p className="eyebrow mb-6">Index · {projects.length} projects</p>
        <div
          ref={listRef}
          className="relative border-t"
          style={{ borderColor: 'var(--line-strong)' }}
          onPointerMove={e => {
            if (!fine || !listRef.current) return;
            const r = listRef.current.getBoundingClientRect();
            x.set(e.clientX - r.left);
            y.set(e.clientY - r.top);
          }}
          onPointerLeave={() => setHover(null)}
        >
          <AnimatePresence initial={false}>
          {projects.slice(0, visible).map((p, i) => {
            const href = p.live ?? p.repo;
            return (
              <motion.div
                key={p.title}
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i >= revealFrom ? (i - revealFrom) * 0.09 : 0 }}
              >
              <div
                className="group relative grid grid-cols-12 items-center gap-3 border-b py-6 sm:py-7"
                style={{ borderColor: 'var(--line)' }}
                onPointerEnter={() => setHover(i)}
              >
                <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-ink-2 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
                <span className="relative col-span-2 font-mono text-xs text-paper-mute sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative col-span-10 sm:col-span-6 lg:col-span-5"
                  data-cursor={p.image ? 'view' : 'link'}
                  data-cursor-label="Open"
                >
                  <span className="block font-display text-[clamp(1.25rem,3vw,2.1rem)] font-black uppercase leading-tight text-paper transition-all duration-500 group-hover:translate-x-2 group-hover:text-mustard">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-sm text-paper-dim sm:hidden">{p.line}</span>
                </a>
                {!fine && p.image && (
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-hidden="true"
                    tabIndex={-1}
                    className="relative col-span-12 block overflow-hidden rounded-xl border-2 border-paper/70 shadow-[6px_6px_0_var(--rust)] sm:col-span-11 sm:col-start-2"
                    initial={{ clipPath: 'inset(0 100% 0 0)', rotate: -1.5 }}
                    whileInView={{ clipPath: 'inset(0 0% 0 0)', rotate: 0 }}
                    whileTap={{ scale: 0.97 }}
                    viewport={{ once: true, margin: '-12% 0px' }}
                    transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" loading="lazy" decoding="async" width={960} height={600} className="block aspect-[16/9] w-full object-cover object-top" />
                  </motion.a>
                )}
                <p className="relative col-span-12 hidden text-sm leading-relaxed text-paper-dim sm:col-span-5 sm:block lg:col-span-4">
                  {p.line}
                </p>
                <div className="relative col-span-12 flex items-center gap-3 sm:col-span-12 sm:justify-start lg:col-span-2 lg:justify-end">
                  <span className="font-mono text-[11px] text-paper-mute">{p.year}</span>
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} on GitHub`} className="text-paper-dim transition-colors hover:text-paper">
                      <SiGithub size={16} />
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} live`} className="group/live inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-mustard">
                      Live <ArrowOut size={11} />
                    </a>
                  )}
                </div>
                <div className="relative col-span-12 flex flex-wrap gap-1.5 sm:col-start-2 sm:col-span-11">
                  {p.stack.map(s => (
                    <span key={s} className="chip !px-2 !py-0.5 !text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              </motion.div>
            );
          })}
          </AnimatePresence>

          {fine && (
            <motion.div className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block" style={{ x: sx, y: sy }}>
              <AnimatePresence>
                {hovered?.image && (
                  <motion.div
                    key={hovered.title}
                    className="-translate-x-1/2 -translate-y-[115%] overflow-hidden rounded-xl border-2 border-paper shadow-[8px_8px_0_var(--rust)]"
                    initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1, rotate: -2 }}
                    exit={{ opacity: 0, scale: 0.7, rotate: 4 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={hovered.image} alt="" width={320} height={200} className="block h-[200px] w-[320px] object-cover object-top" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Show more / show less */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper-dim">
            <span className="tabular-nums">
              {String(Math.min(visible, projects.length)).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
            <span className="relative h-[3px] w-28 overflow-hidden rounded-full bg-ink-3">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-rust to-mustard"
                animate={{ width: `${(Math.min(visible, projects.length) / projects.length) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </div>
          <Magnetic>
            <button type="button" onClick={toggle} className="btn btn-ghost group" aria-expanded={allShown}>
              {allShown ? 'Show less' : `Show ${Math.min(PAGE, projects.length - visible)} more`}
              <motion.span
                className="inline-flex"
                animate={{ rotate: allShown ? 180 : 0, y: allShown ? 0 : [0, 3, 0] }}
                transition={{ rotate: { duration: 0.4 }, y: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
              >
                <ChevronDown size={15} />
              </motion.span>
            </button>
          </Magnetic>
        </div>
      </div>

      <style>{`
        .flex-carousel__title { font-family: var(--font-display); font-size: 17px; font-weight: 800; text-transform: uppercase; letter-spacing: .02em; color: var(--paper); }
        .flex-carousel__subtitle { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: .12em; color: var(--mustard); opacity: 1; margin-top: 4px; }
        .flex-carousel__count { font-family: var(--font-mono); color: var(--paper-dim); }
      `}</style>
    </section>
  );
}
