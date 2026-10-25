import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Fraunces, Martian_Mono, Unbounded } from 'next/font/google';
import './globals.css';
import Loader from '@/components/Loader';
import Cursor from '@/components/Cursor';
import SmoothScroll from '@/components/providers/SmoothScroll';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { profile, socials } from '@/content/site';

const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-unbounded', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });
const martian = Martian_Mono({ subsets: ['latin'], variable: '--font-martian', display: 'swap' });

const description =
  'Surya Mathivanan — AI Engineer at UK Textiles and builder of Zyraa, an HRMS for garment units. Projects, writing and five months of shipping in production.';

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: { default: `${profile.name} — AI Engineer & Product Builder`, template: `%s — ${profile.name}` },
  description,
  authors: [{ name: profile.name, url: profile.site }],
  keywords: ['Surya Mathivanan', 'AI Engineer', 'Zyraa', 'HRMS', 'VINKORE', 'Tiruppur', 'Portfolio', 'Full stack'],
  openGraph: {
    type: 'website',
    url: profile.site,
    title: `${profile.name} — AI Engineer & Product Builder`,
    description,
    images: [{ url: '/images/profile.jpg', width: 600, height: 600, alt: profile.name }]
  },
  twitter: { card: 'summary_large_image', title: profile.name, description, images: ['/images/profile.jpg'] },
  alternates: { canonical: '/' }
};

export const viewport: Viewport = {
  themeColor: '#120e0c',
  width: 'device-width',
  initialScale: 1
};

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  worksFor: { '@type': 'Organization', name: profile.company },
  address: { '@type': 'PostalAddress', addressLocality: 'Tiruppur', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
  url: profile.site,
  image: `${profile.site}/images/profile.jpg`,
  sameAs: socials.filter(s => s.href.startsWith('http')).map(s => s.href)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${fraunces.variable} ${bricolage.variable} ${martian.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href="/images/profile-portrait.webp" />
        <link rel="preload" as="image" href="/images/portrait-full-sm.webp" />
        <noscript>
          <style>{'#loader{display:none!important}body{overflow:auto!important}'}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      </head>
      <body data-loading="true" suppressHydrationWarning>
        <Loader />
        <SmoothScroll />
        <Cursor />
        <Header />
        <main id="top">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
