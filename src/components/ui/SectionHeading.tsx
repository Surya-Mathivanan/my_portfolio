'use client';

import { motion } from 'motion/react';

type Props = {
  index: string;
  eyebrow: string;
  title: string;
  /** Words to set in the italic serif accent. */
  accent?: string;
  align?: 'left' | 'center';
  className?: string;
};

const word = {
  hidden: { y: '110%', rotate: 4 },
  show: (i: number) => ({
    y: '0%',
    rotate: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 * i }
  })
};

/** Numbered eyebrow + display title whose words rise out of a mask, finished with a retro offset shadow. */
export default function SectionHeading({ index, eyebrow, title, accent, align = 'left', className = '' }: Props) {
  const words = title.split(' ');
  const accentWords = accent ? accent.split(' ') : [];
  const centered = align === 'center';

  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <motion.p
        className={`eyebrow flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.7 }}
      >
        <span className="text-mustard">{index}</span>
        <span className="h-px w-10 bg-line-strong" style={{ background: 'var(--line-strong)' }} />
        {eyebrow}
      </motion.p>
      <motion.h2
        className="retro-shadow mt-5 font-display text-[clamp(2.1rem,6.4vw,5.2rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em] text-paper"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-10% 0px' }}
      >
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block" variants={word} custom={i}>
              {w}
            </motion.span>
          </span>
        ))}
        {accentWords.map((w, i) => (
          <span key={`a-${w}-${i}`} className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block font-serif font-normal normal-case italic text-mustard [text-shadow:none]"
              variants={word}
              custom={words.length + i}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </div>
  );
}
