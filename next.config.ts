import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Cache Components / Partial Prefetching غير مفعّلة لأنها غير متوافقة مع التصدير الثابت.
  // فعّلها إذا كان النشر على Cloudflare/VPS فقط.
  typedRoutes: true,
  poweredByHeader: false,
  // يسمح بتجربة التطوير عبر 127.0.0.1 وليس localhost فقط (يمنع حجب HMR).
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  // تصدير ثابت من أجل GitHub Pages (بدون خادم).
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),

  // GitHub Pages يخدم المشروع تحت مسار فرعي مثل /repo-name.
  ...(basePath ? { basePath } : {}),

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
