import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    WS_URL: process.env.WS_URL,
  },
};

export default nextConfig;
