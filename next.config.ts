import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Note: Use cautiously, as this skips type checking
  },
  eslint: {
    ignoreDuringBuilds: true, // Note: Consider running ESLint separately in CI
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'us2.internet-radio.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'control.internet-radio.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add Webpack configuration to split chunks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        maxSize: 1000000, // 1MB (adjust to keep chunks under 25 MiB)
        minSize: 100000, // Minimum size for a chunk to be created
        cacheGroups: {
          default: false,
          vendors: false,
          // Split vendor and common chunks
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
  // Enable compression to reduce asset size
  compress: true,
  // Optimize static assets
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;