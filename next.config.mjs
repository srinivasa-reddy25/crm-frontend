/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/__/auth/:path*',
                destination: 'https://crm-old-2609c.firebaseapp.com/__/auth/:path*',
            },
            {
                source: '/__/firebase/:path*',
                destination: 'https://crm-old-2609c.firebaseapp.com/__/firebase/:path*',
            },
        ];
    },
};

export default nextConfig;
