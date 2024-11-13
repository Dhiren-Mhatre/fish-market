/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer }) {
    // Disable source maps for client-side in production
    if (!isServer) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
