type ClassValue = string | false | null | undefined;

/** يجمع أسماء الأصناف ويتجاهل القيم الفارغة. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
