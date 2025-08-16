/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for production builds (Tauri)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove the experimental.esmExternals line that was causing warnings
  // Configure asset paths for desktop
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : '',
}

module.exports = nextConfig