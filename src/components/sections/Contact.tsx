'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Check, Copy, Download, Mail, Phone, Send } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { FaLinkedinIn } from 'react-icons/fa6';
import Magnetic from '@/components/ui/Magnetic';
import { ArrowOut, Pulse } from '@/components/ui/Icons';
import { profile, socials } from '@/content/site';
import { resume, resumePdf } from '@/content/resume';

const ease = [0.22, 1, 0.36, 1] as const;
const TOPICS = ['Hiring', 'Build a product', 'Zyraa demo', 'Just saying hi'];
const LINKEDIN = socials.find(s => s.label === 'LinkedIn')?.href ?? '#';

/** "Online now" between 9 AM and 9 PM in Tiruppur, otherwise when I'll be back. */
function useAvailability() {
  const [state, setState] = useState<{ online: boolean; time: string } | null>(null);
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', hour12: false }).format(now));
      const time = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit' }).format(now);
      setState({ online: hour >= 9 && hour < 21, time });
    };
    update();
    const id = window.setInterval(update, 30000);
    return () => window.clearInterval(id);
  }, []);
  return state;
}

/** Chat bubble whose dots type on a loop. */
function TypingBubble() {
  return (
    <span className="relative inline-flex items-center gap-1 rounded-2xl rounded-bl-sm bg-ink px-3 py-2" aria-hidden="true">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-teal"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

function Channel({
  href,
  icon,
  label,
  value,
  accent = 'var(--mustard)',
  external,
  children,
  hideArrow,
  delay = 0
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: string;
  accent?: string;
  external?: boolean;
  children?: ReactNode;
  hideArrow?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, ease, delay }}
    >
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-[22px] border bg-ink-2 p-5 transition-colors hover:border-[var(--accent)]"
        style={{ borderColor: 'var(--line-strong)', ['--accent' as string]: accent }}
        whileTap={{ scale: 0.96 }}
        data-cursor="link"
      >
        {/* shine sweep */}
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-paper/10 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]" />
        <span className="flex items-start justify-between">
          <motion.span
            className="grid h-11 w-11 place-items-center rounded-xl text-ink shadow-[3px_3px_0_var(--ink)]"
            style={{ background: accent }}
            whileHover={{ rotate: [0, -12, 10, -6, 0], scale: 1.08 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.span>
          {!hideArrow && <ArrowOut size={14} className="text-paper-dim" />}
        </span>
        <span>
          <span className="eyebrow block">{label}</span>
          {/* Prefer breaking before "@" or "--" rather than mid-word. */}
          <span className="mt-1 block text-[14px] font-semibold leading-snug text-paper [overflow-wrap:anywhere] sm:text-[15px]">
            {value.split(/(?=@)|(?<=--)/).map((part, i) => (
              <span key={i}>
                {i > 0 && <wbr />}
                {part}
              </span>
            ))}
          </span>
        </span>
      </motion.a>
      {children}
    </motion.div>
  );
}

/** A small paper preview of the résumé that tilts toward the pointer. */
function ResumeCard() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });

  return (
    <motion.div
      className="relative rounded-[28px] border bg-ink-2 p-6 sm:p-8"
      style={{ borderColor: 'var(--line-strong)' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="flex items-center justify-between">
        <p className="eyebrow">Résumé · 2026</p>
        <span className="chip !py-1 text-teal" style={{ borderColor: 'rgba(79,181,165,.45)' }}>
          PDF · 1 min read
        </span>
      </div>

      <Link
        href="/resume/"
        className="relative mx-auto mt-8 block w-[86%] max-w-[330px] [perspective:900px]"
        data-cursor="view"
        data-cursor-label="Open"
        onPointerMove={e => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 18);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {/* stacked sheets behind */}
        <span className="absolute inset-0 translate-x-3 translate-y-3 rotate-[5deg] rounded-xl bg-mustard/80" aria-hidden="true" />
        <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[2.5deg] rounded-xl bg-rust/80" aria-hidden="true" />
        <motion.span
          className="relative block aspect-[1/1.32] overflow-hidden rounded-xl bg-[#f4ebd9] shadow-[0_24px_50px_-20px_rgba(0,0,0,.8)]"
          style={{ rotateX: srx, rotateY: sry }}
          whileTap={{ scale: 0.97 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <span className="block bg-[#1b1512] px-4 pb-3 pt-4">
            <span className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/portrait-full-sm.webp" alt="" width={300} height={381} className="h-11 w-[2.2rem] shrink-0 rounded-md border border-[#f0b429] object-cover" />
              <span>
                <span className="block font-display text-[15px] font-black uppercase leading-none text-[#f1e6d0] [text-shadow:2px_2px_0_#e4572e]">{resume.name}</span>
                <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.14em] text-[#f0b429]">{resume.title}</span>
              </span>
            </span>
          </span>
          <span className="block space-y-3 px-4 py-4">
            {[
              ['Experience', `${resume.experience[0].role} — ${resume.experience[0].org}`],
              ['Projects', resume.projects[0].name.split(' — ')[0] + ' · ' + resume.projects[1].name],
              ['Education', 'B.Tech AI & DS · CGPA 8']
            ].map(([h, l]) => (
              <span key={h} className="block">
                <span className="flex items-center gap-1.5 font-display text-[8px] font-black uppercase tracking-[0.1em] text-[#1b1512]">
                  <span className="h-1.5 w-1.5 rotate-45 bg-[#e4572e]" /> {h}
                </span>
                <span className="mt-1 block text-[9px] font-semibold leading-tight text-[#2a211c]">{l}</span>
                <span className="mt-1.5 block h-1 w-full rounded bg-[#1b1512]/10" />
                <span className="mt-1 block h-1 w-4/5 rounded bg-[#1b1512]/10" />
              </span>
            ))}
            <span className="flex flex-wrap gap-1 pt-1">
              {['Python', 'React', 'Django', 'RAG', 'PostgreSQL'].map(s => (
                <span key={s} className="rounded-full border border-[#1b1512]/20 px-1.5 py-px text-[7px] text-[#2a211c]">
                  {s}
                </span>
              ))}
            </span>
          </span>
        </motion.span>
      </Link>

      <div className="mt-10 flex flex-wrap gap-3">
        <Magnetic className="flex-1">
          <Link href="/resume/" className="btn btn-primary group w-full">
            View résumé <ArrowOut size={13} />
          </Link>
        </Magnetic>
        <Magnetic>
          <a href={resumePdf} download className="btn btn-ghost" aria-label="Download résumé PDF">
            <Download size={14} /> PDF
          </a>
        </Magnetic>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const status = useAvailability();
  const [copied, setCopied] = useState(false);
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const composed = `Hi Surya${name ? `, I'm ${name}` : ''}. [${topic}] ${message}`.trim();
  const waHello = encodeURIComponent('Hi Surya, I saw your portfolio and would like to talk.');

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (channel === 'whatsapp') {
      window.open(`${profile.whatsapp}?text=${encodeURIComponent(composed)}`, '_blank', 'noopener,noreferrer');
    } else {
      const subject = encodeURIComponent(`${topic} — from ${name || 'your portfolio'}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(composed)}`;
    }
  };

  return (
    <section id="contact" className="section overflow-hidden">
      {/* slow conic glow behind the heading */}
      <div
        aria-hidden="true"
        className="animate-spin-slow pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
        style={{ background: 'conic-gradient(from 0deg, var(--rust), var(--mustard), var(--teal), var(--rust))' }}
      />

      <div className="container-x relative">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-mustard">09</span>
          <span className="h-px w-10" style={{ background: 'var(--line-strong)' }} />
          Contact
        </p>
        <motion.h2
          className="retro-shadow mt-6 font-display text-[clamp(2.6rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-paper"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease }}
        >
          Got a real <span className="font-serif font-light normal-case italic text-mustard [text-shadow:none]">problem?</span>
        </motion.h2>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="chip !normal-case !tracking-normal !text-[12px]">
            {status?.online ? <Pulse /> : <span className="h-2.5 w-2.5 rounded-full border border-paper-mute" />}
            <span className="text-paper">{status ? (status.online ? 'Online now' : 'Away right now') : 'Checking…'}</span>
            {status && <span className="text-paper-dim">· {status.time} IST</span>}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper-dim">
            {status?.online ? 'Usually replies within a few hours' : 'Replies from 9 AM IST'}
          </span>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Channels */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
            <motion.a
              href={`${profile.whatsapp}?text=${waHello}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative col-span-2 flex items-center justify-between gap-4 overflow-hidden rounded-[24px] bg-teal p-5 text-ink shadow-[6px_6px_0_var(--ink)] sm:p-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.7, ease }}
              data-cursor="link"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[300%]" />
              <span className="flex items-center gap-4">
                <motion.span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-teal shadow-[3px_3px_0_rgba(0,0,0,.35)] sm:h-16 sm:w-16"
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.4 }}
                >
                  <SiWhatsapp size={28} />
                </motion.span>
                <span>
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/70">Fastest reply</span>
                  <span className="block font-display text-xl font-black uppercase leading-tight sm:text-2xl">Chat on WhatsApp</span>
                  <span className="mt-0.5 block text-sm font-medium text-ink/80">{profile.phone}</span>
                </span>
              </span>
              <span className="hidden items-center gap-3 sm:flex">
                <TypingBubble />
                <ArrowOut size={18} />
              </span>
            </motion.a>

            <Channel href={`mailto:${profile.email}`} icon={<Mail size={20} />} label="Email" value={profile.email} hideArrow delay={0.05}>
              <button
                type="button"
                onClick={copy}
                className="absolute right-3 top-3 z-10 inline-flex h-9 items-center gap-1.5 rounded-full border bg-ink px-3 font-mono text-[10px] uppercase tracking-[0.1em] text-paper-dim transition-colors hover:text-paper"
                style={{ borderColor: 'var(--line-strong)' }}
                aria-label="Copy email address"
              >
                {copied ? <Check size={13} className="text-teal" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </Channel>
            <Channel href={profile.phoneHref} icon={<Phone size={20} />} label="Call" value={profile.phone} accent="var(--rust)" delay={0.1} />
            <Channel href={LINKEDIN} icon={<FaLinkedinIn size={19} />} label="LinkedIn" value="surya--mathivanan" accent="#f1e6d0" external delay={0.15} />
            <Channel href="https://github.com/Surya-Mathivanan" icon={<span className="font-display text-sm font-black">GH</span>} label="GitHub" value="Surya-Mathivanan" accent="var(--plum)" external delay={0.2} />
          </div>

          {/* Résumé */}
          <div className="lg:col-span-5 lg:row-span-2">
            <div className="lg:sticky lg:top-28">
              <ResumeCard />
            </div>
          </div>

          {/* Composer */}
          <motion.form
            onSubmit={send}
            className="rounded-[28px] border bg-ink-2 p-5 sm:p-8 lg:col-span-7"
            style={{ borderColor: 'var(--line-strong)' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ duration: 0.9, ease }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="font-display text-lg font-black uppercase text-paper">Write it once</p>
              <div className="relative flex rounded-full bg-ink-3 p-1" role="tablist" aria-label="Send with">
                {(['whatsapp', 'email'] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={channel === c}
                    onClick={() => setChannel(c)}
                    className={`relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                      channel === c ? 'text-ink' : 'text-paper-dim'
                    }`}
                  >
                    {channel === c && (
                      <motion.span
                        layoutId="contact-channel"
                        className={`absolute inset-0 -z-10 rounded-full ${c === 'whatsapp' ? 'bg-teal' : 'bg-mustard'}`}
                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      />
                    )}
                    {c === 'whatsapp' ? <SiWhatsapp size={13} /> : <Mail size={13} />}
                    {c === 'whatsapp' ? 'WhatsApp' : 'Email'}
                  </button>
                ))}
              </div>
            </div>

            <p className="eyebrow mt-7">It&apos;s about</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOPICS.map(t => (
                <motion.button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  whileTap={{ scale: 0.92 }}
                  className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                    topic === t ? 'border-mustard bg-mustard text-ink' : 'text-paper-dim hover:text-paper'
                  }`}
                  style={topic === t ? undefined : { borderColor: 'var(--line-strong)' }}
                  aria-pressed={topic === t}
                >
                  {t}
                </motion.button>
              ))}
            </div>

            <label className="mt-7 block">
              <span className="eyebrow">Your name</span>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-2 w-full border-b bg-transparent py-3 font-display text-lg text-paper outline-none transition-colors placeholder:text-paper-mute focus:border-mustard"
                style={{ borderColor: 'var(--line-strong)' }}
                placeholder="Who’s building?"
                autoComplete="name"
              />
            </label>
            <label className="mt-6 block">
              <span className="eyebrow">Message</span>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={3}
                className="mt-2 w-full resize-none border-b bg-transparent py-3 text-base text-paper outline-none transition-colors placeholder:text-paper-mute focus:border-mustard"
                style={{ borderColor: 'var(--line-strong)' }}
                placeholder="The problem, the people, the deadline…"
              />
            </label>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper-mute">
                Opens {channel === 'whatsapp' ? 'WhatsApp' : 'your mail app'} · nothing stored
              </p>
              <Magnetic>
                <button
                  type="submit"
                  className={`btn group ${channel === 'whatsapp' ? 'bg-teal text-ink shadow-[4px_4px_0_var(--ink)]' : 'btn-primary'}`}
                >
                  {channel === 'whatsapp' ? <SiWhatsapp size={15} /> : null}
                  {channel === 'whatsapp' ? 'Send on WhatsApp' : 'Send email'}
                  <Send size={14} className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </button>
              </Magnetic>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
