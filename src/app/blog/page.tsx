import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { TOPIC_COLORS } from '@/content/topics';
import BlogIndexMotion from './BlogIndexMotion';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on AI engineering, prompt engineering, product building and shipping live industry software.',
  alternates: { canonical: '/blog/' }
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const topics = Object.keys(TOPIC_COLORS);

  return (
    <section className="section min-h-[80svh] pt-40">
      <div className="container-x">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-mustard">✦</span>
          <span className="h-px w-10" style={{ background: 'var(--line-strong)' }} />
          Writing
        </p>
        <h1 className="retro-shadow mt-6 font-display text-[clamp(3rem,10vw,8.5rem)] font-black uppercase leading-[0.88] tracking-[-0.03em] text-paper">
          Notes from <span className="font-serif font-light normal-case italic text-mustard [text-shadow:none]">the build.</span>
        </h1>
        <div className="mt-8 flex flex-wrap gap-2">
          {topics.map(t => (
            <span key={t} className="chip" style={{ color: TOPIC_COLORS[t] }}>
              {t}
            </span>
          ))}
        </div>

        <BlogIndexMotion>
          {posts.map((p, i) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}/`}
              data-blog-row
              className="group relative grid gap-3 border-b py-8 sm:grid-cols-12 sm:items-baseline sm:gap-6"
              style={{ borderColor: 'var(--line)' }}
              data-cursor="view"
              data-cursor-label="Read"
            >
              <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-ink-2 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
              <span className="relative font-mono text-xs text-paper-mute sm:col-span-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="relative sm:col-span-7">
                <span className="block font-display text-[clamp(1.3rem,3vw,2.2rem)] font-black uppercase leading-tight text-paper transition-all duration-500 group-hover:translate-x-2 group-hover:text-mustard">
                  {p.title}
                </span>
                <span className="mt-2 block max-w-2xl text-paper-dim">{p.summary}</span>
              </span>
              <span className="relative font-mono text-[11px] uppercase tracking-[0.12em] sm:col-span-2" style={{ color: TOPIC_COLORS[p.topic] }}>
                {p.topic}
              </span>
              <span className="relative font-mono text-[11px] uppercase tracking-[0.12em] text-paper-mute sm:col-span-2 sm:text-right">
                {new Date(p.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {p.readingMinutes} min
              </span>
            </Link>
          ))}
        </BlogIndexMotion>
        {!posts.length && <p className="mt-16 text-paper-dim">First post coming soon.</p>}
      </div>
    </section>
  );
}
