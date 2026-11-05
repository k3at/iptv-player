import { Container } from "@/components/ui/layout";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border-subtle py-8">
      <Container className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {site.name} — كل المعالجة تحدث داخل متصفحك.
        </p>
        <p className="text-xs text-muted">استخدم فقط قوائم وبثوثاً تملك حق الوصول إليها.</p>
      </Container>
    </footer>
  );
}
