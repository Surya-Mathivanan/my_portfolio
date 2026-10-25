import Hero from '@/components/sections/Hero';
import TechLoop from '@/components/sections/TechLoop';
import About from '@/components/sections/About';
import Journey from '@/components/sections/Journey';
import Ventures from '@/components/sections/Ventures';
import BuildLoop from '@/components/sections/BuildLoop';
import Growth from '@/components/sections/Growth';
import GitHubPulse from '@/components/sections/GitHubPulse';
import Projects from '@/components/sections/Projects';
import BlogTeaser from '@/components/sections/BlogTeaser';
import Contact from '@/components/sections/Contact';
import { getGitHubData } from '@/lib/github';
import { getAllPosts } from '@/lib/blog';

// Regenerate in the background at most once a day so the GitHub numbers stay current.
export const revalidate = 86400;

export default async function Home() {
  const [github, posts] = await Promise.all([getGitHubData(), Promise.resolve(getAllPosts())]);

  return (
    <>
      <Hero />
      <TechLoop />
      <About />
      <Journey />
      <Ventures />
      <Projects />
      <BuildLoop />
      <Growth months={github.monthly} />
      <GitHubPulse data={github} />
      <BlogTeaser posts={posts} />
      <Contact />
    </>
  );
}
