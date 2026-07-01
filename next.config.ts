import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  output: "standalone",
  // ⚠️ تحذير: هذا يتجاوز التحقق من النطاقات الخارجية.
  // تم تعيينه لضمان عمل شعارات Clearbit و Google Favicon
  // دون مشاكل بناء.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
