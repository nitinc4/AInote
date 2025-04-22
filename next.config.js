/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};
module.exports = {
  webpack: (config) => {
    config.externals.push({
      bufferutil: 'commonjs bufferutil',
      'utf-8-validate': 'commonjs utf-8-validate',
    });
    return config;
  },
};

module.exports = nextConfig;