'use client';

import { useEffect, useRef } from 'react';

/** Thin side rail on the left edge that fills as the article is read. */
export default function ReadingProgress({ color }: { color: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleY(${max > 0 ? window.scrollY / max : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[65] h-full w-[3px]">
      <div ref={ref} className="h-full w-full origin-top" style={{ background: color, transform: 'scaleY(0)' }} />
    </div>
  );
}
