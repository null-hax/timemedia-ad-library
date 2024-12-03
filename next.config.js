/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Remove experimental features
  },
  images: {
    domains: ['picsum.photos'],
  },
}

module.exports = nextConfig 