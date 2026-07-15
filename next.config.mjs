/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // maplibre-gl ships untranspiled ESM that benefits from transpilation in app router.
  transpilePackages: [],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "airport-data.com" },
      { protocol: "https", hostname: "api.adsbdb.com" },
    ],
  },
};

export default nextConfig;
