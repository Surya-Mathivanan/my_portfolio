import type { NextConfig } from 'next';

// Static export so the site can be served from GitHub Pages (surya-mathivanan.github.io).
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Hide the dev-only "N" badge so it doesn't sit on top of the footer while reviewing.
  devIndicators: false,
  reactStrictMode: true
};

export default nextConfig;
