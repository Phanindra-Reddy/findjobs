/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "logo.clearbit.com",
    ],
  },
};

module.exports = nextConfig;
