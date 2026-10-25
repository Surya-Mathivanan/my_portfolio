'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LazyMount from '@/components/LazyMount';
import { ArrowOut, Wiggle } from '@/components/ui/Icons';
import Magnetic from '@/components/ui/Magnetic';
import { scrollToTarget } from '@/components/providers/SmoothScroll';
import { nav, profile, socials } from '@/content/site';
import { useCssVar, useLowPower, useMediaQuery } from '@/lib/hooks';

gsap.registerPlugin(ScrollTrigger);

const ElasticMesh = dynamic(() => import('@/components/bits/ElasticMesh'), { ssr: false });
const GradientASCII = dynamic(() => import('@/components/bits/GradientASCII'), { ssr: false });

const MARQUEE = ['Let’s build', 'AI engineering', 'Product', 'Real users', 'Shipped, not slides'];

function Clock() {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

/** Marquee whose speed and skew react to how fast the page is scrolled. */
function VelocityMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0;
    let boost = 0;
    const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3' });
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => {
        const v = self.getVelocity();
        boost = Math.max(-6, Math.min(6, v / 400));
        skewTo(Math.max(-8, Math.min(8, v / -300)));
      }
    });
    const tick = () => {
      const half = track.scrollWidth / 2;
      x -= 0.6 + Math.abs(boost);
      boost *= 0.94;
      if (-x >= half) x += half;
      gsap.set(track, { x });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden border-y border-line py-5" aria-hidden="true">
      <div ref={trackRef} className="flex w-max items-center gap-10 whitespace-nowrap will-change-transform">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className={`font-display text-[clamp(2rem,6vw,4.6rem)] font-extrabold uppercase leading-none ${
                i % 2 ? 'outline-text' : 'text-paper'
              }`}
            >
              {t}
            </span>
            <span className="text-3xl text-mustard">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const display = useCssVar('--font-unbounded');
  const mono = useCssVar('--font-martian');
  const low = useLowPower();
  const touch = useMediaQuery('(pointer: coarse)');
  const staticName = (
    <p className="retro-shadow grid h-full place-items-center font-display text-[16vw] font-black leading-none text-mustard">
      SURYA
    </p>
  );

  return (
    <footer className="relative overflow-hidden bg-ink pt-24">
      <LazyMount className="pointer-events-none absolute inset-0 opacity-50" margin="60% 0px">
        <GradientASCII
          colors={['#3a1a10', '#e4572e', '#f0b429', '#f1e6d0']}
          shape="rise"
          characters=" .:-=+*#%@"
          cellSize={low ? 15 : 14}
          density={0.7}
          glow={0.15}
          flow={0.6}
          speed={0.7}
          grain={0.05}
          gradientOpacity={0.55}
          mouseInteraction
          clickEffect="wave"
          fontFamily={mono || 'monospace'}
          dpr={low ? 1.25 : 1.5}
        />
      </LazyMount>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-transparent" />

      <div className="relative">
        <VelocityMarquee />

        {/* The squishable name runs everywhere: drag it with a mouse or a finger, tap to poke it. */}
        <div className="relative mx-auto h-[max(min(42vw,420px),220px)] w-full max-w-[1400px] px-[var(--gutter)]">
          {display ? (
            <LazyMount className="h-full w-full" margin="60% 0px" fallback={staticName}>
              <ElasticMesh
                text="SURYA"
                fontFamily={display}
                fontWeight={900}
                color="#f0b429"
                material="balloon"
                inflate={1.05}
                stiffness={0.45}
                wobble={0.65}
                shadow={0.6}
                grabRadius={touch ? 56 : 70}
                dpr={low ? 1.25 : 1.5}
                data-cursor="drag"
                data-cursor-label="Squish"
              />
            </LazyMount>
          ) : (
            staticName
          )}
          {touch && (
            <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper-mute">
              drag sideways · tap to poke
            </p>
          )}
        </div>

        {/* Two-column split on phones and tablets (Navigate | Elsewhere, Say hello | Clock), four across on desktop. */}
        <div className="container-x grid grid-cols-2 gap-x-5 gap-y-12 px-[var(--gutter)] py-16 sm:gap-x-12 lg:grid-cols-4">
          <div>
            <p className="eyebrow mb-5">Navigate</p>
            <ul className="space-y-2.5">
              {nav.map(n => (
                <li key={n.href}>
                  <a href={n.href} className="link-underline font-display text-sm uppercase tracking-wide text-paper">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-l border-line pl-5 sm:pl-10 lg:border-l-0 lg:pl-0">
            <p className="eyebrow mb-5">Elsewhere</p>
            <ul className="space-y-2.5">
              {socials.map(s => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 font-display text-sm uppercase tracking-wide text-paper"
                  >
                    <span className="link-underline">{s.label}</span>
                    <ArrowOut size={12} className="text-mustard" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line pt-10 lg:border-t-0 lg:pt-0">
            <p className="eyebrow mb-5">Say hello</p>
            <a href={`mailto:${profile.email}`} className="link-underline block break-all text-sm text-paper sm:text-base">
              {profile.email}
            </a>
            <a href={profile.phoneHref} className="link-underline mt-2 block text-sm text-paper-dim sm:text-base">
              {profile.phone}
            </a>
          </div>
          <div className="border-l border-t border-line pl-5 pt-10 sm:pl-10 lg:border-l-0 lg:border-t-0 lg:pl-0 lg:pt-0">
            <p className="eyebrow mb-5">Tiruppur · IST</p>
            <p className="font-display text-2xl font-bold text-paper sm:text-3xl">
              <Clock />
            </p>
            <p className="mt-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-paper-dim sm:text-xs">Online 9–9</p>
          </div>
        </div>

        <div className="relative z-10 border-t border-line bg-ink/90 backdrop-blur-sm">
        <div className="container-x flex items-center justify-between gap-4 px-[var(--gutter)] py-6 sm:py-8">
          <p className="max-w-[14rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-paper-mute sm:max-w-none sm:text-[11px]">
            © {new Date().getFullYear()} {profile.name} · Built in Tiruppur
          </p>
          <Magnetic>
            <button
              type="button"
              onClick={() => scrollToTarget(0)}
              className="btn btn-ghost shrink-0 whitespace-nowrap !px-4 !py-3 sm:!px-[1.4rem] sm:!py-[0.95rem]"
              aria-label="Back to top"
            >
              Back to top
              <Wiggle>
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </Wiggle>
            </button>
          </Magnetic>
        </div>
        </div>
      </div>
    </footer>
  );
}
