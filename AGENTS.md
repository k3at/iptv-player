<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## قواعد هذا المشروع

- الواجهة عربية أولاً: `lang="ar"` و`dir="rtl"` على `<html>`، وكل النصوص الظاهرة للمستخدم بالعربية.
- استخدم مكوّنات `src/components/ui` و`container-page` و`card-surface` قبل كتابة أنماط جديدة.
- الألوان والخطوط والحواف تُعرَّف كـ tokens في `src/app/globals.css` (`@theme`)، لا تكتب ألواناً عشوائية.
- لا تضف مكتبات واجهة ثقيلة (مثل مكتبات مكوّنات كاملة) بدون موافقة؛ ابنِ ما تحتاجه فقط.
- الصفحات مكوّنات خادم افتراضياً. أضف `"use client"` فقط عند الحاجة لتفاعل أو hooks.
- المسارات الديناميكية: `params` و`searchParams` غير متزامنة (`await`). استخدم `proxy.ts` بدل `middleware.ts`.
- قبل إنهاء أي مهمة: `pnpm lint && pnpm typecheck && pnpm build && pnpm test`.
- للنشر: Cloudflare عبر `pnpm cf:deploy`، أو GitHub Pages عبر `pnpm build:static`.
- لا ترفع أسراراً إلى Git. استخدم `.env.local` أو أسرار GitHub/Cloudflare.
- اقرأ `README.md` و`docs/` في مجلد المشروع قبل تغيير الإعدادات.
