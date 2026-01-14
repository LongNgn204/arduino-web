/** @type {import('next').NextConfig} */
const nextConfig = {
    // Bật strict mode để bắt lỗi sớm
    reactStrictMode: true,

    // Tối ưu images
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

    // Proxy API calls tới Workers backend trong dev
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8787/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
