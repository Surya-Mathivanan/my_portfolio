# Surya Mathivanan — Portfolio

Personal site of Surya Mathivanan, AI Engineer at UK Textiles and builder of [Zyraa](https://zyraaportal.vercel.app/).
Live at **https://surya-mathivanan.github.io**.

## Stack

- **Next.js 16** (App Router, TypeScript, static export) · **Tailwind CSS 4**
- **Motion** for entrances and micro-interactions · **GSAP + ScrollTrigger** for pinned and parallax scroll · **Lenis** smooth scrolling
- **React Bits** WebGL components in `src/components/bits/` (DitherVeil, GradientASCII, LaserFlow, GhostFibers, SideRays, FlexCarousel, LogoLoop, StaggeredMenu, GooeyNav, TrueFocus, ElasticMesh)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm start          # serve ./out locally
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

The GitHub section (contribution heatmap, languages, recent repos) is fetched **at build time**.
If GitHub can't be reached, the build falls back to `src/data/github-snapshot.json`.
The deploy workflow rebuilds every Monday so the numbers stay current.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the static site and publishes it to GitHub Pages.
In the repository settings, **Pages → Build and deployment → Source** must be set to **GitHub Actions**.

## Performance notes

- Heavy WebGL effects mount only near the viewport (`src/components/LazyMount.tsx`) and are released when far away.
- Touch devices and low-power hardware get a lower pixel ratio and lighter effect settings (`useLowPower`).
- `prefers-reduced-motion` disables smooth scrolling, pinning and looping animations.

The previous static site is kept in `legacy/` for reference.
