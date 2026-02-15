/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Tente usar '127.0.0.1' em vez de 'localhost' para evitar problemas de IPv6
        destination: 'http://10.33.174.49:8000/api/:path*', 
      },
    ]
  },
};

export default nextConfig;