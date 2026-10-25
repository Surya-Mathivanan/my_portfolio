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
              className="print-shadow h-full [--sh:rgba(0,0,0,.5)] hover:[--sh:color-mix(in_srgb,var(--c)_70%,#120e0c)]"
              style={{ ['--c' as string]: TOPIC_COLORS[p.topic] ?? 'var(--mustard)' }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              {/* Index card: ruled lines, a rule under the topic and a dog-eared corner in the topic colour */}
              <Link
                href={`/blog/${p.slug}/`}
                className="card-cut group relative flex h-full flex-col justify-between p-6 transition-[translate] duration-500 [--bd:var(--line)] [--c2:30px] [--c4:0px] [--fold:30px] hover:-translate-y-1.5 hover:[--bd:var(--c)] hover:[--c2:46px] hover:[--fold:46px] sm:p-7"
                data-cursor="view"
                data-cursor-label="Read"
              >
                <span aria-hidden="true" className="note-lines pointer-events-none absolute inset-0" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[64px] h-px opacity-50" style={{ background: 'var(--c)' }} />
                <span aria-hidden="true" className="note-fold" />
                <div className="relative">
                  <span className="chip bg-ink" style={{ color: TOPIC_COLORS[p.topic], borderColor: 'var(--line-strong)' }}>
                    {p.topic}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-black uppercase leading-[1.12] text-paper transition-colors group-hover:text-mustard">
                    {p.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-paper-dim">{p.summary}</p>
                </div>
                <div className="relative mt-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-paper-mute">
                  <span>
                    {new Date(p.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {p.readingMinutes} min
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-mustard transition-all duration-500 group-hover:rotate-45 group-hover:border-mustard group-hover:bg-mustard group-hover:text-ink">
                    <ArrowOut size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
