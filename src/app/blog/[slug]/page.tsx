import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '@/lib/blog';
import { TOPIC_COLORS } from '@/content/topics';
import { profile } from '@/content/site';
import ReadingProgress from './ReadingProgress';

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();
  // A static export needs at least one path; the placeholder 404s if there are no posts yet.
  return posts.length ? posts.map(p => ({ slug: p.slug })) : [{ slug: 'coming-soon' }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { type: 'article', title: post.title, description: post.summary, publishedTime: post.date, authors: [profile.name] }
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const index = all.findIndex(p => p.slug === post.slug);
  const next = all[(index + 1) % all.length];
  const color = TOPIC_COLORS[post.topic] ?? 'var(--mustard)';

  return (
    <article className="section pt-40">
      <ReadingProgress color={color} />
      <div className="mx-auto max-w-3xl">
        <Link href="/blog/" className="group eyebrow inline-flex items-center gap-2 hover:text-paper">
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> All posts
        </Link>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="chip" style={{ color }}>
            {post.topic}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper-mute">
            {new Date(post.date + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} · {post.readingMinutes} min read
          </span>
        </div>
        <h1 className="retro-shadow mt-6 font-display text-[clamp(2.2rem,6vw,4.4rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-paper">
          {post.title}
        </h1>
        <p className="mt-6 font-serif text-xl italic leading-relaxed text-paper-dim">{post.summary}</p>
        <hr className="my-10 border-dashed" style={{ borderColor: 'var(--line-strong)' }} />
        <div className="prose-retro" dangerouslySetInnerHTML={{ __html: post.html }} />

        <div className="mt-16 flex items-center gap-4 rounded-2xl border bg-ink-2 p-5" style={{ borderColor: 'var(--line)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/portrait-full-sm.webp" alt="" width={300} height={381} className="h-16 w-[3.15rem] shrink-0 rounded-lg border-2 border-mustard object-cover" />
          <div>
            <p className="font-display text-sm font-bold uppercase text-paper">{profile.name}</p>
            <p className="text-sm text-paper-dim">
              {profile.role} at {profile.company} · building Zyraa
            </p>
          </div>
        </div>

        {next && next.slug !== post.slug && (
          <Link
            href={`/blog/${next.slug}/`}
            className="group mt-10 block rounded-[26px] border p-7 transition-colors hover:bg-ink-2"
            style={{ borderColor: 'var(--line-strong)' }}
            data-cursor="view"
            data-cursor-label="Next"
          >
            <p className="eyebrow">Next post →</p>
            <p className="mt-3 font-display text-2xl font-black uppercase leading-tight text-paper transition-colors group-hover:text-mustard">
              {next.title}
            </p>
          </Link>
        )}
      </div>
    </article>
  );
}
