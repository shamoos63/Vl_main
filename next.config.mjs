/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Transpile the local SDK package from node_modules
  transpilePackages: ['@api/reelly'],
  images: {
    // Enable Next.js image optimization and allow imgbb domains
    unoptimized: false,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Ensure dynamic rendering (SSR) for all pages
  // This prevents static generation that would break database queries
  output: undefined, // Explicitly disable static export
  
  // Configure for server-side rendering
  serverExternalPackages: ['@libsql/client'],
}

export default nextConfig
