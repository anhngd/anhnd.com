/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['anhnd.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 