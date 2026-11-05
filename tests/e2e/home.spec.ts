import { expect, test, type Page } from "@playwright/test";

const samplePlaylist = `#EXTM3U
#EXTINF:-1 tvg-id="test-1" group-title="مجموعة الاختبار",قناة الاختبار الأولى
https://example.com/stream-1.m3u8
#EXTINF:-1 tvg-id="test-2" group-title="مجموعة الاختبار",قناة الاختبار الثانية
https://example.com/stream-2.m3u8`;

/** يحجب الطلبات الخارجية ليبقى الاختبار سريعاً وحتمياً. */
async function blockExternalRequests(page: Page) {
  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith("http://127.0.0.1") || url.startsWith("http://localhost")) {
      return route.continue();
    }
    return route.abort();
  });
}

test.describe("مشغّل IPTV", () => {
  test("يفتح بالعربية واتجاه RTL", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("مشغّل IPTV");
    await expect(page).toHaveTitle(/مشغّل IPTV/);
  });

  test("تُحمَّل القائمة التجريبية تلقائياً", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "القنوات" })).toBeVisible();
    await expect(page.getByRole("combobox", { name: "القائمة النشطة" })).toHaveValue("demo");
    await expect(
      page.getByRole("button", { name: "Big Buck Bunny HLS", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Tears of Steel HLS", exact: true }),
    ).toBeVisible();
  });

  test("البحث يرشّح القنوات", async ({ page }) => {
    await page.goto("/");

    const search = page.getByLabel("ابحث عن قناة");
    await search.fill("Sintel");
    await expect(
      page.getByRole("button", { name: "Sintel Trailer MP4", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Big Buck Bunny HLS", exact: true })).toHaveCount(
      0,
    );

    await search.fill("");
    await expect(
      page.getByRole("button", { name: "Big Buck Bunny HLS", exact: true }),
    ).toBeVisible();
  });

  test("تصفية المجموعات تعمل", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("combobox", { name: "المجموعة" }).selectOption({ label: "بث HLS تجريبي" });
    await expect(
      page.getByRole("button", { name: "Big Buck Bunny HLS", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sintel Trailer MP4", exact: true })).toHaveCount(
      0,
    );
  });

  test("المفضلة تُضاف وتَبقى بعد إعادة التحميل", async ({ page }) => {
    await page.goto("/");

    const star = page.getByRole("button", { name: "المفضلة: Big Buck Bunny HLS" });
    await star.click();
    await expect(star).toHaveAttribute("aria-pressed", "true");

    await page.reload();
    await expect(page.getByRole("button", { name: "المفضلة: Big Buck Bunny HLS" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.getByRole("button", { name: "المفضلة فقط" }).click();
    await expect(
      page.getByRole("button", { name: "Big Buck Bunny HLS", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Sintel Trailer MP4", exact: true })).toHaveCount(
      0,
    );
  });

  test("إضافة قائمة باللصق تعرض قنواتها", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "إضافة قائمة" }).click();
    await page.getByRole("tab", { name: "لصق نص" }).click();
    await page.getByLabel(/محتوى القائمة/).fill(samplePlaylist);
    await page.getByRole("button", { name: "حفظ القائمة" }).click();

    await expect(
      page.getByRole("button", { name: "قناة الاختبار الأولى", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("combobox", { name: "القائمة النشطة" })).not.toHaveValue("demo");
  });

  test("رابط غير صالح يعرض رسالة خطأ واضحة", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "إضافة قائمة" }).click();
    await page.getByLabel(/رابط القائمة/).fill("not-a-valid-url");
    await page.getByRole("button", { name: "حفظ القائمة" }).click();

    await expect(page.getByRole("dialog").getByRole("alert")).toContainText("http");
  });

  test("إضافة قائمة Xtream Codes تجلب القنوات", async ({ page }) => {
    await page.route(/get\.php\?/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "audio/x-mpegurl",
        headers: { "access-control-allow-origin": "*" },
        body: `#EXTM3U
#EXTINF:-1 group-title="رياضة",قناة Xtream الأولى
http://server.example:8080/live/user1/pass1/1.m3u8
#EXTINF:-1 group-title="رياضة",قناة Xtream الثانية
http://server.example:8080/live/user1/pass1/2.m3u8`,
      }),
    );

    await page.goto("/");
    await page.getByRole("button", { name: "إضافة قائمة" }).click();
    await page.getByRole("tab", { name: "Xtream Codes" }).click();
    await page.getByLabel(/عنوان الخادم/).fill("server.example:8080");
    await page.getByLabel("اسم المستخدم").fill("user1");
    await page.getByLabel("كلمة المرور").fill("pass1");
    await page.getByRole("button", { name: "حفظ القائمة" }).click();

    await expect(
      page.getByRole("button", { name: "قناة Xtream الأولى", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("combobox", { name: "القائمة النشطة" })).not.toHaveValue("demo");
  });

  test("Xtream ببيانات خاطئة يعرض رسالة واضحة", async ({ page }) => {
    await page.route(/get\.php\?/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/plain",
        headers: { "access-control-allow-origin": "*" },
        body: "Invalid username or password",
      }),
    );
    await page.route(/player_api\.php\?/, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: JSON.stringify({ user_info: { auth: 0 } }),
      }),
    );

    await page.goto("/");
    await page.getByRole("button", { name: "إضافة قائمة" }).click();
    await page.getByRole("tab", { name: "Xtream Codes" }).click();
    await page.getByLabel(/عنوان الخادم/).fill("server.example:8080");
    await page.getByLabel("اسم المستخدم").fill("wrong");
    await page.getByLabel("كلمة المرور").fill("bad");
    await page.getByRole("button", { name: "حفظ القائمة" }).click();

    await expect(page.getByRole("dialog").getByRole("alert")).toContainText("بيانات الدخول");
  });

  test("اختيار قناة يحدّث المشغّل", async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto("/");

    await page.getByRole("button", { name: "Big Buck Bunny HLS", exact: true }).click();

    await expect(page.locator("[data-current-channel]")).toHaveText("Big Buck Bunny HLS");
    await expect(page.locator("[data-player-status]")).toHaveAttribute(
      "data-player-status",
      /idle|loading|playing|paused|error/,
    );
  });

  test("حذف القائمة الحالية ثم استعادة التجريبية", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "حذف القائمة الحالية" }).click();
    await page.getByRole("button", { name: "نعم، احذف" }).click();
    await expect(page.getByText(/لا توجد قوائم/)).toBeVisible();

    await page.getByRole("button", { name: "استعادة التجريبية" }).click();
    await expect(
      page.getByRole("button", { name: "Big Buck Bunny HLS", exact: true }),
    ).toBeVisible();
  });

  test("الوضع الداكن يُفعّل ويُحفظ بعد إعادة التحميل", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /الوضع/ });
    await expect(toggle).toHaveAttribute("data-ready", "true");
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("واجهة الصحة ترجع JSON سليماً", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("ok");
  });
});
