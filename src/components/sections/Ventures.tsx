'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import LazyMount from '@/components/LazyMount';
import SectionHeading from '@/components/ui/SectionHeading';
import Magnetic from '@/components/ui/Magnetic';
import { ArrowOut } from '@/components/ui/Icons';
import { ventures } from '@/content/site';
import { useLowPower, useMediaQuery, useReducedMotion } from '@/lib/hooks';

const LaserFlow = dynamic(() => import('@/components/bits/LaserFlow'), { ssr: false });

/** Screenshot that tilts toward the pointer — or, on touch screens, tilts and glints as it scrolls past. */
function TiltShot({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const touch = useMediaQuery('(pointer: coarse)');
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scrollX = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [14, 0, -10]), { stiffness: 120, damping: 20 });
  const scrollY = useSpring(useTransform(scrollYProgress, [0, 1], [-6, 6]), { stiffness: 120, damping: 20 });
  const glare = useTransform(touch ? scrollY : sry, [-8, 8], ['20%', '80%']);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-ink [transform-style:preserve-3d]"
      style={{ rotateX: touch ? scrollX : srx, rotateY: touch ? scrollY : sry, transformPerspective: 900 }}
      whileTap={{ scale: 0.97 }}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" width={960} height={600} className="h-full w-full object-cover object-top" />
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ background: useTransform(glare, g => `radial-gradient(circle at ${g} 0%, rgba(255,255,255,.35), transparent 55%)`) }}
      />
    </motion.div>
  );
}

function Facts({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
      {items.map(f => (
        <div key={f.label}>
          <dt className="sr-only">{f.label}</dt>
          <dd className="font-display text-2xl font-black text-paper sm:text-3xl">{f.value}</dd>
          <p className="mt-1 font-mono text-[10px] uppercase leading-snug tracking-[0.1em] text-paper-dim">{f.label}</p>
        </div>
      ))}
    </dl>
  );
}

