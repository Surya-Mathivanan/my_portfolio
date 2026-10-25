import snapshot from '@/data/github-snapshot.json';

// Runs at build time (static export). Live data is fetched when the network allows,
// otherwise the committed snapshot keeps the GitHub section populated.

const USER = 'Surya-Mathivanan';

export type ContributionDay = { date: string; count: number; level: number };
export type RepoSummary = { name: string; language: string | null; pushedAt: string; url: string };
export type GitHubData = {
  login: string;
  publicRepos: number;
  followers: number;
  since: string;
  languages: { name: string; count: number }[];
  recent: RepoSummary[];
  contributions: ContributionDay[];
  total: number;
  monthly: { month: string; count: number }[];
  live: boolean;
};

async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'force-cache' });
  } finally {
    clearTimeout(timer);
  }
}

function parseContributions(html: string): ContributionDay[] {
  const tips = new Map<string, string>();
  for (const m of html.matchAll(/for="contribution-day-component-(\d+-\d+)"[^>]*>([^<]*)/g)) tips.set(m[1], m[2]);
  const days: ContributionDay[] = [];
  const cell = /data-date="([0-9-]+)" id="contribution-day-component-(\d+)-(\d+)" data-level="(\d)"/g;
  for (const m of html.matchAll(cell)) {
    const tip = tips.get(`${m[2]}-${m[3]}`) ?? '';
    const n = /^(\d+) contribution/.exec(tip);
    days.push({ date: m[1], count: n ? Number(n[1]) : 0, level: Number(m[4]) });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function summarise(days: ContributionDay[]) {
  const months = new Map<string, number>();
  for (const d of days) months.set(d.date.slice(0, 7), (months.get(d.date.slice(0, 7)) ?? 0) + d.count);
  return {
    total: days.reduce((sum, d) => sum + d.count, 0),
    monthly: [...months.entries()].map(([month, count]) => ({ month, count }))
  };
}

export async function getGitHubData(): Promise<GitHubData> {
  const base: GitHubData = {
    login: snapshot.user.login,
    publicRepos: snapshot.user.publicRepos,
    followers: snapshot.user.followers,
    since: snapshot.user.createdAt,
    languages: snapshot.languages,
    recent: snapshot.recent,
    contributions: snapshot.contributions,
    ...summarise(snapshot.contributions),
    live: false
  };

  try {
    const headers = { 'User-Agent': 'surya-portfolio-build', Accept: 'application/vnd.github+json' };
    const [userRes, reposRes, contribRes] = await Promise.all([
      fetchWithTimeout(`https://api.github.com/users/${USER}`, { headers }),
      fetchWithTimeout(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { headers }),
      fetchWithTimeout(`https://github.com/users/${USER}/contributions`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    ]);
    if (!userRes.ok || !reposRes.ok || !contribRes.ok) return base;

    const user = await userRes.json();
    const repos: { name: string; language: string | null; pushed_at: string; html_url: string; fork: boolean }[] =
      await reposRes.json();
    const days = parseContributions(await contribRes.text());
    if (days.length < 300) return base;

    const counts = new Map<string, number>();
    for (const r of repos) if (r.language && !r.fork) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);

    return {
      login: user.login,
      publicRepos: user.public_repos,
      followers: user.followers,
      since: String(user.created_at).slice(0, 10),
      languages: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      recent: repos
        .filter(r => !r.fork)
        .slice(0, 12)
        .map(r => ({ name: r.name, language: r.language, pushedAt: r.pushed_at.slice(0, 10), url: r.html_url })),
      contributions: days,
      ...summarise(days),
      live: true
    };
  } catch {
    return base;
  }
}
