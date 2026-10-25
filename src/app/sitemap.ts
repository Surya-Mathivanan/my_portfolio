import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { profile } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map(p => ({
    url: `${profile.site}/blog/${p.slug}/`,
    lastModified: p.date,
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));
  return [
    { url: `${profile.site}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${profile.site}/blog/`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${profile.site}/resume/`, changeFrequency: 'monthly', priority: 0.8 },
    ...posts
  ];
}
