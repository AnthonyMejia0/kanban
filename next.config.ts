import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      // Matches all .svg files
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js', // Tells Turbopack to treat the output as JavaScript/React
      },
    },
  },
};

export default nextConfig;
