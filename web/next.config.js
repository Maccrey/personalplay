/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/personalplay',
  assetPrefix: '/personalplay',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
module.exports = nextConfig;
