/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://10.33.174.49:8000/api/:path*', 
      },
    ]
  },
};

export default nextConfig;