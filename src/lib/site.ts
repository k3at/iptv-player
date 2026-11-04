export const site = {
  name: "منصّة البداية",
  nameEn: "Starter",
  tagline: "قالب عربي جاهز للإنتاج",
  description:
    "قالب Next.js وTailwind CSS عربي بالكامل (RTL) مع وضع داكن، مكوّنات واجهة، اختبارات Playwright، ونشر مجاني على Cloudflare وGitHub Pages.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: "فريق البداية",
  nav: [
    { label: "المزايا", href: "#features" },
    { label: "كيف تبدأ", href: "#steps" },
    { label: "الأسئلة", href: "#faq" },
  ],
  links: {
    github: "https://github.com",
    docs: "https://nextjs.org/docs",
  },
} as const;

export type Site = typeof site;
