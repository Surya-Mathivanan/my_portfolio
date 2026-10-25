# Surya Mathivanan — Portfolio

Personal site of Surya Mathivanan, AI Engineer at UK Textiles and builder of [Zyraa](https://zyraaportal.vercel.app/).
Deployed on **Vercel**.

## Stack

- **Next.js 16** (App Router, TypeScript) on **Vercel** · **Tailwind CSS 4**
- **Motion** for entrances and micro-interactions · **GSAP + ScrollTrigger** for pinned and parallax scroll · **Lenis** smooth scrolling
- **React Bits** WebGL components in `src/components/bits/` (DitherVeil, GradientASCII, LaserFlow, GhostFibers, SideRays, FlexCarousel, LogoLoop, StaggeredMenu, GooeyNav, TrueFocus, ElasticMesh)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build on http://localhost:3000
```

## Edit content

| What | Where |
| --- | --- |
| Name, intro, links, stats, ventures, projects, experience, growth phases | `src/content/site.ts` |
| Blog posts | `content/blog/*.md` |
| Résumé page (`/resume/`) | `src/content/resume.ts` — and replace `public/resume/Surya-Mathivanan-Resume.pdf` with the new PDF |
| Project screenshots | `public/projects/*.webp` |
| Profile photos | `public/images/` |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |

### Writing a blog post

Add a Markdown file to `content/blog/`. The file name becomes the URL (`/blog/<file-name>/`).

```md
---
title: My new post
date: 2026-11-01
topic: AI Engineering        # AI Engineering · Prompt Engineering · Product Building · Industry Apps · Surveys
summary: One sentence shown on cards and in search results.
draft: false                 # true hides the post
---

Write here. Markdown headings, lists, quotes and code blocks are styled.
```

## GitHub data

The GitHub section (contribution heatmap, languages, recent repos, growth chart) is fetched on the server
at build time, and Vercel regenerates the home page in the background **at most once a day**, so the numbers
stay current without redeploying. If GitHub can't be reached, it falls back to `src/data/github-snapshot.json`.

## Deploy (Vercel)

1. On [vercel.com/new](https://vercel.com/new), import the `my_portfolio` GitHub repository. Vercel detects Next.js; keep the default build settings.
2. Optionally add the environment variables below (**Settings → Environment Variables**), then deploy.
3. Every push to `main` deploys to production; every other branch or pull request gets its own preview URL.

| Variable | Needed? | What it does |
| --- | --- | --- |
| `SITE_URL` | Only with a custom domain | Canonical address for metadata, the sitemap and share links, e.g. `https://your-domain.com`. Without it, the Vercel production domain is used automatically. |
| `GITHUB_TOKEN` | Recommended | A fine-grained token with **no permissions** (public read only). Lifts GitHub's 60-requests-an-hour limit on Vercel's shared build machines, so the live numbers load instead of the snapshot. |

`vercel.json` pins functions to Mumbai (`bom1`, closest to Tiruppur), adds security headers, and sets caching for
photos, screenshots and the résumé PDF (the PDF is always revalidated, so a new résumé shows up right after a deploy).
See `.env.example` for local overrides.

## Performance notes

- Heavy WebGL effects mount only near the viewport (`src/components/LazyMount.tsx`) and are released when far away.
- Touch devices and low-power hardware get a lower pixel ratio and lighter effect settings (`useLowPower`).
- `prefers-reduced-motion` disables smooth scrolling, pinning and looping animations.

The previous static site is kept in `legacy/` for reference.
