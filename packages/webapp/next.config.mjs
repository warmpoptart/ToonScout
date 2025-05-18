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
  // doesn't auto cache SVGs - also cache all other static assets with 1year TTL
  async headers() {
    return [
      // Static asset folders with specific patterns
      {
        source: "/flowers/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/gags/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/rewards/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sounds/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fish/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/cog_images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Catch-all for common static file extensions at any level
      {
        source: "/:path*\\.(svg|ico|jpg|jpeg|png|gif|webp|avif|bmp|tiff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(mp3|wav|ogg|m4a|aac|flac)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(mp4|webm|avi|mov|wmv|flv)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(pdf|doc|docx|txt|zip|tar|gz)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Specific root files
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // 1 day for robots.txt
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400", // 1 day for sitemap
          },
        ],
      },
    ];
  },
};

export default nextConfig;
