'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** How far outside the viewport to start mounting. */
  margin?: string;
  /** Keep the child once mounted. Defaults to true, except on very low-memory devices. */
  keep?: boolean;
  /** Shown until the child mounts. */
  fallback?: ReactNode;
};

const idle = (fn: () => void) => {
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: 400 });
  else window.setTimeout(fn, 60);
};

// Only genuinely low-memory devices give GPU memory back; everywhere else effects stay warm,
// so they never blink out or replay their intro when you scroll back.
function lowMemoryDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.deviceMemory ?? 8) <= 2;
}

/**
 * Mounts heavy WebGL children ahead of the viewport during idle time, so shader compilation
 * doesn't land on a scroll frame. Very low-memory devices release them again when far away.
 */
export default function LazyMount({ children, className, margin = '120% 0px', keep, fallback }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const persist = keep ?? !lowMemoryDevice();
    let timer = 0;
    let want = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        want = entry.isIntersecting;
        if (want) idle(() => want && setMounted(true));
        else if (!persist) timer = window.setTimeout(() => setMounted(false), 1500);
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [margin, keep]);

  return (
    <div ref={ref} className={className}>
      {mounted ? children : (fallback ?? null)}
    </div>
  );
}
