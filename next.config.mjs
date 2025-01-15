const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Disable source maps in development
    if (dev) {
      config.devtool = false;
    }

    return config;
  },
};

export default nextConfig;
