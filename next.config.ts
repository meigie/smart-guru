import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'localhost',
      'images.unsplash.com',
      'commondatastorage.googleapis.com',
    ],
  },
};

export default nextConfig;
