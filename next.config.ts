import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the new package name here
  serverExternalPackages: ['@huggingface/transformers'],
};

export default nextConfig;