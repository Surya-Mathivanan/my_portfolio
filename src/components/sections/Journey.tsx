'use client';

import { useEffect, useRef } from 'react';
import { animate, motion, useInView } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, GraduationCap, Rocket, School, type LucideIcon } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { journey, journeyExtras, type JourneyKind } from '@/content/site';

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

const KIND: Record<JourneyKind, { icon: LucideIcon; color: string; label: string }> = {
  school: { icon: School, color: '#4fb5a5', label: 'School' },
  college: { icon: GraduationCap, color: '#4fb5a5', label: 'College' },
  work: { icon: Briefcase, color: '#f0b429', label: 'Work' },
  venture: { icon: Rocket, color: '#e4572e', label: 'Venture' }
};

/** Counts a score up (with decimals) the first time it is seen. */
function Score({ value, decimals = 0, suffix }: { value: number; decimals?: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const c = animate(0, value, {
      duration: 1.4,
      ease,
      onUpdate: v => {
        el.textContent = `${v.toFixed(decimals)}${suffix}`;
      }
    });
    return () => c.stop();
  }, [inView, value, decimals, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Milestone({ item, index }: { item: (typeof journey)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  // "Active" while the milestone crosses the middle band of the screen.
  const active = useInView(ref, { margin: '-40% 0px -40% 0px' });
  const seen = useInView(ref, { once: true, margin: '-30% 0px -30% 0px' });
  const k = KIND[item.kind];
  const Icon = k.icon;
  const cardLeft = index % 2 === 0;

  return (
    <li ref={ref} className="relative grid items-center pl-14 md:grid-cols-2 md:gap-24 md:pl-0" style={{ ['--accent' as string]: k.color }}>
      {/* Node on the rail */}
      <span className="absolute left-[21px] top-7 z-10 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
        <motion.span
          className="relative grid h-11 w-11 place-items-center rounded-full border-2"
          animate={{
            backgroundColor: seen ? k.color : '#1b1512',
            borderColor: seen ? k.color : 'rgba(241,230,208,.24)',
            color: seen ? '#120e0c' : 'rgba(241,230,208,.6)',
            scale: active ? 1.18 : 1
          }}
          transition={{ duration: 0.45, ease }}
        >
          <Icon size={18} strokeWidth={2.2} />
          {active && (
            <motion.span
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: k.color }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
        </motion.span>
      </span>

      {/* The year, opposite the card on desktop: outlined until reached, then filled */}
      <div className={`hidden md:block ${cardLeft ? 'md:order-2' : 'md:order-1 md:text-right'}`}>
        <span
          className="block font-display text-[clamp(4rem,8vw,7.5rem)] font-black leading-none tracking-[-0.03em] transition-all duration-700"
          style={{
            color: seen ? k.color : 'transparent',
            WebkitTextStroke: seen ? '0px transparent' : '1.5px rgba(241,230,208,.22)',
            textShadow: seen ? '0.05em 0.05em 0 #120e0c, 0.09em 0.09em 0 rgba(241,230,208,.12)' : 'none'
          }}
        >
          {item.year}
        </span>
      </div>

      {/* The card */}
      <motion.article
        className={`group relative rounded-[24px] border bg-ink-2/90 p-5 backdrop-blur-sm transition-colors duration-500 sm:p-7 ${
          cardLeft ? 'md:order-1' : 'md:order-2'
        }`}
        style={{ borderColor: active ? k.color : 'var(--line-strong)' }}
        initial={{ opacity: 0, x: cardLeft ? -50 : 50, rotate: cardLeft ? -2 : 2 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.9, ease }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip !py-1" style={{ color: k.color, borderColor: 'var(--line-strong)' }}>
            <Icon size={12} /> {k.label}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper-dim">{item.period}</span>
          {item.now && (
            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-teal">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" /> Now
            </span>
          )}
        </div>
        <h3 className="mt-4 font-display text-xl font-black uppercase leading-tight text-paper transition-colors duration-300 group-hover:text-[var(--accent)] sm:text-2xl">
          {item.title}
        </h3>
        <p className="mt-1.5 text-sm font-semibold text-paper">
          {item.org} <span className="font-normal text-paper-dim">· {item.place}</span>
        </p>
        <p className="justify mt-3 text-[15px] leading-relaxed text-paper-dim">{item.line}</p>
        {item.score && (
          <div className="mt-5 flex items-end gap-3 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
            <span className="retro-shadow-sm font-display text-4xl font-black leading-none" style={{ color: k.color }}>
              <Score value={item.score.value} decimals={item.score.decimals} suffix={item.score.suffix} />
            </span>
            <span className="pb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper-dim">{item.score.label}</span>
          </div>
        )}
      </motion.article>
    </li>
  );
}

export default function Journey() {
  const listRef = useRef<HTMLOListElement>(null);

  // The rail fills and a light travels down it as you scroll through the timeline.
  useEffect(() => {
    const list = listRef.current;
    if (!list || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const st = { trigger: list, start: 'top 60%', end: 'bottom 55%', scrub: 0.4 };
      gsap.fromTo('[data-rail-fill]', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: st });
      gsap.fromTo('[data-rail-dot]', { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: st });
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <section id="journey" className="section overflow-clip">
      <div className="container-x relative">
        <SectionHeading index="02" eyebrow="Journey · education & experience" title="The road" accent="so far." />
        <p className="justify mt-8 max-w-xl text-lg text-paper-dim">
          From a classroom in Pudukkottai to a production floor in Tiruppur — every step taught by building.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(KIND) as JourneyKind[]).map(key => {
            const k = KIND[key];
            const Icon = k.icon;
            return (
              <span key={key} className="chip" style={{ color: k.color }}>
                <Icon size={12} /> {k.label}
              </span>
            );
          })}
        </div>

        <ol ref={listRef} className="relative mt-16 space-y-10 md:space-y-16">
          {/* Rail */}
          <span aria-hidden="true" className="absolute bottom-0 left-[21px] top-0 w-px -translate-x-1/2 md:left-1/2" style={{ background: 'var(--line-strong)' }} />
          <span
            aria-hidden="true"
            data-rail-fill
            className="absolute bottom-0 left-[21px] top-0 w-[3px] origin-top -translate-x-1/2 bg-gradient-to-b from-teal via-mustard to-rust md:left-1/2"
          />
          <span
            aria-hidden="true"
            data-rail-dot
            className="absolute left-[21px] z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow-[0_0_20px_6px_rgba(240,180,41,.65)] md:left-1/2"
          />
          {journey.map((item, i) => (
            <Milestone key={item.title + item.org} item={item} index={i} />
          ))}
        </ol>

        <p className="mt-10 pl-14 font-mono text-xs uppercase tracking-[0.16em] text-paper-dim md:pl-0 md:text-center">
          ▸ next chapter, in progress<span className="animate-blink text-mustard">_</span>
        </p>

        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border bg-line lg:grid-cols-4" style={{ borderColor: 'var(--line-strong)' }}>
          {journeyExtras.map((x, i) => (
            <motion.div
              key={x.label}
              className="group bg-ink p-5 transition-colors duration-500 hover:bg-ink-2 sm:p-7"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
            >
              <p className="retro-shadow-sm font-display text-3xl font-black text-paper transition-colors group-hover:text-mustard sm:text-4xl">{x.value}</p>
              <p className="mt-2 font-display text-[13px] font-bold uppercase text-paper">{x.label}</p>
              <p className="mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-paper-dim">{x.note}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