export default function Ventures() {
  const zyraaRef = useRef<HTMLDivElement>(null);
  const vinkoreRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const beamBoxRef = useRef<HTMLDivElement>(null);
  const low = useLowPower();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const [beamX, setBeamX] = useState(0.5);
  const reduced = useReducedMotion();
  const { zyraa, vinkore } = ventures;

  // Scroll drives the beam: it only travels down as you scroll down (and back up as you scroll up),
  // reaching the floor when the end of the section reaches the bottom of the screen.
  // A ref, not state, so scrolling never re-renders the section.
  const beamProgress = useRef(0);
  const { scrollYProgress } = useScroll({ target: beamBoxRef, offset: ['start 0.65', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', v => {
    beamProgress.current = v;
  });
  useEffect(() => {
    beamProgress.current = scrollYProgress.get();
  }, [scrollYProgress]);

  // The beam falls the whole height of the section and lands on the floor at the end.
  // On desktop it drops down the gutter between the two cards; on phones it glows through them.
  useEffect(() => {
    const box = beamBoxRef.current;
    if (!box) return;
    const measure = () => {
      const b = box.getBoundingClientRect();
      const z = zyraaRef.current?.getBoundingClientRect();
      const v = vinkoreRef.current?.getBoundingClientRect();
      if (desktop && z && v && b.width > 0) setBeamX(((z.right + v.left) / 2 - b.left) / b.width);
      else setBeamX(0.5);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [desktop]);

  return (
    <section id="ventures" className="section overflow-hidden">
      <div className="container-x relative">
        <SectionHeading index="03" eyebrow="Ventures" title="One product." accent="One team to carry it." />

        <div className="relative mt-10 pt-[clamp(150px,22vw,260px)]">
          <div ref={beamBoxRef} className="pointer-events-none absolute inset-0 -mx-[var(--gutter)]">
          <LazyMount className="h-full w-full">
            <LaserFlow
              surfaceRef={floorRef}
              progressRef={reduced ? undefined : beamProgress}
              beamPosition={beamX}
              color="#f0b429"
              intensity={1.6}
              beamWidth={1.3}
              flare={1.4}
              spread={2.2}
              fog={0.26}
              dust={low ? 1 : 1.3}
              speed={1.1}
              dpr={low ? 1.25 : 1.5}
            />
          </LazyMount>
          </div>

          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-start">
            <motion.article
              ref={zyraaRef}
              className="relative rounded-[28px] border bg-ink-2/80 p-6 backdrop-blur-md sm:p-9 lg:col-span-7"
              style={{ borderColor: 'var(--line-strong)' }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="chip border-mustard/60 text-mustard" style={{ borderColor: 'rgba(240,180,41,.5)' }}>
                  ★ {zyraa.badge}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-mute">Tiruppur · 2026</span>
              </div>
              <h3 className="retro-shadow mt-6 font-display text-[clamp(3.2rem,9vw,6.5rem)] font-black uppercase leading-[0.85] tracking-[-0.03em] text-paper">
                {zyraa.name}
              </h3>
              <p className="justify mt-5 max-w-xl text-lg leading-relaxed text-paper-dim">{zyraa.line}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {zyraa.chips.map(c => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-8" data-cursor="view" data-cursor-label="Zyraa">
                <a href={zyraa.href} target="_blank" rel="noopener noreferrer" aria-label="Open Zyraa">
                  <TiltShot src={zyraa.image} alt="Zyraa HRMS website" />
                </a>
              </div>
              <Facts items={zyraa.facts} />
              <div className="mt-8">
                <Magnetic>
                  <a href={zyraa.href} target="_blank" rel="noopener noreferrer" className="btn btn-primary group">
                    Visit Zyraa <ArrowOut size={14} />
                  </a>
                </Magnetic>
              </div>
            </motion.article>

            <div className="relative lg:col-span-5 lg:pt-24">
              <div className="mb-6 flex items-center gap-3 lg:-ml-12" aria-hidden="true">
                <svg className="h-6 w-24 shrink-0 overflow-visible" viewBox="0 0 96 24">
                  <path d="M0 12 H90" stroke="var(--line-strong)" strokeDasharray="4 6" strokeWidth="1.5">
                    <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.8s" repeatCount="indefinite" />
                  </path>
                  <circle r="4" fill="var(--mustard)">
                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M0 12 H90" />
                  </circle>
                  <path d="M84 6 L92 12 L84 18" fill="none" stroke="var(--mustard)" strokeWidth="1.5" />
                </svg>
                <span className="eyebrow text-mustard">distributed through</span>
              </div>

              <motion.article
                ref={vinkoreRef}
                className="relative rounded-[28px] border bg-ink/80 p-6 backdrop-blur-md sm:p-8"
                style={{ borderColor: 'var(--line-strong)' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              >
                <span className="chip">{vinkore.badge}</span>
                <h3 className="mt-6 font-display text-[clamp(2.4rem,6vw,3.8rem)] font-black uppercase leading-[0.9] tracking-[0.04em] text-paper [text-shadow:2px_2px_0_var(--teal)]">
                  {vinkore.name}
                </h3>
                <p className="justify mt-4 leading-relaxed text-paper-dim">{vinkore.line}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {vinkore.chips.map(c => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-7" data-cursor="view" data-cursor-label="Vinkore">
                  <a href={vinkore.href} target="_blank" rel="noopener noreferrer" aria-label="Open VINKORE">
                    <TiltShot src={vinkore.image} alt="VINKORE AI Solution website" />
                  </a>
                </div>
                <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-line pt-5">
                  {vinkore.facts.map(f => (
                    <div key={f.label}>
                      <dt className="sr-only">{f.label}</dt>
                      <dd className="font-display text-2xl font-black text-paper">{f.value}</dd>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-paper-dim">{f.label}</p>
                    </div>
                  ))}
                </dl>
                <a
                  href={vinkore.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-teal"
                >
                  <span className="link-underline">Visit VINKORE</span> <ArrowOut size={12} />
                </a>
              </motion.article>
            </div>
          </div>

          {/* The floor the beam lands on, at the very end of the section. */}
          <motion.div
            ref={floorRef}
            className="relative mt-24 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-[20px] border bg-ink-2 px-5 py-6 text-center sm:mt-32"
            style={{ borderColor: 'var(--line-strong)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="font-display text-sm font-black uppercase tracking-[0.06em] text-paper sm:text-base">From one factory floor</span>
            <span className="text-mustard">✦</span>
            <span className="font-display text-sm font-black uppercase tracking-[0.06em] text-paper sm:text-base">to every unit in Tiruppur</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
