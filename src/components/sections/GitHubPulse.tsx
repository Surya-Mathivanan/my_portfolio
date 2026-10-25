'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { SiGithub } from 'react-icons/si';
import SectionHeading from '@/components/ui/SectionHeading';
import Counter from '@/components/ui/Counter';
import Magnetic from '@/components/ui/Magnetic';
import { ArrowOut, Wiggle } from '@/components/ui/Icons';
import type { GitHubData } from '@/lib/github';

const LEVELS = ['#241b16', '#5b2a18', '#a23d1f', '#e4572e', '#f0b429'];
const LANG_COLORS = ['#f0b429', '#e4572e', '#4fb5a5', '#9b4f78', '#f1e6d0', '#b8aa93'];
const ease = [0.22, 1, 0.36, 1] as const;

function Heatmap({ days }: { days: GitHubData['contributions'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  // Pad to whole weeks starting on Sunday so the grid lines up like GitHub's.
  const weeks = useMemo(() => {
    if (!days.length) return [];
    const first = new Date(days[0].date + 'T00:00:00');
    const pad = first.getDay();
    const cells: (GitHubData['contributions'][number] | null)[] = [...Array(pad).fill(null), ...days];
    const out = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [days]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  // One SVG, revealed by a single clip-path wipe with a scan bar riding its edge — cheap to animate.
  const STEP = 14;
  const SIZE = 11;
  const width = weeks.length * STEP;
  const height = 7 * STEP;

  // Hover with a mouse or tap with a finger to read a day.
  const showTip = (target: SVGElement) => {
    const date = target.getAttribute('data-date');
    if (!date) return setTip(null);
    const d = days.find(x => x.date === date);
    if (!d || !ref.current) return;
    const r = target.getBoundingClientRect();
    const box = ref.current.getBoundingClientRect();
    setTip({
      x: r.left - box.left + r.width / 2,
      y: r.top - box.top,
      text: `${d.count || 'No'} contribution${d.count === 1 ? '' : 's'} · ${new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
    });
  };

  return (
    <div ref={ref} className="relative">
      <div ref={scrollRef} className="overflow-x-auto pb-3" onPointerLeave={() => setTip(null)}>
        <div className={`heatmap relative min-w-[680px] ${inView ? 'is-in' : ''}`}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="heat-svg block h-auto w-full"
            role="img"
            aria-label={`${days.reduce((s, d) => s + d.count, 0)} contributions in the last year`}
            onPointerDown={e => showTip(e.target as SVGElement)}
            onPointerMove={e => showTip(e.target as SVGElement)}
          >
            {weeks.map((week, w) =>
              week.map((d, i) =>
                d ? (
                  <rect
                    key={d.date}
                    data-date={d.date}
                    x={w * STEP}
                    y={i * STEP}
                    width={SIZE}
                    height={SIZE}
                    rx={2.5}
                    fill={LEVELS[d.level]}
                    className="heat-cell"
                  />
                ) : null
              )
            )}
          </svg>
          <span className="heat-scan pointer-events-none absolute inset-y-0 w-[3px] bg-mustard shadow-[0_0_18px_4px_rgba(240,180,41,.55)]" />
        </div>
      </div>
      {tip && (
        <span
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-md bg-paper px-2 py-1 font-mono text-[10px] text-ink"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </span>
      )}
      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper-mute">
        less
        {LEVELS.map(c => (
          <span key={c} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: c }} />
        ))}
        more
      </div>
      <style>{`
        .heat-svg { clip-path: inset(0 100% 0 0); }
        .heatmap.is-in .heat-svg { animation: heat-wipe 1.6s cubic-bezier(.65,0,.35,1) forwards; }
        .heat-scan { left: 0; opacity: 0; }
        .heatmap.is-in .heat-scan { animation: heat-scan 1.6s cubic-bezier(.65,0,.35,1) forwards; }
        .heat-cell { transition: fill .2s ease; }
        .heat-cell:hover { stroke: var(--paper); stroke-width: 1.2; }
        @keyframes heat-wipe { to { clip-path: inset(0 0 0 0); } }
        @keyframes heat-scan { 0% { left: 0; opacity: 1; } 92% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
      `}</style>
    </div>
  );
}

function Terminal({ recent }: { recent: GitHubData['recent'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const rows = recent.slice(0, 8);

  return (
    <div ref={ref} className="overflow-hidden rounded-[22px] border bg-[#0c0908]" style={{ borderColor: 'var(--line-strong)' }}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rust" />
        <span className="h-3 w-3 rounded-full bg-mustard" />
        <span className="h-3 w-3 rounded-full bg-teal" />
        <span className="ml-3 font-mono text-[11px] text-paper-mute">surya@tiruppur: ~/github</span>
      </div>
      <div className="space-y-1.5 p-4 font-mono text-[12px] leading-relaxed sm:p-5 sm:text-[13px]">
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-paper-dim">
          <span className="text-teal">$</span> git log --all --author=surya --oneline
        </motion.p>
        {rows.map((r, i) => (
          <motion.a
            key={r.name}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 text-paper hover:text-mustard"
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35 + i * 0.16, duration: 0.3 }}
          >
            <span className="shrink-0 text-paper-mute">{r.pushedAt}</span>
            <span className="truncate">{r.name}</span>
            <span className="ml-auto hidden shrink-0 text-rust sm:inline">{r.language ?? '—'}</span>
          </motion.a>
        ))}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 + rows.length * 0.16 }}
          className="text-paper-dim"
        >
          <span className="text-teal">$</span> <span className="animate-blink inline-block h-3.5 w-2 translate-y-0.5 bg-mustard" />
        </motion.p>
      </div>
    </div>
  );
}

export default function GitHubPulse({ data }: { data: GitHubData }) {
  const totalLangs = data.languages.reduce((s, l) => s + l.count, 0) || 1;
  const since = new Date(data.since + 'T00:00:00').getFullYear();

  return (
    <section id="github" className="section overflow-hidden">
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading index="07" eyebrow="GitHub · live from the build" title="Commit" accent="pulse." />
          <Magnetic>
            <a href={`https://github.com/${data.login}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost group">
              <Wiggle>
                <SiGithub size={16} />
              </Wiggle>
              @{data.login} <ArrowOut size={13} />
            </a>
          </Magnetic>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { v: data.total, l: 'contributions · 12 mo' },
            { v: data.publicRepos, l: 'public repositories' },
            { v: data.followers, l: 'followers' },
            { v: since, l: 'shipping since', plain: true }
          ].map(x => (
            <div key={x.l} className="border-t pt-4" style={{ borderColor: 'var(--line-strong)' }}>
              <dd className="font-display text-4xl font-black text-paper sm:text-5xl">
                {x.plain ? x.v : <Counter value={x.v} />}
              </dd>
              <dt className="eyebrow mt-2">{x.l}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-12 rounded-[28px] border bg-ink-2/70 p-5 sm:p-8" style={{ borderColor: 'var(--line)' }}>
          <Heatmap days={data.contributions} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="rounded-[28px] border bg-ink-2/70 p-6 sm:p-8 lg:col-span-5" style={{ borderColor: 'var(--line)' }}>
            <p className="eyebrow">Languages across repos</p>
            <div className="mt-6 flex h-5 overflow-hidden rounded-full border" style={{ borderColor: 'var(--line-strong)' }}>
              {data.languages.map((l, i) => (
                <motion.span
                  key={l.name}
                  className="h-full"
                  style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(l.count / totalLangs) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease, delay: 0.1 * i }}
                />
              ))}
            </div>
            <ul className="mt-6 space-y-3">
              {data.languages.map((l, i) => (
                <li key={l.name} className="flex items-center gap-3 text-sm">
                  <span className="h-3 w-3 rotate-45" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
                  <span className="text-paper">{l.name}</span>
                  <span className="ml-auto font-mono text-xs text-paper-dim">
                    {l.count} · {Math.round((l.count / totalLangs) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7">
            <Terminal recent={data.recent} />
          </div>
        </div>
      </div>
    </section>
  );
}
