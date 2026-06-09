/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Uploads can be large; allow generous server action body size.
  experimental: {
    instrumentationHook: true,
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

module.exports = nextConfig
