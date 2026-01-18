/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'www.rocket.eu',
      },
      {
        protocol: 'https',
        hostname: 'www.maison-eco-paysanne.fr',
      },
      {
        protocol: 'https',
        hostname: 'isowatt.fr',
      },
      {
        protocol: 'https',
        hostname: 'www.jura.gouv.fr',
      },
    ],
  },
}

module.exports = nextConfig

