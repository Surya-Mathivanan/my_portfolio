'use client';

import { useEffect, useRef } from 'react';

type Mode = 'default' | 'link' | 'view' | 'drag' | 'text' | 'hidden';

const BURST = ['#f0b429', '#e4572e', '#4fb5a5', '#f1e6d0'];

// Icon outlines, drawn on a 32px grid. Each icon is placed so its hotspot sits on the pointer.
const ARROW = 'M3 2v23l6.5-6 4 9.5 4-1.7-3.9-9.3h8.9z';
const POINT =
  'M9 18V4a2.5 2.5 0 0 1 5 0v9a2.25 2.25 0 0 1 4.5 0v1a2.25 2.25 0 0 1 4.5 0v1.5a2 2 0 0 1 4 0V22c0 4.4-3.1 8-7.5 8H15c-2.4 0-4.3-1.1-5.7-3l-4.9-6.6c-1-1.4-.7-3.2.7-3.9 1.3-.7 2.8-.3 3.7.9z';
const GRAB =
  'M8 19V8a2 2 0 0 1 4 0V5.5a2 2 0 0 1 4 0V7a2 2 0 0 1 4 0v4a1.75 1.75 0 0 1 3.5 0v10c0 4.7-3.4 8.5-8 8.5H14c-2.4 0-4.3-1-5.8-2.9l-4.6-6.3c-.9-1.3-.6-3 .7-3.7 1.2-.7 2.7-.4 3.6.7z';

function Icon({ name, hx, hy, children }: { name: string; hx: number; hy: number; children: React.ReactNode }) {
  return (
    <svg
      className={`cur-icon cur-${name}`}
      viewBox="0 0 32 32"
      width={32}
      height={32}
      style={{ left: -hx, top: -hy, transformOrigin: `${hx}px ${hy}px` }}
    >
      {children}
    </svg>
  );
}

/**
 * Icon cursor that tracks the pointer exactly and changes shape with context:
 * a retro arrow by default, a pointing hand on links, an open hand to drag, a pencil in text fields.
 * Elements opt into states with data-cursor="link|view|drag|text|hidden" and data-cursor-label.
 */
