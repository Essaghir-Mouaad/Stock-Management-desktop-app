/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Tauri desktop builds
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure asset paths for desktop
  assetPrefix: './',
  
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint checking during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip API routes during static export
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
}

module.exports = nextConfig