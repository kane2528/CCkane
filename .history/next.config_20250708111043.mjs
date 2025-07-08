/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },
  images: {
    domains: ["example.com"], // Add any external image domains you use
  },
  // distDir: 'build', // Remove or comment out this line
};

export default nextConfig;
