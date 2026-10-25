import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Posts are Markdown files in /content/blog. The file name is the URL slug.

const DIR = path.join(process.cwd(), 'content', 'blog');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  topic: string;
  summary: string;
  readingMinutes: number;
  draft: boolean;
};

export type Post = PostMeta & { html: string };

function read(file: string): Post {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).filter(Boolean).length;
  // YAML turns `date: 2026-10-20` into a Date; keep it as a plain YYYY-MM-DD string.
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '');
  return {
    slug: file.replace(/\.md$/, ''),
    title: String(data.title ?? 'Untitled'),
    date,
    topic: String(data.topic ?? 'Notes'),
    summary: String(data.summary ?? ''),
    readingMinutes: Math.max(1, Math.round(words / 220)),
    draft: Boolean(data.draft),
    html: marked.parse(content, { async: false }) as string
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter(f => f.endsWith('.md'))
    .map(read)
    .filter(p => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ html: _html, ...meta }) => meta);
}

export function getPost(slug: string): Post | null {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(DIR, file))) return null;
  const post = read(file);
  return post.draft ? null : post;
}
