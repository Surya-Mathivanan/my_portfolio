'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { SiDjango, SiFlask, SiGit, SiGooglegemini, SiPostgresql, SiPython, SiReact } from 'react-icons/si';
import { markAppReady } from '@/lib/hooks';

const PHOTO = '/images/portrait-full-sm.webp';
const CRITICAL_IMAGES = [PHOTO, '/images/profile-portrait.webp'];
const MIN_MS = 1600;
const MIN_MS_REPEAT = 500;
const MAX_MS = 4500;

// The same orbit as the About section. `order` is when each planet docks while loading.
type Planet = { node: ReactNode; label: string; order: number };
const INNER: Planet[] = [
  { node: <SiPython />, label: 'Python', order: 0 },
  { node: <SiReact />, label: 'React', order: 2 },
  { node: <SiDjango />, label: 'Django', order: 4 }
];
const OUTER: Planet[] = [
  { node: <SiGooglegemini />, label: 'Gemini', order: 1 },
  { node: <SiPostgresql />, label: 'Postgres', order: 3 },
  { node: <SiGit />, label: 'Git', order: 5 },
  { node: <SiFlask />, label: 'Flask', order: 6 }
];
const PLANETS = INNER.length + OUTER.length;

const STATUS: [number, string][] = [
  [0, 'Warming up the build loop'],
  [25, 'Loading the factory floor'],
  [50, 'Syncing GitHub commits'],
  [75, 'Polishing pixels'],
  [100, 'Ready — let’s build']
];

