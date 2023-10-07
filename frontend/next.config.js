/** @type {import('next').NextConfig} */
const nextConfig = {
   images: {
      domains: [
         'res.cloudinary.com',
         'bizweb.dktcdn.net',
         'yody-prd-media.s3.ap-southeast-1.amazonaws.com',
         'lh3.googleusercontent.com',
      ],
   },
   experimental: {
      serverActions: true,
      externalDir: true,
   },
   typescript: {
      ignoreBuildErrors: true,
   },
}

module.exports = nextConfig
