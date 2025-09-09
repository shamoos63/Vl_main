/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Transpile the local SDK package from node_modules
  transpilePackages: ['@api/reelly'],
  images: {
    unoptimized: true,
  },
  // Ensure dynamic rendering (SSR) for all pages
  // This prevents static generation that would break database queries
  output: undefined, // Explicitly disable static export
  
  // Configure for server-side rendering
  serverExternalPackages: ['@libsql/client'],
}

export default nextConfig
