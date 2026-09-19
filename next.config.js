/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Only for verification builds that run beside the dev server: NEXT_DIST_DIR=.verify yarn build.
  // Never set distDir by default: with output 'export' it also moves the export away from out/.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
