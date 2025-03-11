/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cupinpoint.blob.core.windows.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
