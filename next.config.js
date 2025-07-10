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
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.(ico|jpg|jpeg|png|svg|webp|gif|mp4|webm|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig