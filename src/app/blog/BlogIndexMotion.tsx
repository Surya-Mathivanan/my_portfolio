'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useAppReady } from '@/lib/hooks';

/** Staggers the post rows in once the page is revealed. */
export default function BlogIndexMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useAppReady();

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-blog-row]', { y: 40, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08 });
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={ref} className="mt-16 border-t" style={{ borderColor: 'var(--line-strong)' }}>
      {children}
    </div>
  );
}
