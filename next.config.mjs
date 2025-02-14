/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  transpilePackages: [
    "framer-motion",
    "@tanstack/react-query",
    "lucide-react"
  ],
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizeCss: true,
    serverActions: {
      enabled: true
    }
  },
<<<<<<< HEAD
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
=======
>>>>>>> e4bd41c (chore: update dependencies and configuration files)
};

export default nextConfig;
