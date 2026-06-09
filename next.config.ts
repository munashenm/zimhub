import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Railway Docker can't reliably run the Next.js image optimizer (sharp/external fetch).
    // Serve remote images directly until we add libvips/sharp to the container.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
