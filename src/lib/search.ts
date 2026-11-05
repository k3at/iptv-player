/** يوحّد النص العربي (إزالة التشكيل وتوحيد الألف والياء والتاء المربوطة) لبحث متسامح. */
export function normalizeArabic(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

/** هل تطابق إحدى القيم نص البحث؟ (بعد التطبيع) */
export function matchesQuery(query: string, ...values: string[]): boolean {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery) return true;
  return values.some((value) => normalizeArabic(value).includes(normalizedQuery));
}
