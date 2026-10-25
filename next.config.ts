import type { NextConfig } from 'next';

// Canonical address for metadata, the sitemap and share links. Vercel provides the production domain at
// build time; set SITE_URL in the Vercel project to use a custom domain instead.
const site = (
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')
).replace(/\/$/, '');

const nextConfig: NextConfig = {
  trailingSlash: true,
  // Inlined into server and client code alike, so share links render identically on both sides.
  env: { SITE_URL: site },
  poweredByHeader: false,
  // Hide the dev-only "N" badge so it doesn't sit on top of the footer while reviewing.
  devIndicators: false,
  reactStrictMode: true
};

export default nextConfig;
