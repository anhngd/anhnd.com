/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Vẫn giữ unoptimized khi sử dụng static export
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp'],
  },
  trailingSlash: true,
  poweredByHeader: false, // Loại bỏ header X-Powered-By
  reactStrictMode: true, // Bật strict mode
  swcMinify: true, // Sử dụng SWC để minify
}

module.exports = nextConfig