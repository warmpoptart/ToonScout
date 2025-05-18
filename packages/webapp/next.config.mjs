/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Add all environment variables you want to expose to the client here
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_API_HTTP: process.env.NEXT_PUBLIC_API_HTTP,
    NEXT_PUBLIC_SYSTEM_BANNER_ENABLED:
      process.env.NEXT_PUBLIC_SYSTEM_BANNER_ENABLED,
    NEXT_PUBLIC_SYSTEM_BANNER_TYPE: process.env.NEXT_PUBLIC_SYSTEM_BANNER_TYPE,
    NEXT_PUBLIC_SYSTEM_BANNER_MSG: process.env.NEXT_PUBLIC_SYSTEM_BANNER_MSG,
    NEXT_PUBLIC_CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID,
    NEXT_PUBLIC_DISCORD_INVITE: process.env.NEXT_PUBLIC_DISCORD_INVITE,
    NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
    NEXT_PUBLIC_BOT_WSS: process.env.NEXT_PUBLIC_BOT_WSS,
    // Add more as needed
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rendition.toontownrewritten.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.toontownrewritten.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
  },
  // Cache all static assets with 1 year TTL
  async headers() {
    return [
      {
        source:
          "/(flowers|gags|fonts|images|rewards|sounds|fish|cog_images|sos)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // common static file extensions anywhere
      {
        source:
          "/:path*\\.(svg|ico|jpg|jpeg|png|gif|webp|woff|woff2|ttf|mp3|wav|pdf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // SEO files with shorter cache (1 day)
      {
        source: "/(robots.txt|sitemap.xml)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
