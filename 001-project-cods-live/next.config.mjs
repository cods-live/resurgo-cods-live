/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'api.qrserver.com',
            port: '',
          },
        ],
      },
};

export default nextConfig;
