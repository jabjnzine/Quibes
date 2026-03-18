import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  transpilePackages: ['@quibes/shared'],
  turbopack: {
    // Explicitly set the monorepo root so Turbopack doesn't confuse multiple lockfiles
    root: path.resolve(__dirname, '../../..'),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
