import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section grid min-h-[80svh] place-items-center pt-40 text-center">
      <div>
        <p className="eyebrow">Error 404 · route not shipped</p>
        <h1 className="retro-shadow mt-6 font-display text-[clamp(5rem,22vw,14rem)] font-black leading-none text-paper">404</h1>
        <p className="mx-auto mt-6 max-w-md text-paper-dim">This page is still in the build loop. Try the home page instead.</p>
        <Link href="/" className="btn btn-primary mt-10">
          Back home
        </Link>
      </div>
    </section>
  );
}
