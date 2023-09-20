/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        typedRoutes: true,
    },
    serverRuntimeConfig: {
        redisUrl: process.env.REDIS_URL
    }
}

module.exports = nextConfig
