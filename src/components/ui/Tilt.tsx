'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

/** A card that leans toward the mouse in 3D with a soft glare; it stays flat for touch. */
export default function Tilt({
  children,
  className = '',
  style,
  max = 7
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const srx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sry = useSpring(ry, { stiffness: 180, damping: 18 });
  const glare = useTransform([gx, gy], ([x, y]: number[]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.14), transparent 58%)`);

  return (
    <motion.div
      className={`group ${className}`}
      style={{ ...style, rotateX: srx, rotateY: sry, transformPerspective: 800 }}
      whileTap={{ scale: 0.98 }}
      onPointerMove={e => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glare }}
      />
    </motion.div>
  );
}
