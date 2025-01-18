/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        redisUrl: process.env.REDIS_URL
    }
}

module.exports = nextConfig
