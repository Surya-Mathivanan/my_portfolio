'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/** Arrow that slips out of its box and a twin slides in on hover — the parent needs `group`. */
export function ArrowOut({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      {[0, 1].map(i => (
        <svg
          key={i}
          viewBox="0 0 16 16"
          width={size}
          height={size}
          className={`absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
            i === 0 ? 'group-hover:translate-x-full group-hover:-translate-y-full' : '-translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0'
          }`}
        >
          <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
        </svg>
      ))}
    </span>
  );
}

/** Wraps any icon so it springs, tilts and wiggles under the pointer. */
export function Wiggle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      className={`inline-flex ${className}`}
      whileHover={{ rotate: [0, -14, 10, -6, 0], scale: 1.18 }}
      whileTap={{ scale: 0.86 }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.span>
  );
}

/** Small looping status dot. */
export function Pulse({ color = 'var(--teal)' }: { color?: string }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5" aria-hidden="true">
      <span className="absolute inset-0 animate-ping rounded-full opacity-60" style={{ background: color }} />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: color }} />
    </span>
  );
}
