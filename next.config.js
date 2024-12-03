/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['picsum.photos'],
  },
}

module.exports = nextConfig 