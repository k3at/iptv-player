export const site = {
  name: "مشغّل IPTV",
  nameEn: "IPTV Player",
  tagline: "شغّل قوائم m3u في متصفحك مباشرة",
  description:
    "مشغّل IPTV عربي مجاني يعمل بالكامل داخل المتصفح: أضف قائمة m3u من رابط أو ملف أو باللصق، وتصفّح القنوات والمجموعات، وأضف المفضلة، وشاهد بث HLS و MP4 دون تثبيت أي برنامج.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: "مشغّل IPTV",
  nav: [] as { label: string; href: string }[],
} as const;

export type Site = typeof site;
