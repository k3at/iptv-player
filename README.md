# مشغّل IPTV (iptv-player)

**نسخة مباشرة:** <https://iptv-player-static.alssamer.workers.dev>

مشغّل IPTV عربي يعمل **بالكامل داخل المتصفح**، مبني على Next.js 16 (App Router + Turbopack) وTailwind CSS 4.
أضف قائمة m3u من رابط أو ملف أو باللصق، وتصفّح القنوات والمجموعات، وأضف المفضلة، وشاهد بث HLS و MP4 —
دون خادم مخصص ودون رفع بياناتك إلى أي جهة.

## المزايا

- تحليل قوائم m3u/m3u8 في المتصفح (بدون خادم) مع دعم وسيطات `tvg-logo` و`tvg-id` و`group-title` و`#EXTGRP`.
- إضافة قوائم Xtream Codes مباشرة (خادم + اسم مستخدم + كلمة مرور) بصيغة HLS، مع استخراج تلقائي
  لبيانات الدخول عند لصق رابط m3u الكامل، ورسائل خطأ واضحة (بيانات خاطئة / CORS).
- مشغّل بث يدعم HLS عبر hls.js (يُحمَّل ديناميكياً عند الحاجة فقط) والصيغ الأصلية مثل MP4.
- بحث عربي متسامح (يتجاهل التشكيل ويوحّد الألف/الياء/التاء المربوطة) وتصفية حسب المجموعة.
- مفضلة لكل قائمة، وكل البيانات تُحفظ في `localStorage` لديك.
- قائمة تجريبية جاهزة بروابط عامة مخصصة للاختبار (Apple، Mux، Unified Streaming، Amazon CloudFront،
  W3C، MDN) — تحققنا من تشغيل كل رابط داخل متصفح حقيقي قبل شحنه، واستُبعد كل رابط لا يعمل.
- واجهة عربية RTL بالكامل مع وضع فاتح/داكن، واختبارات Playwright لسطح المكتب والجوال.

## التشغيل السريع

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## الأوامر

| الأمر               | الوظيفة                                             |
| ------------------- | --------------------------------------------------- |
| `pnpm dev`          | خادم التطوير                                        |
| `pnpm build`        | بناء الإنتاج (مع مسار `/api/health`)                |
| `pnpm start`        | تشغيل نسخة الإنتاج                                  |
| `pnpm lint`         | فحص ESLint                                          |
| `pnpm typecheck`    | فحص TypeScript                                      |
| `pnpm format`       | تنسيق الملفات عبر Prettier                          |
| `pnpm test`         | اختبارات Playwright (سطح المكتب + جوال)             |
| `pnpm build:static` | تصدير ثابت إلى `out/` (GitHub Pages)                |
| `pnpm cf:static`    | تصدير ثابت + نشر على Cloudflare Workers (موصى به)   |
| `pnpm cf:deploy`    | نشر كامل عبر OpenNext (يتطلب WSL على ويندوز غالباً) |

## البنية

```text
src/
├─ app/                        # الصفحة الرئيسية + /api/health + globals.css
├─ components/
│  ├─ player/                  # IptvApp, VideoPlayer, ChannelList, AddPlaylistDialog
│  ├─ ui/                      # Button, Card, Container, Badge, SectionHeading
│  ├─ site-header.tsx
│  ├─ site-footer.tsx
│  └─ theme-toggle.tsx
└─ lib/
   ├─ m3u.ts                   # محلّل القوائم + الأنواع + أدوات المجموعات
   ├─ search.ts                # تطبيع النص العربي للبحث
   ├─ storage.ts               # localStorage (قوائم، مفضلة، صوت)
   ├─ demo-playlist.ts         # القائمة التجريبية
   ├─ site.ts                  # اسم الموقع ووصفه
   └─ cn.ts                    # دمج الأصناف
tests/e2e/                     # اختبارات Playwright
```

## ملاحظات مهمة

- **CORS:** بعض خدمات البث تمنع الجلب/التشغيل من المتصفح. الإدخال من رابط قد يفشل عندها، لكن «لصق نص»
  و«من ملف» يعملان دائماً. أما تشغيل البث نفسه فيعتمد على سماح المصدر للمتصفح.
- **الخصوصية:** لا يرسل التطبيق أي بيانات إلى خادم؛ التحليل والتخزين محليان بالكامل.
- **حقوق الاستخدام:** استخدم فقط قوائم وبثوثاً تملك حق الوصول إليها. القائمة التجريبية تستخدم بثوثاً
  عامة مخصصة للاختبار من مشاريع مفتوحة (وكل روابطها مُتحقق منها).

## النشر المجاني

### Cloudflare Workers (ثابت — موصى به)

```bash
pnpm cf:static
```

### GitHub Pages

```bash
pnpm build:static <repo-name>
```

أو استخدم سير العمل الجاهز في `.github/workflows/deploy-pages.yml`.