const loadImage = (src: string) =>
  new Promise<void>(resolve => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

function Ring({ planets, size, seconds, reverse = false, offset = 0 }: { planets: Planet[]; size: string; seconds: number; reverse?: boolean; offset?: number }) {
  const spin = { animation: `spin-slow ${seconds}s linear infinite${reverse ? ' reverse' : ''}` };
  const counter = { animation: `spin-slow ${seconds}s linear infinite${reverse ? '' : ' reverse'}` };
  return (
    <div data-loader-ring className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: 'rgba(241,230,208,.16)' }} />
      <div className="absolute inset-0" style={spin}>
        {planets.map((p, i) => {
          const a = ((360 / planets.length) * i + offset) * (Math.PI / 180);
          // Rounded so the server HTML and the client render the same style string.
          const left = Math.round((50 + 50 * Math.sin(a)) * 1000) / 1000;
          const top = Math.round((50 - 50 * Math.cos(a)) * 1000) / 1000;
          return (
            <div key={p.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
              <div style={counter}>
                <div data-planet={p.order} className="ld-planet flex flex-col items-center gap-1">
                  <span className="ld-planet-icon relative grid h-9 w-9 place-items-center rounded-full border bg-ink-2 text-base text-paper shadow-[3px_3px_0_var(--ink)] sm:h-11 sm:w-11 sm:text-lg">
                    {p.node}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-paper-dim sm:text-[9px]">{p.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Boot screen in the About orbit's language: the portrait sits on a striped synthwave sun inside a progress ring,
 * tech planets dock one by one as real work finishes (fonts, hero images, window load), then the screen irises
 * out onto the face to reveal the site.
 */
export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const photoWrap = photoWrapRef.current;
    if (!root || !photoWrap) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('surya-booted') === '1';
      sessionStorage.setItem('surya-booted', '1');
    } catch {}
    const minMs = seen || reduced ? MIN_MS_REPEAT : MIN_MS;

    // Fade the portrait in once it has decoded (it may already be cached from the preload).
    const photo = photoRef.current;
    const showPhoto = () => photo && (photo.style.opacity = '1');
    if (photo?.complete && photo.naturalWidth) showPhoto();
    else photo?.addEventListener('load', showPhoto, { once: true });

    const planets = [...root.querySelectorAll<HTMLElement>('[data-planet]')].sort(
      (a, b) => Number(a.dataset.planet) - Number(b.dataset.planet)
    );

    let done = 0;
    const tasks: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      ...CRITICAL_IMAGES.map(loadImage),
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>(resolve => window.addEventListener('load', () => resolve(), { once: true }))
    ];
    tasks.forEach(task => task.then(() => (done += 1)));

    // The clock starts on the first frame: a rAF timestamp can predate this effect after a slow hydration,
    // and a negative elapsed/dt would make the easing overshoot (and end the boot screen instantly).
    let start = -1;
    let last = 0;
    let shown = 0;
    let docked = 0;
    let status = -1;
    let raf = 0;
    let finished = false;
    let tl: gsap.core.Timeline | undefined;

    const exit = () => {
      finished = true;
      document.body.dataset.loading = 'false';
      if (reduced) {
        markAppReady();
        setGone(true);
        return;
      }
      // Iris out: the screen closes onto the portrait, holds a beat, then shuts to reveal the site.
      const r = photoWrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const iris = { r: Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) };
      const setIris = () => (root.style.clipPath = `circle(${iris.r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`);
      setIris();
      tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.to(root.querySelectorAll('[data-loader-fade]'), { y: 14, opacity: 0, duration: 0.35, ease: 'power2.in', stagger: 0.04 })
        .to(root.querySelectorAll('[data-loader-ring]'), { scale: 1.3, opacity: 0, duration: 0.5, ease: 'power3.in', stagger: 0.06 }, '<')
        .to(iris, { r: r.width / 2 + 3, duration: 0.75, ease: 'power3.inOut', onUpdate: setIris }, '-=0.2')
        .add(() => markAppReady(), '-=0.3')
        .to(photoWrap, { scale: 0.9, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
        .to(iris, { r: 0, duration: 0.42, ease: 'power3.in', onUpdate: setIris }, '-=0.32');
    };

    const frame = (now: number) => {
      if (start < 0) start = last = now;
      const elapsed = Math.max(0, now - start);
      const real = elapsed > MAX_MS ? 1 : done / tasks.length;
      const pace = Math.min(1, elapsed / minMs);
      const target = Math.min(real, pace);
      // Time-based easing, so a slow GPU or a busy main thread never stretches the boot screen.
      const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
      last = now;
      shown = Math.min(1, Math.max(shown, shown + (target - shown) * (1 - Math.exp(-dt / 0.16))));
      if (target === 1 && shown > 0.995) shown = 1;
      const pct = Math.round(shown * 100);

      if (countRef.current) countRef.current.textContent = String(pct).padStart(2, '0');
      if (arcRef.current) {
        arcRef.current.style.strokeDasharray = `${shown.toFixed(4)} 1`;
        arcRef.current.style.opacity = shown > 0.01 ? '1' : '0';
      }
      if (headRef.current) headRef.current.style.transform = `rotate(${(shown * 360).toFixed(2)}deg)`;
      while (docked < planets.length && shown >= (docked + 1) / (PLANETS + 1)) planets[docked++].setAttribute('data-on', '');
      let s = 0;
      while (s + 1 < STATUS.length && pct >= STATUS[s + 1][0]) s += 1;
      if (s !== status && statusRef.current) {
        status = s;
        statusRef.current.textContent = STATUS[s][1];
      }

      if (shown >= 1) {
        exit();
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      tl?.kill();
      photo?.removeEventListener('load', showPhoto);
      if (!finished) document.body.dataset.loading = 'false';
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} id="loader" className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-ink" aria-live="polite" aria-label="Loading">
      {/* Synthwave grid floor rolling toward you */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]">
        <div className="absolute inset-0 overflow-hidden [perspective:380px]">
          <div className="absolute inset-x-[-60%] bottom-[-30%] h-[150%] origin-bottom [transform:rotateX(64deg)]">
            <div className="ld-grid absolute inset-x-0 -top-14 bottom-0" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-transparent" />
      </div>
      {/* scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ background: 'repeating-linear-gradient(0deg, #f1e6d0 0 1px, transparent 1px 4px)' }}
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative aspect-square w-[min(84vw,56svh,420px)]" aria-hidden="true">
          <Ring planets={OUTER} size="100%" seconds={40} reverse offset={45} />
          <Ring planets={INNER} size="70%" seconds={26} />

          {/* progress ring with a glowing head */}
          <div data-loader-ring className="absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="ld-arc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f0b429" />
                  <stop offset="55%" stopColor="#e4572e" />
                  <stop offset="100%" stopColor="#c46f9c" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="47" fill="none" stroke="var(--ink-3)" strokeWidth="2.5" />
              <circle
                ref={arcRef}
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="url(#ld-arc)"
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength={1}
                style={{ strokeDasharray: '0 1', opacity: 0 }}
              />
            </svg>
            <div ref={headRef} className="absolute inset-0">
              <span className="absolute left-1/2 top-[1.5%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal shadow-[0_0_14px_3px_rgba(79,181,165,.7)]" />
            </div>
          </div>

          {/* the striped sun setting behind the portrait */}
          <div className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-[44%] rounded-full bg-mustard/25 blur-2xl" />
          <div className="ld-sun absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-[44%] overflow-hidden rounded-full">
            <div className="ld-sun-stripes absolute inset-x-0 bottom-0 h-1/2" />
          </div>
          <div
            ref={photoWrapRef}
            className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-2 border-mustard shadow-[4px_4px_0_var(--rust)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={photoRef} src={PHOTO} alt="" width={300} height={381} decoding="async" className="h-full w-full object-cover object-top opacity-0 transition-opacity duration-500" />
          </div>
        </div>

        <p data-loader-fade className="-mt-1 flex items-baseline font-display font-black leading-none text-paper">
          <span ref={countRef} className="retro-shadow text-6xl tabular-nums sm:text-7xl">
            00
          </span>
          <span className="ml-1 text-2xl text-mustard sm:text-3xl">%</span>
        </p>
        <p data-loader-fade className="eyebrow mt-4">
          <span ref={statusRef}>{STATUS[0][1]}</span>
          <span className="animate-blink text-mustard">_</span>
        </p>
      </div>

      <style>{`
        .ld-grid {
          background-image:
            linear-gradient(rgba(240,180,41,.5) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(228,87,46,.42) 1.5px, transparent 1.5px);
          background-size: 56px 56px;
          animation: ld-grid-run 1.2s linear infinite;
        }
        @keyframes ld-grid-run { from { transform: translateY(0); } to { transform: translateY(56px); } }
        .ld-sun { background: linear-gradient(to bottom, #f0b429 0%, #e4572e 58%, #9b4f78 100%); }
        .ld-sun-stripes {
          background: repeating-linear-gradient(to bottom, transparent 0 7px, var(--ink) 7px 11px);
          animation: ld-sun-stripes 2.4s linear infinite;
        }
        @keyframes ld-sun-stripes { to { background-position: 0 11px; } }

        /* Planets dock with a springy pop and a ping ring. */
        .ld-planet { opacity: 0; transform: scale(0); transition: opacity .25s ease, transform .55s cubic-bezier(.34,1.56,.64,1); }
        .ld-planet[data-on] { opacity: 1; transform: none; }
        .ld-planet-icon { border-color: var(--line-strong); }
        .ld-planet[data-on] .ld-planet-icon { border-color: var(--mustard); color: var(--mustard); transition: border-color .4s ease .5s, color .4s ease .5s; }
        .ld-planet[data-on] .ld-planet-icon::after {
          content: ''; position: absolute; inset: -2px; border-radius: 999px; border: 2px solid var(--mustard);
          animation: ld-ping .8s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes ld-ping { from { transform: scale(1); opacity: .9; } to { transform: scale(2); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { #loader *, #loader *::after { animation: none !important; } }
      `}</style>
    </div>
  );
}
