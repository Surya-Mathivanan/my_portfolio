'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useAnimationControls } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TrueFocus from '@/components/bits/TrueFocus';
import Magnetic from '@/components/ui/Magnetic';
import { ArrowOut, Pulse } from '@/components/ui/Icons';
import { profile } from '@/content/site';
import { useAppReady, useCssVar, useLowPower, useMediaQuery } from '@/lib/hooks';

gsap.registerPlugin(ScrollTrigger);

const GradientASCII = dynamic(() => import('@/components/bits/GradientASCII'), { ssr: false });
const DitherVeil = dynamic(() => import('@/components/bits/DitherVeil'), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ready = useAppReady();
  const low = useLowPower();
  const touch = useMediaQuery('(pointer: coarse)');
  const mono = useCssVar('--font-martian');
  const rootRef = useRef<HTMLElement>(null);
  const [veil, setVeil] = useState(false);

  // Start the photo effect once the page is revealed so the loader never competes with it.
  useEffect(() => {
    if (ready) setVeil(true);
  }, [ready]);

  // Scroll-out parallax: name rises faster, portrait drifts and the backdrop fades.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true }
      });
      tl.to('[data-hero-name]', { yPercent: -35, ease: 'none' }, 0)
        .to('[data-hero-photo]', { yPercent: 14, rotate: 2, ease: 'none' }, 0)
        .to('[data-hero-bg]', { opacity: 0.25, ease: 'none' }, 0);
    }, root);
    return () => ctx.revert();
  }, []);

  // Touch screens have no hover, so the name ripples on its own every few seconds.
  const wave = useAnimationControls();
  useEffect(() => {
    if (!ready || !touch || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const run = () =>
      wave.start(i => ({
        y: [0, -18, 0],
        color: ['#f1e6d0', '#f0b429', '#f1e6d0'],
        transition: { duration: 0.75, delay: i * 0.08, ease: 'easeInOut' }
      }));
    const first = window.setTimeout(run, 1900);
    const loop = window.setInterval(run, 5200);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
    };
  }, [ready, touch, wave]);

  const letters = 'SURYA'.split('');

  return (
    <section ref={rootRef} id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-32">
      <div data-hero-bg className="absolute inset-0">
        {ready && (
        <GradientASCII
          colors={['#2a130c', '#e4572e', '#f0b429', '#f1e6d0']}
          shape="horizon"
          characters=" .:-=+*xX#@"
          cellSize={low ? 16 : 15}
          density={0.75}
          glyphOpacity={0.8}
          glow={low ? 0.12 : 0.18}
          flow={0.55}
          speed={0.8}
          grain={0.06}
          gradientOpacity={0.75}
          scrambleRadius={touch ? 0.14 : 0.09}
          mouseInteraction
          clickEffect="wave"
          fontFamily={mono || 'monospace'}
          dpr={low ? 1.25 : 1.5}
          intro
        />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_0%,rgba(18,14,12,0.55)_55%,var(--ink)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent" />

      <div className="container-x relative grid items-center gap-16 px-[var(--gutter)] lg:grid-cols-12 lg:gap-10">
        {/* The name column is a size container, so "SURYA" always fits beside the portrait. */}
        <div data-hero-name className="min-w-0 [container-type:inline-size] lg:col-span-7">
          <motion.p
            className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
          >
            <Pulse />
            <span className="text-paper">{profile.role}</span>
            <span className="text-mustard">@</span>
            <span>{profile.company}</span>
            <span className="hidden sm:inline">· {profile.location}</span>
          </motion.p>

          <h1 className="mt-6 select-none" aria-label={profile.name}>
            <span className="flex font-display text-[clamp(4.2rem,21cqw,12rem)] font-black leading-[0.82] tracking-[-0.04em] text-paper">
              {letters.map((l, i) => (
                // Clip only the bottom edge: letters rise out of it, and can still jump above it.
                <span key={i} className="inline-block pb-[0.08em] [clip-path:inset(-60%_-20%_0_-20%)]">
                  <motion.span className="inline-block" animate={wave} custom={i}>
                    <motion.span
                      className="retro-shadow inline-block"
                      initial={{ y: '115%', rotate: 8 }}
                      animate={ready ? { y: '0%', rotate: 0 } : {}}
                      transition={{ duration: 1.1, ease, delay: 0.2 + i * 0.07 }}
                      whileHover={{ y: -12, color: 'var(--mustard)', transition: { duration: 0.25 } }}
                      whileTap={{ y: -16, scale: 0.9, color: 'var(--mustard)', transition: { duration: 0.2 } }}
                    >
                      {l}
                    </motion.span>
                  </motion.span>
                </span>
              ))}
            </span>
            <motion.span
              className="mt-1 block font-serif text-[clamp(2.2rem,7vw,5.4rem)] font-light italic leading-none text-mustard"
              initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
              animate={ready ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 1.1, ease, delay: 0.65 }}
            >
              Mathivanan
            </motion.span>
          </h1>

          <motion.p
            className="justify mt-8 max-w-[34rem] text-[1.05rem] leading-relaxed text-paper-dim sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 0.85 }}
          >
            <span className="text-paper">{profile.tagline}</span> {profile.intro}
          </motion.p>

          <motion.div
            className="hero-focus mt-8 max-w-[34rem]"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 1.05 }}
          >
            <TrueFocus
              sentence="Plan Build Ship Repeat"
              blurAmount={3.5}
              borderColor="#f0b429"
              glowColor="rgba(240,180,41,0.5)"
              animationDuration={0.55}
              pauseBetweenAnimations={0.9}
              cornerSize={12}
              borderWidth={2}
              unfocusedOpacity={0.55}
            />
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 1.15 }}
          >
            <Magnetic>
              <a href="#ventures" className="btn btn-primary group">
                Meet Zyraa <ArrowOut size={14} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="https://github.com/Surya-Mathivanan" target="_blank" rel="noopener noreferrer" className="btn btn-ghost group">
                GitHub <ArrowOut size={14} />
              </a>
            </Magnetic>
            <Link href={profile.resume} className="link-underline font-mono text-xs uppercase tracking-[0.14em] text-paper-dim">
              Résumé →
            </Link>
          </motion.div>
        </div>

        <motion.div
          data-hero-photo
          className="relative mx-auto w-[min(78vw,420px)] lg:col-span-5 lg:w-full lg:max-w-[400px] lg:justify-self-end"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={ready ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.35 }}
        >
          <div
            className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[28px] border-2 border-paper/80 bg-ink-2 shadow-[12px_12px_0_var(--rust)]"
            data-cursor="view"
            data-cursor-label="Reveal"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/profile-portrait.webp"
              alt={profile.name}
              className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_sepia(.35)_contrast(1.15)]"
              width={840}
              height={1116}
              fetchPriority="high"
            />
            {veil && (
              <div className="absolute inset-0">
                <DitherVeil
                  src="/images/profile-portrait.webp"
                  fit="cover"
                  pattern="floyd"
                  pixelSize={2}
                  inkColor="#120e0c"
                  paperColor="#f1e6d0"
                  contrast={1.05}
                  brightness={0.2}
                  revealRadius={touch ? 125 : 150}
                  softness={0.7}
                  linger={1.3}
                  rimColor="#f0b429"
                  rim={0.22}
                  wander
                />
              </div>
            )}
          </div>

          <motion.div
            className="absolute -right-3 -top-4 rotate-6 rounded-2xl border border-ink bg-mustard px-4 py-3 text-ink shadow-[4px_4px_0_var(--ink)] sm:-right-8"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <p className="font-display text-2xl font-black leading-none">5 mo</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em]">in production</p>
          </motion.div>
          <p className="eyebrow mt-8 text-center">hover · tap the portrait</p>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        aria-label="Scroll to about"
      >
        <span className="eyebrow">scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute left-0 top-0 h-1/2 w-px bg-mustard"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>

      <style>{`
        .hero-focus .focus-container { justify-content: flex-start; gap: .9em; }
        .hero-focus .focus-word {
          font-family: var(--font-display); font-size: clamp(1rem, 2.3vw, 1.45rem); font-weight: 800;
          letter-spacing: .02em; text-transform: uppercase; color: var(--paper);
        }
      `}</style>
    </section>
  );
}
