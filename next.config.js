/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'raw.githubusercontent.com'
    ],
    unoptimized: true
  },
  output: 'standalone'
};

module.exports = nextConfig;