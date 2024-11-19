/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary domain here
  },
  webpack(config, { isServer }) {
    // Disable source maps for client-side in production
    if (!isServer) {
      config.devtool = false;
    }
    return config;
  },
};


export default nextConfig;
