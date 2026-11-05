import { Container } from "@/components/ui/layout";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#main" className="flex items-center gap-2.5 font-bold">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="m17 2-5 5-5-5" />
            </svg>
          </span>
          <span className="text-foreground">{site.name}</span>
        </a>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
