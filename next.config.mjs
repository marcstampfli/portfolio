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
  productionBrowserSourceMaps: false,
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Link",
          value: "</images/placeholder.svg>; rel=preload; as=image",
        },
      ],
    },
  ],
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