export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const burstsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const root = rootRef.current;
    const tiltEl = tiltRef.current;
    const tag = tagRef.current;
    const label = labelRef.current;
    const bursts = burstsRef.current;
    if (!fine || !root || !tiltEl || !tag || !label || !bursts) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('has-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...pos };
    let lastX = pos.x;
    let tilt = 0;
    let mode: Mode = 'default';
    let visible = false;
    let raf = 0;

    const setMode = (next: Mode, text = '') => {
      if (next === mode && label.textContent === text) return;
      mode = next;
      root.dataset.mode = next;
      tag.dataset.mode = next;
      label.textContent = text;
      tag.classList.toggle('is-on', !!text && next !== 'default' && next !== 'text' && next !== 'hidden');
    };

    const loop = () => {
      raf = 0;
      // Lean into the direction of travel, like the icon is being dragged, then settle upright.
      const vx = pos.x - lastX;
      lastX = pos.x;
      const target = reduced ? 0 : Math.max(-14, Math.min(14, vx * 0.8));
      tilt += (target - tilt) * 0.18;
      const k = reduced ? 1 : 0.2;
      trail.x += (pos.x - trail.x) * k;
      trail.y += (pos.y - trail.y) * k;
      root.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      tiltEl.style.transform = `rotate(${tilt.toFixed(2)}deg)`;
      tag.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
      if (target !== 0 || Math.abs(tilt) > 0.05 || Math.abs(pos.x - trail.x) > 0.1 || Math.abs(pos.y - trail.y) > 0.1) {
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        trail.x = lastX = pos.x;
        trail.y = pos.y;
        root.style.opacity = '1';
        tag.style.opacity = '1';
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest<HTMLElement>(
        'a, button, input, textarea, select, label, [role="button"], [contenteditable="true"], object, iframe, canvas'
      );
      if (el?.matches('textarea, [contenteditable="true"], input:not([type="checkbox"], [type="radio"], [type="range"], [type="submit"], [type="button"])')) {
        return setMode('text');
      }
      // A tagged region wins over the links and canvases inside it, so a card keeps its colour and label.
      const tagged = target.closest<HTMLElement>('[data-cursor]');
      if (tagged) return setMode(tagged.dataset.cursor as Mode, tagged.dataset.cursorLabel ?? '');
      if (!el) return setMode('default');
      // Embedded documents draw their own cursor.
      if (el.matches('object, iframe')) return setMode('hidden');
      if (el.matches('canvas')) return setMode('default');
      setMode('link');
    };

    const onDown = (e: PointerEvent) => {
      root.classList.add('is-pressed');
      if (reduced) return;
      // A small comic "pop" of sparks where you click.
      const b = document.createElement('div');
      b.className = 'cur-burst';
      b.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      for (let i = 0; i < 8; i++) {
        const s = document.createElement('i');
        s.style.setProperty('--a', `${i * 45 + 22.5}deg`);
        s.style.background = BURST[i % BURST.length];
        b.appendChild(s);
      }
      bursts.appendChild(b);
      window.setTimeout(() => b.remove(), 600);
    };
    const onUp = () => root.classList.remove('is-pressed');
    const onLeave = () => {
      visible = false;
      root.style.opacity = '0';
      tag.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <>
      <div ref={burstsRef} className="cur-bursts" aria-hidden="true" />
      <div ref={tagRef} className="cur-tag" data-mode="default" aria-hidden="true">
        <span ref={labelRef} className="cur-pill" />
      </div>
      <div ref={rootRef} className="cur" data-mode="default" aria-hidden="true">
        <div ref={tiltRef} className="cur-tilt">
          <div className="cur-press">
            <Icon name="arrow" hx={3} hy={2}>
              <path d={ARROW} transform="translate(2.2 2.2)" className="cur-shadow" />
              <path d={ARROW} className="cur-fill" />
            </Icon>
            <Icon name="point" hx={11.5} hy={1.5}>
              <g className="cur-anim">
                <path d={POINT} transform="translate(2 2)" className="cur-shadow" />
                <path d={POINT} className="cur-fill" />
                <path d="M14 13v4M18.5 14v3.5M23 15.5v3" className="cur-line" />
              </g>
            </Icon>
            <Icon name="grab" hx={15} hy={16}>
              <g className="cur-anim">
                <path d={GRAB} transform="translate(2 2)" className="cur-shadow" />
                <path d={GRAB} className="cur-fill" />
                <path d="M12 8v7M16 7v8M20 11v4.5" className="cur-line" />
              </g>
            </Icon>
            <Icon name="pencil" hx={6.8} hy={25.2}>
              <g className="cur-anim">
                <g transform="rotate(-45 16 16)">
                  <path d="M3 16l6-3.5h20v7H9z" transform="translate(1.6 1.6)" className="cur-shadow" />
                  <path d="M3 16l6-3.5v7z" fill="#f1e6d0" />
                  <path d="M3 16l2.4-1.4v2.8z" fill="#120e0c" />
                  <rect x="9" y="12.5" width="14" height="7" fill="#f0b429" />
                  <path d="M9 14.8h14M9 17.2h14" stroke="#c98f12" strokeWidth="1" />
                  <rect x="23" y="12.5" width="2.6" height="7" fill="#b8aa93" />
                  <path d="M24.3 12.5v7" stroke="#7d7262" strokeWidth="0.8" />
                  <path d="M25.6 12.5H27.4a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6H25.6z" fill="#c46f9c" />
                  <path d="M3 16l6-3.5h18.4a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6H9z" className="cur-outline" />
                </g>
              </g>
            </Icon>
          </div>
        </div>
      </div>
      <style>{`
        .cur, .cur-tag, .cur-bursts { position: fixed; top: 0; left: 0; z-index: 120; pointer-events: none; }
        .cur, .cur-tag { opacity: 0; transition: opacity .25s ease; }
        @media (pointer: coarse) { .cur, .cur-tag, .cur-bursts { display: none; } }
        .cur, .cur-tilt, .cur-press { width: 0; height: 0; }
        .cur-tilt, .cur-press { position: absolute; left: 0; top: 0; }
        .cur-press { transition: transform .3s cubic-bezier(.34,1.56,.64,1); }
        .cur.is-pressed .cur-press { transform: scale(.8); }
        .cur.is-pressed[data-mode='text'] .cur-press { transform: rotate(-10deg) scale(.92); }

        /* Each mode has its own colour; the shadow is the retro offset print. */
        .cur { --c: var(--paper); --s: var(--rust); }
        .cur[data-mode='link'] { --c: var(--mustard); --s: var(--rust); }
        .cur[data-mode='view'] { --c: var(--teal); --s: var(--plum); }
        .cur[data-mode='drag'] { --c: var(--rust); --s: var(--mustard); }
        .cur-fill { fill: var(--c); stroke: var(--ink); stroke-width: 1.6; stroke-linejoin: round; transition: fill .3s ease; }
        .cur-shadow { fill: var(--s); transition: fill .3s ease; }
        .cur-line { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linecap: round; }
        .cur-outline { fill: none; stroke: var(--ink); stroke-width: 1.4; stroke-linejoin: round; }

        /* Shapes swap with a springy pop. */
        .cur-icon {
          position: absolute; overflow: visible; opacity: 0; transform: scale(.3) rotate(-30deg);
          transition: opacity .16s ease, transform .42s cubic-bezier(.34,1.56,.64,1);
        }
        .cur[data-mode='default'] .cur-arrow,
        .cur[data-mode='link'] .cur-point,
        .cur[data-mode='view'] .cur-point,
        .cur[data-mode='drag'] .cur-grab,
        .cur[data-mode='text'] .cur-pencil { opacity: 1; transform: none; }

        /* Idle motion: the finger taps, the open hand waves "drag me", the pencil scribbles. */
        .cur-anim { transform-box: fill-box; }
        .cur[data-mode='link'] .cur-point .cur-anim,
        .cur[data-mode='view'] .cur-point .cur-anim { animation: cur-tap 1.1s ease-in-out infinite; transform-origin: 50% 0; }
        .cur[data-mode='drag'] .cur-grab .cur-anim { animation: cur-wave 1.4s ease-in-out infinite; transform-origin: 50% 100%; }
        .cur[data-mode='drag'].is-pressed .cur-grab .cur-anim { animation: none; transform: scaleY(.86); }
        .cur[data-mode='text'] .cur-pencil .cur-anim { animation: cur-scribble .9s ease-in-out infinite; transform-origin: 0 100%; }
        @keyframes cur-tap { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(2.5px) scale(.96); } }
        @keyframes cur-wave { 0%, 100% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } }
        @keyframes cur-scribble { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(-6deg); } 65% { transform: rotate(4deg); } }

        /* Label chip that trails the pointer for "Open", "Drag", "Read"… */
        .cur-tag { width: 0; height: 0; }
        .cur-pill {
          position: absolute; left: 22px; top: 26px; padding: 4px 9px; border-radius: 999px; white-space: nowrap;
          font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
          color: var(--ink); background: var(--mustard); border: 1.5px solid var(--ink); box-shadow: 2px 2px 0 var(--ink);
          opacity: 0; transform: scale(.4) rotate(-8deg); transform-origin: 0 0;
          transition: opacity .2s ease, transform .4s cubic-bezier(.34,1.56,.64,1), background-color .3s ease;
        }
        .cur-tag[data-mode='view'] .cur-pill { background: var(--teal); }
        .cur-tag[data-mode='drag'] .cur-pill { background: var(--rust); color: var(--paper); }
        .cur-tag[data-mode='drag'] .cur-pill::before { content: '\\2039  '; }
        .cur-tag[data-mode='drag'] .cur-pill::after { content: '  \\203A'; }
        .cur-tag.is-on .cur-pill { opacity: 1; transform: none; }

        .cur-burst { position: absolute; left: 0; top: 0; }
        .cur-burst i {
          position: absolute; left: -1.5px; top: -5px; width: 3px; height: 10px; border-radius: 2px;
          transform: rotate(var(--a)) translateY(-7px) scaleY(.4);
          animation: cur-burst .5s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes cur-burst { to { transform: rotate(var(--a)) translateY(-24px) scaleY(1); opacity: 0; } }
      `}</style>
    </>
  );
}
