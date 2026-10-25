'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import { ArrowOut } from '@/components/ui/Icons';
import { TOPIC_COLORS } from '@/content/topics';
import type { PostMeta } from '@/lib/blog';

export default function BlogTeaser({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) return null;

  return (
    <section id="blog" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index="08" eyebrow="Writing" title="Notes from" accent="the build." />
          <Link href="/blog/" className="btn btn-ghost group">
            All posts <ArrowOut size={13} />
          </Link>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${p.slug}/`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border bg-ink-2 p-6 transition-transform duration-500 hover:-translate-y-1.5 sm:p-7"
                style={{ borderColor: 'var(--line)' }}
                data-cursor="view"
                data-cursor-label="Read"
              >
                <span
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: TOPIC_COLORS[p.topic] ?? 'var(--mustard)' }}
                />
                <div>
                  <span className="chip" style={{ color: TOPIC_COLORS[p.topic], borderColor: 'var(--line-strong)' }}>
                    {p.topic}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-black uppercase leading-[1.12] text-paper transition-colors group-hover:text-mustard">
                    {p.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-paper-dim">{p.summary}</p>
                </div>
                <div className="mt-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-paper-mute">
                  <span>
                    {new Date(p.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {p.readingMinutes} min
                  </span>
                  <ArrowOut size={14} className="text-mustard" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
