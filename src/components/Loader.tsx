'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { markAppReady } from '@/lib/hooks';

const PHOTO = '/images/portrait-full-sm.webp';
const CRITICAL_IMAGES = [PHOTO, '/images/profile-portrait.webp'];
const MIN_MS = 1300;
const MIN_MS_REPEAT = 450;
const MAX_MS = 4500;
const COLUMNS = 6;

const loadImage = (src: string) =>
  new Promise<void>(resolve => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

/**
 * Retro boot screen. Progress follows real work (fonts, hero images, window load),
 * the full portrait sharpens from chunky pixels as it fills, then the screen lifts in columns.
 */
export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('surya-booted') === '1';
      sessionStorage.setItem('surya-booted', '1');
    } catch {}
    const minMs = seen || reduced ? MIN_MS_REPEAT : MIN_MS;

    const avatar = new Image();
    avatar.src = PHOTO;

    let done = 0;
    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      ...CRITICAL_IMAGES.map(loadImage),
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }))
    ];
    tasks.forEach(task => task.then(() => (done += 1)));

    const start = performance.now();
    let last = start;
    let shown = 0;
    let raf = 0;
    let finished = false;

    // Draw the whole photo small, then scale it back up unsmoothed: chunky pixels that sharpen with progress.
    const drawAvatar = (p: number) => {
      if (!ctx || !avatar.complete || !avatar.naturalWidth) return;
      const { width: w, height: h } = canvas;
      const cw = Math.max(6, Math.round(6 + (w - 6) * p * p));
      const ch = Math.max(8, Math.round((cw * h) / w));
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(avatar, 0, 0, cw, ch);
      ctx.drawImage(canvas, 0, 0, cw, ch, 0, 0, w, h);
    };

    const exit = () => {
      finished = true;
      document.body.dataset.loading = 'false';
      if (reduced) {
        markAppReady();
        setGone(true);
        return;
      }
      const tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.to(root.querySelectorAll('[data-loader-fade]'), {
        y: -24,
        opacity: 0,
        duration: 0.45,
        ease: 'power3.in',
        stagger: 0.05
      })
        .add(() => markAppReady(), '-=0.05')
        .to(
          root.querySelectorAll('[data-loader-col]'),
          { yPercent: -100, duration: 0.9, ease: 'power4.inOut', stagger: { each: 0.06, from: 'center' } },
          '<'
        );
    };

    const frame = (now: number) => {
      const elapsed = now - start;
      const real = elapsed > MAX_MS ? 1 : done / tasks.length;
      const pace = Math.min(1, elapsed / minMs);
      const target = Math.min(real, pace);
      // Time-based easing, so a slow GPU or a busy main thread never stretches the boot screen.
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      shown += (target - shown) * (1 - Math.exp(-dt / 0.16));
      if (target === 1 && shown > 0.995) shown = 1;
      const pct = Math.round(shown * 100);
      if (countRef.current) countRef.current.textContent = String(pct).padStart(3, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;
      drawAvatar(shown);
      if (shown >= 1) {
        exit();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (!finished) document.body.dataset.loading = 'false';
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      id="loader"
      className="fixed inset-0 z-[100] flex items-center justify-center"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="absolute inset-0 flex" aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <div key={i} data-loader-col className="h-full flex-1 bg-ink" style={{ marginLeft: i ? -1 : 0 }} />
        ))}
      </div>
      {/* scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{ background: 'repeating-linear-gradient(0deg, #f1e6d0 0 1px, transparent 1px 4px)' }}
      />
      <div className="relative flex flex-col items-center gap-7 px-6 text-center">
        {/* Full portrait in an arched frame, matching the hero photo (canvas keeps the photo's 1259:1599 shape). */}
        <div data-loader-fade className="relative aspect-[1259/1599] w-28 sm:w-32">
          <canvas
            ref={canvasRef}
            width={128}
            height={163}
            className="h-full w-full rounded-b-[16px] rounded-t-[999px] border-2 border-mustard bg-ink-2 shadow-[6px_6px_0_var(--rust)]"
            style={{ filter: 'sepia(0.25) contrast(1.08)', imageRendering: 'pixelated' }}
          />
          <span className="absolute -right-1.5 bottom-3 h-3.5 w-3.5 rounded-full border-2 border-ink bg-teal" />
        </div>
        <span
          ref={countRef}
          data-loader-fade
          className="retro-shadow font-display text-7xl font-black tabular-nums leading-none text-paper sm:text-8xl"
        >
          000
        </span>
        <div data-loader-fade className="w-56 sm:w-72">
          <div className="h-[3px] w-full overflow-hidden rounded bg-ink-3">
            <div ref={barRef} className="h-full origin-left bg-mustard" style={{ transform: 'scaleX(0)' }} />
          </div>
          <p className="eyebrow mt-4">
            booting surya.os<span className="animate-blink text-mustard">_</span>
          </p>
        </div>
      </div>
    </div>
  );
}
