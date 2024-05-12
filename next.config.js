/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  images: {
    domains: [
      "api.clerk.dev",
      "utfs.io"
    ]
  }
}

module.exports = nextConfig
