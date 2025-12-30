import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@huggingface/transformers'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // This prevents Webpack from failing when it sees native Node.js imports
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-node': false,
      };
    }
    return config;
  },
};

export default nextConfig;