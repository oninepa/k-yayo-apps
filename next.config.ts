import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 검사 비활성화
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 검사 비활성화 (선택사항)
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
