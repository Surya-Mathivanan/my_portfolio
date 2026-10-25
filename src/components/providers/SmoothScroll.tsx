'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { READY_EVENT } from '@/lib/hooks';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const HEADER_OFFSET = -16;

/** Scroll to an in-page target, smoothly when Lenis is running. */
export function scrollToTarget(target: string | HTMLElement | number) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  const lenis = window.__lenis;
  if (lenis) {
    // An open menu pauses Lenis; a deliberate jump (e.g. a menu link) resumes it first.
    if (lenis.isStopped) lenis.start();
    lenis.scrollTo(el as HTMLElement | number, { offset: HEADER_OFFSET, duration: 1.4 });
  }
  else if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' });
  else el.scrollIntoView({ behavior: 'smooth' });
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;

    // Phones: keep pins and scrubs steady while the address bar shows and hides.
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (!reduced) {
      // syncTouch gives touch screens the same eased, inertial scroll as the wheel on desktop.
      lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: true,
        syncTouchLerp: 0.08,
        touchInertiaExponent: 1.6,
        touchMultiplier: 1
      });
      window.__lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      tick = time => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      if (!window.__appReady) lenis.stop();
    }

    const onReady = () => {
      lenis?.start();
      ScrollTrigger.refresh();
    };
    window.addEventListener(READY_EVENT, onReady);

    // Same-page anchors (#id or /#id while on the home page) glide instead of jumping.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as HTMLElement).closest('a');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      const onHome = window.location.pathname === '/' || window.location.pathname === '';
      const hash = href.startsWith('#') ? href : onHome && href.startsWith('/#') ? href.slice(1) : null;
      if (!hash || hash === '#') return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      event.preventDefault();
      scrollToTarget(hash === '#top' ? 0 : el);
      history.replaceState(null, '', hash === '#top' ? '/' : hash);
    };
    document.addEventListener('click', onClick, true);

    // Content that grows or shrinks after load (e.g. "Show more" in Work) moves every section below it, but
    // ScrollTrigger only re-measures on window resize, so pinned sections (Build) would keep stale start/end
    // points. Re-measure once the page height settles at a new value.
    const main = document.querySelector('main') ?? document.body;
    let measured = main.offsetHeight;
    let refreshTimer = 0;
    const onRefresh = () => {
      measured = main.offsetHeight;
    };
    ScrollTrigger.addEventListener('refresh', onRefresh);
    const heightWatch = new ResizeObserver(() => {
      if (Math.abs(main.offsetHeight - measured) < 2) return;
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    });
    heightWatch.observe(main);

    return () => {
      heightWatch.disconnect();
      window.clearTimeout(refreshTimer);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener(READY_EVENT, onReady);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // New page: start at the top (or at the hash) and let ScrollTrigger re-measure.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector<HTMLElement>(hash);
      if (el) requestAnimationFrame(() => scrollToTarget(el));
    } else {
      window.__lenis?.scrollTo(0, { immediate: true });
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
