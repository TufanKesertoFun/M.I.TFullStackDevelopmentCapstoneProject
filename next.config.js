/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Ignore .html files to prevent Webpack from trying to process them
      config.module.rules.push({
        test: /\.html$/,
        use: 'ignore-loader',
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  