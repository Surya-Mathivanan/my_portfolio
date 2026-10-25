'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Download, FileText, Link2, Printer, ScrollText } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { resume, resumePdf } from '@/content/resume';
import { profile } from '@/content/site';
import { useAppReady, useMediaQuery } from '@/lib/hooks';

const ease = [0.22, 1, 0.36, 1] as const;

function Block({ title, children, delay = 0 }: { title: string; children: ReactNode; delay?: number }) {
  return (
    <motion.section
      className="resume-block"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      <h2 className="mb-4 flex items-center gap-3 font-display text-[13px] font-black uppercase tracking-[0.12em] text-[#1b1512]">
        <span className="h-2.5 w-2.5 rotate-45 bg-[#e4572e]" />
        {title}
        <span className="h-px flex-1 bg-[#1b1512]/15" />
      </h2>
      {children}
    </motion.section>
  );
}

function Sheet() {
  const r = resume;
  return (
    <article className="resume-sheet relative mx-auto w-full max-w-[920px] overflow-hidden rounded-[22px] bg-[#f4ebd9] text-[#2a211c] shadow-[10px_10px_0_var(--rust)] sm:rounded-[28px] sm:shadow-[14px_14px_0_var(--rust)]">
      {/* paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)' opacity='.22'/%3E%3C/svg%3E\")"
        }}
      />

      {/* Header band */}
      <header className="relative bg-[#1b1512] px-6 pb-7 pt-8 text-[#f1e6d0] sm:px-10 sm:pb-9 sm:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/portrait-full-sm.webp" alt="Surya Mathivanan" width={300} height={381} className="h-24 w-[4.75rem] shrink-0 rounded-xl border-2 border-[#f0b429] object-cover shadow-[4px_4px_0_#e4572e] sm:h-28 sm:w-[5.5rem]" />
            <div>
              <h1 className="font-display text-4xl font-black uppercase leading-none tracking-[-0.02em] [text-shadow:3px_3px_0_#e4572e] sm:text-5xl">
                {r.name}
              </h1>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#f0b429]">{r.title}</p>
            </div>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#b8aa93]">{r.location}</p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#f1e6d0]/15 pt-5 text-[13px]">
          {r.contacts.map(c => (
            <li key={c.label}>
              <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group inline-flex items-baseline gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#f0b429]">{c.label}</span>
                <span className="text-[#f1e6d0] underline-offset-4 group-hover:underline">{c.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </header>

      <div className="resume-grid relative grid gap-9 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1fr_15rem] md:gap-10">
        {/* Main column */}
        <div className="space-y-9">
          <Block title="Profile">
            <p className="text-justify text-[15px] leading-relaxed [hyphens:auto]">{r.profile}</p>
          </Block>

          <Block title="Experience">
            <div className="space-y-6">
              {r.experience.map(e => (
                <div key={e.role + e.org}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base font-black uppercase leading-tight text-[#1b1512]">
                      {e.role} <span className="font-sans text-sm font-semibold normal-case text-[#9a3a1d]">· {e.org}, {e.place}</span>
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#7d7262]">{e.period}</span>
                  </div>
                  {'note' in e && e.note && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f7d71]">{e.note}</p>}
                  <ul className="mt-3 space-y-2">
                    {e.points.map(p => (
                      <li key={p} className="flex gap-3 text-justify text-[14px] leading-relaxed [hyphens:auto]">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#e4572e]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Projects">
            <div className="space-y-6">
              {r.projects.map(p => (
                <div key={p.name}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-base font-black uppercase leading-tight text-[#1b1512]">{p.name}</h3>
                    {'href' in p && p.href ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9a3a1d] underline underline-offset-4">
                        GitHub ↗
                      </a>
                    ) : null}
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7d7262]">{p.context}</p>
                  <ul className="mt-3 space-y-2">
                    {p.points.map(pt => (
                      <li key={pt} className="flex gap-3 text-justify text-[14px] leading-relaxed [hyphens:auto]">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#e4572e]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Technical highlights">
            <div className="grid gap-4 sm:grid-cols-3">
              {r.highlights.map(h => (
                <div key={h.group}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#2f7d71]">{h.group}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed">{h.items.join(' · ')}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Competitive programming">
            <ul className="grid gap-2 sm:grid-cols-2">
              {r.competitive.map(c => (
                <li key={c} className="flex gap-3 text-[14px] leading-relaxed">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#f0b429]" />
                  {c}
                </li>
              ))}
            </ul>
          </Block>
        </div>

        {/* Side column */}
        <aside className="resume-side space-y-9 md:border-l md:border-[#1b1512]/12 md:pl-8">
          <Block title="Skills" delay={0.1}>
            <div className="space-y-4">
              {r.skills.map(s => (
                <div key={s.group}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#7d7262]">{s.group}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {s.items.map(i => (
                      <span key={i} className="rounded-full border border-[#1b1512]/20 px-2 py-0.5 text-[12px] leading-snug">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Education" delay={0.15}>
            <div className="space-y-4">
              {r.education.map(e => (
                <div key={e.title}>
                  <p className="font-display text-[13px] font-black uppercase leading-tight text-[#1b1512]">{e.title}</p>
                  <p className="mt-1 text-[12.5px] leading-snug">{e.place}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#7d7262]">
                    {e.period} · <span className="text-[#9a3a1d]">{e.score}</span>
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Certificates" delay={0.2}>
            <ul className="space-y-2.5">
              {r.certificates.map(c => (
                <li key={c} className="text-[12.5px] leading-snug">
                  {c}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Soft skills" delay={0.25}>
            <p className="text-[13px] leading-relaxed">{r.soft.join(' · ')}</p>
          </Block>
        </aside>
      </div>

      <footer className="relative flex flex-wrap items-center justify-between gap-3 border-t border-[#1b1512]/12 px-6 py-5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#7d7262] sm:px-10">
        <span>{profile.site.replace('https://', '')}/resume</span>
        <span>Updated Oct 2026</span>
      </footer>
    </article>
  );
}

function ActionButton({ children, onClick, href, download, label }: { children: ReactNode; onClick?: () => void; href?: string; download?: boolean; label: string }) {
  const cls =
    'group inline-flex h-11 items-center gap-2 rounded-full px-3.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper transition-colors hover:bg-paper/10 sm:px-4';
  const inner = (
    <motion.span className="inline-flex items-center gap-2" whileTap={{ scale: 0.9 }}>
      {children}
    </motion.span>
  );
  return href ? (
    <a href={href} download={download || undefined} target={download ? undefined : '_blank'} rel="noopener noreferrer" className={cls} aria-label={label}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls} aria-label={label}>
      {inner}
    </button>
  );
}

export default function ResumeView() {
  const ready = useAppReady();
  const touch = useMediaQuery('(pointer: coarse)');
  const [view, setView] = useState<'web' | 'pdf'>('web');
  const [copied, setCopied] = useState(false);
  const [printing, setPrinting] = useState(true);

  // The sheet "prints" in once: a scan bar runs down while the page reveals behind it.
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setPrinting(false), 1700);
    return () => window.clearTimeout(id);
  }, [ready]);

  const share = async () => {
    const url = `${profile.site}/resume/`;
    try {
      if (navigator.share) await navigator.share({ title: `${profile.name} — Résumé`, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  };

  const waText = encodeURIComponent(`Hi Surya, I just read your résumé (${profile.site}/resume/) and would like to talk.`);

  return (
    <section className="section min-h-[100svh] pt-32 sm:pt-40">
      <div className="container-x">
        <div data-no-print className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-mustard">✦</span>
              <span className="h-px w-10" style={{ background: 'var(--line-strong)' }} />
              Résumé
            </p>
            <h1 className="retro-shadow mt-5 font-display text-[clamp(2.6rem,9vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-paper">
              On <span className="font-serif font-light normal-case italic text-mustard [text-shadow:none]">paper.</span>
            </h1>
          </div>
          <p className="max-w-xs text-paper-dim">Read it here, print it, or take the PDF with you.</p>
        </div>

        {/* Floating action bar */}
        <div data-no-print className="sticky top-3 z-[58] mt-10 flex justify-center sm:top-5">
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border bg-ink/85 p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] backdrop-blur-md" style={{ borderColor: 'var(--line-strong)' }}>
            <div className="relative flex rounded-full bg-ink-3 p-1">
              {(['web', 'pdf'] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className={`relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${view === v ? 'text-ink' : 'text-paper-dim'}`}
                  aria-pressed={view === v}
                >
                  {view === v && <motion.span layoutId="resume-view" className="absolute inset-0 -z-10 rounded-full bg-mustard" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                  {v === 'web' ? <ScrollText size={14} /> : <FileText size={14} />}
                  {v === 'web' ? 'Web' : 'PDF'}
                </button>
              ))}
            </div>
            <ActionButton href={resumePdf} download label="Download PDF">
              <Download size={15} className="transition-transform group-hover:translate-y-0.5" /> <span className="hidden sm:inline">Download</span>
            </ActionButton>
            <ActionButton onClick={() => window.print()} label="Print or save as PDF">
              <Printer size={15} /> <span className="hidden sm:inline">Print</span>
            </ActionButton>
            <ActionButton onClick={share} label="Share link">
              {copied ? <Check size={15} className="text-teal" /> : <Link2 size={15} />} <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </ActionButton>
            <a
              href={`${profile.whatsapp}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-teal px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-ink"
              aria-label="Message on WhatsApp"
            >
              <SiWhatsapp size={15} /> <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="relative mt-10">
          <AnimatePresence mode="wait">
            {view === 'web' ? (
              <motion.div
                key="web"
                className="resume-print-root relative"
                initial={{ opacity: 0, y: 30 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease }}
              >
                <motion.div
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  animate={ready ? { clipPath: 'inset(0 0 0% 0)' } : {}}
                  transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
                >
                  <Sheet />
                </motion.div>
                {printing && ready && (
                  <motion.span
                    data-no-print
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[-6px] top-0 h-1 rounded-full bg-mustard shadow-[0_0_24px_6px_rgba(240,180,41,.55)]"
                    initial={{ top: '0%', opacity: 1 }}
                    animate={{ top: '100%', opacity: [1, 1, 0] }}
                    transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
                  />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="pdf"
                data-no-print
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease }}
                className="mx-auto max-w-[920px]"
              >
                {touch ? (
                  // Most phone browsers can't show a PDF inline, so offer it directly.
                  <div className="rounded-[26px] border bg-ink-2 p-8 text-center" style={{ borderColor: 'var(--line-strong)' }}>
                    <FileText size={40} className="mx-auto text-mustard" />
                    <p className="mt-4 font-display text-xl font-black uppercase text-paper">The original PDF</p>
                    <p className="mt-2 text-sm text-paper-dim">Opens in your phone&apos;s PDF viewer.</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <a href={resumePdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Open PDF
                      </a>
                      <a href={resumePdf} download className="btn btn-ghost">
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-[22px] border-2 border-paper/70 bg-ink-2 shadow-[14px_14px_0_var(--rust)]">
                    <object data={`${resumePdf}#view=FitH`} type="application/pdf" className="block h-[min(82svh,1100px)] w-full" aria-label="Résumé PDF">
                      <div className="p-8 text-center text-paper-dim">
                        Your browser can&apos;t show the PDF here.{' '}
                        <a href={resumePdf} className="text-mustard underline">
                          Download it instead
                        </a>
                        .
                      </div>
                    </object>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
