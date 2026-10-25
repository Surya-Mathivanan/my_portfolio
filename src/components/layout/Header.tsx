'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StaggeredMenu from '@/components/bits/StaggeredMenu';
import GooeyNav from '@/components/bits/GooeyNav';
import { Pulse } from '@/components/ui/Icons';
import { nav, profile, socials } from '@/content/site';

const QUICK = [
  { label: 'Ventures', href: '/#ventures', id: 'ventures' },
  { label: 'Work', href: '/#work', id: 'work' },
  { label: 'Build', href: '/#build', id: 'build' },
  { label: 'Growth', href: '/#growth', id: 'growth' },
  { label: 'Blog', href: '/blog/', id: 'blog' }
];

/** Monogram that draws itself, with a ring of text that spins faster on hover. */
function Monogram() {
  return (
    <Link href="/" aria-label={`${profile.name} — home`} className="group flex items-center gap-3" data-cursor="link">
      <span className="relative grid h-12 w-12 place-items-center">
        <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full group-hover:[animation-duration:4s]">
          <defs>
            <path id="ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
          </defs>
          <text className="fill-paper-dim font-mono" style={{ fontSize: 10.5, letterSpacing: 3.2 }}>
            <textPath href="#ring">AI ENGINEER ✦ BUILDER ✦ </textPath>
          </text>
        </svg>
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-mustard font-display text-[11px] font-black text-ink shadow-[2px_2px_0_var(--rust)] transition-transform duration-500 group-hover:rotate-[360deg]">
          SM
        </span>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-sm font-bold tracking-tight text-paper">{profile.short}</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
          <Pulse /> Building Zyraa
        </span>
      </span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(-1);
  const progressRef = useRef<HTMLDivElement>(null);

  // Hide while scrolling down, return on the way up; drive the progress line.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 160 && y > last + 2);
        if (y < last - 2 || y < 160) setHidden(false);
        setScrolled(y > 40);
        last = y;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently on screen.
  useEffect(() => {
    if (pathname.startsWith('/blog')) {
      setActive(QUICK.findIndex(q => q.id === 'blog'));
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(QUICK.findIndex(q => q.id === entry.target.id));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    QUICK.forEach(q => {
      const el = document.getElementById(q.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-[55] h-28 bg-gradient-to-b from-ink via-ink/75 to-transparent transition-opacity duration-500 ${
          hidden || !scrolled ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
        <div ref={progressRef} className="h-full origin-left bg-gradient-to-r from-rust via-mustard to-teal" style={{ transform: 'scaleX(0)' }} />
      </div>
      <StaggeredMenu
        isFixed
        position="right"
        items={nav.map(n => ({ label: n.label, ariaLabel: `Go to ${n.label}`, link: n.href }))}
        socialItems={socials.map(s => ({ label: s.label, link: s.href }))}
        displaySocials
        displayItemNumbering
        logo={<Monogram />}
        headerHidden={hidden}
        headerCenter={
          <div className="hidden md:block">
            <GooeyNav
              items={QUICK.map(q => ({ label: q.label, href: q.href }))}
              activeIndex={active < 0 ? undefined : active}
              initialActiveIndex={0}
              onChange={(index: number) => setActive(index)}
              color="#f1e6d0"
              colors={['#f0b429', '#e4572e', '#4fb5a5']}
              size="sm"
              particleCount={12}
              style={{
                '--gn-frame': 'rgba(27, 21, 18, 0.72)',
                '--gn-muted': 'rgba(241, 230, 208, 0.6)',
                '--gn-ink': '#f1e6d0',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '11px'
              } as React.CSSProperties}
            />
          </div>
        }
        menuButtonColor="#f1e6d0"
        openMenuButtonColor="#f1e6d0"
        changeMenuColorOnOpen
        colors={['#f0b429', '#e4572e']}
        accentColor="#f0b429"
      />
    </>
  );
}
