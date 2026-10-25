'use client';

import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import LazyMount from '@/components/LazyMount';
import SectionHeading from '@/components/ui/SectionHeading';
import { growth } from '@/content/site';
import { useLowPower } from '@/lib/hooks';

const GhostFibers = dynamic(() => import('@/components/bits/GhostFibers'), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;
const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Contribution bars for the production months, with a trend line that draws itself. */
function CommitBars({ months }: { months: { month: string; count: number }[] }) {
  const max = Math.max(...months.map(m => m.count), 1);
  const w = 100 / months.length;
  const points = months.map((m, i) => `${i * w + w / 2},${100 - (m.count / max) * 86}`).join(' ');
  const total = months.reduce((s, m) => s + m.count, 0);

  return (
    <div className="rounded-[28px] border bg-ink/70 p-6 backdrop-blur-sm sm:p-8" style={{ borderColor: 'var(--line-strong)' }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">GitHub contributions · {growth.range}</p>
          <p className="mt-2 font-display text-5xl font-black text-paper">{total}</p>
        </div>
        <span className="chip text-teal" style={{ borderColor: 'rgba(79,181,165,.5)' }}>
          ▲ {Math.round(((months.at(-1)?.count ?? 0) / Math.max(months[0]?.count ?? 1, 1)) * 100) / 100}× since month one
        </span>
      </div>
      <div className="relative mt-8 h-56">
        <div className="absolute inset-0 flex items-end gap-3">
          {months.map((m, i) => (
            <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <motion.span
                className="font-mono text-xs text-paper"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.12 }}
              >
                {m.count}
              </motion.span>
              <motion.div
                className="w-full origin-bottom rounded-t-lg"
                style={{
                  height: `${(m.count / max) * 86}%`,
                  background: i === months.length - 1 ? 'var(--mustard)' : 'linear-gradient(to top, var(--rust), var(--mustard))',
                  boxShadow: i === months.length - 1 ? '4px 0 0 var(--rust)' : undefined
                }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 1, ease, delay: i * 0.12 }}
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper-dim">
                {MONTH[Number(m.month.slice(5, 7)) - 1]}
              </span>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-1.6rem)] w-full overflow-visible">
          <motion.polyline
            points={points}
            fill="none"
            stroke="var(--teal)"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease, delay: 0.5 }}
          />
        </svg>
      </div>
    </div>
  );
}

export default function Growth({ months }: { months: { month: string; count: number }[] }) {
  const low = useLowPower();
  const recent = months.filter(m => m.month >= '2026-06').slice(0, 5);

  return (
    <section id="growth" className="section overflow-clip">
      {/* Viewport-sized, sticky backdrop: the ribbons stay in frame while the cards scroll over them. */}
      <div className="pointer-events-none absolute inset-0">
      <LazyMount className="sticky top-0 h-[100svh] w-full opacity-70">
        <GhostFibers
          glowColor="#e4572e"
          secondaryColor="#4fb5a5"
          lineColor="#f1e6d0"
          gradient="along"
          layers={3}
          threads={low ? 54 : 64}
          density={low ? 0.75 : 0.9}
          twist={1.1}
          speed={0.35}
          flow={0.35}
          depthOfField={0.7}
          particles={low ? 0.35 : 0.45}
          glow={0.7}
          vignette={0.45}
          rotation={-14}
          mouseInteraction
          dpr={low ? 1.25 : 1.5}
        />
      </LazyMount>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" />

      <div className="container-x relative">
        <SectionHeading index="06" eyebrow={`Growth · ${growth.range}`} title="Five months." accent="Steeper curve." />

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <CommitBars months={recent.length ? recent : months.slice(-5)} />
          </div>

          <div className="rounded-[28px] border bg-ink/70 p-6 backdrop-blur-sm sm:p-8 lg:col-span-5" style={{ borderColor: 'var(--line-strong)' }}>
            <div className="flex items-center justify-between">
              <p className="eyebrow">Level</p>
              <p className="font-mono text-xs text-mustard">XP ▮▮▮▮▮</p>
            </div>
            <div className="mt-4 flex items-center justify-between font-display text-sm font-bold uppercase">
              <span className="text-paper-dim">Fresher</span>
              <span className="text-paper">Production engineer</span>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-full border bg-ink-3 p-[3px]" style={{ borderColor: 'var(--line-strong)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'repeating-linear-gradient(90deg, var(--mustard) 0 10px, var(--rust) 10px 14px)' }}
                initial={{ width: '6%' }}
                whileInView={{ width: '88%' }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease }}
              />
            </div>

            <p className="eyebrow mt-8">Then</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {growth.before.map(s => (
                <span key={s} className="chip opacity-70">
                  {s}
                </span>
              ))}
            </div>
            <p className="eyebrow mt-7 text-mustard">Unlocked in production</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {growth.after.map((s, i) => (
                <motion.span
                  key={s}
                  className="chip border-mustard bg-mustard/10 text-paper"
                  style={{ borderColor: 'rgba(240,180,41,.55)' }}
                  initial={{ opacity: 0, scale: 0.6, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.3 + i * 0.07 }}
                >
                  <span className="text-mustard">+</span> {s}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <ol className="mt-8 grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto pb-2 sm:auto-cols-[45%] lg:grid-flow-row lg:grid-cols-5 lg:overflow-visible">
          {growth.phases.map((p, i) => (
            <motion.li
              key={p.tag}
              className="group snap-start rounded-3xl border bg-ink/80 p-5 backdrop-blur-sm transition-colors duration-500 hover:bg-ink-2"
              style={{ borderColor: 'var(--line)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease, delay: i * 0.08 }}
            >
              <p className="font-display text-4xl font-black text-paper-mute transition-colors duration-300 group-hover:text-mustard">{p.tag}</p>
              <h3 className="mt-3 font-display text-base font-bold uppercase leading-tight text-paper">{p.title}</h3>
              <ul className="mt-4 space-y-1.5">
                {p.skills.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-paper-dim">
                    <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rotate-45 bg-rust" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
