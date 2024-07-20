/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;

/* 

  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },

  */
