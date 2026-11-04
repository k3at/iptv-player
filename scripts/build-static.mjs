import { spawnSync } from "node:child_process";
import path from "node:path";

/**
 * بناء نسخة ثابتة (Static Export) للنشر على GitHub Pages.
 *
 * الاستخدام:
 *   pnpm build:static            // بدون مسار فرعي
 *   pnpm build:static my-repo    // نشر تحت https://user.github.io/my-repo
 */
const raw = process.argv[2] ?? process.env.BASE_PATH ?? "";
const basePath = raw ? (raw.startsWith("/") ? raw : `/${raw}`) : "";
const nextBin = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");

console.log(`[build:static] basePath = "${basePath || "(root)"}"`);

const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    STATIC_EXPORT: "1",
    BASE_PATH: basePath,
  },
});

if (result.status !== 0) {
  console.error("[build:static] فشل البناء.");
  process.exit(result.status ?? 1);
}

console.log("[build:static] تم إنشاء الملفات في: out/");
