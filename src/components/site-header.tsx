import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-border-subtle bg-surface/80 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#main" className="flex items-center gap-2.5 font-bold">
          <span className="from-brand-600 to-accent-500 grid size-9 place-items-center rounded-xl bg-gradient-to-br text-sm text-white shadow-sm">
            ب
          </span>
          <span className="text-foreground">{site.name}</span>
        </a>

        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-white/5 dark:hover:text-brand-200 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#start" className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>
            ابدأ الآن
          </a>
        </div>
      </Container>
    </header>
  );
}
