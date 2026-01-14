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

    // Proxy API calls tới Workers backend
    async rewrites() {
        // Production: gọi trực tiếp Workers đã deploy
        // Dev: proxy qua localhost:8787
        const apiUrl = process.env.NODE_ENV === 'production'
            ? 'https://arduino-workers.stu725114073.workers.dev'
            : 'http://localhost:8787';

        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/api/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;

