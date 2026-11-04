import { Container } from "@/components/ui/layout";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-border-subtle mt-auto border-t py-10">
      <Container className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-start">
          <p className="text-foreground font-bold">{site.name}</p>
          <p className="text-muted mt-1 text-sm">{site.tagline}</p>
        </div>

        <nav aria-label="روابط التذييل" className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <a href="#features" className="text-muted hover:text-brand-600 transition-colors">
            المزايا
          </a>
          <a href={site.links.docs} className="text-muted hover:text-brand-600 transition-colors">
            التوثيق
          </a>
          <a href={site.links.github} className="text-muted hover:text-brand-600 transition-colors">
            GitHub
          </a>
        </nav>

        <p className="text-muted text-xs">
          © {new Date().getFullYear()} {site.name}. جميع الحقوق محفوظة.
        </p>
      </Container>
    </footer>
  );
}
