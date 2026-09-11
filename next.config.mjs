import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
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

export default (phase) => ({
    ...nextConfig,
    // Keep production builds from replacing files used by the running dev server.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
});
