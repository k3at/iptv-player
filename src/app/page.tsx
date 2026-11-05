import type { Metadata } from "next";
import { IptvApp } from "@/components/player/iptv-app";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Container } from "@/components/ui/layout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1 pb-16">
        <section className="relative overflow-hidden border-b border-border-subtle">
          <div
            className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-60"
            aria-hidden="true"
          />
          <Container className="relative py-10 sm:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-raised px-3 py-1 text-xs font-medium text-muted">
                <span className="size-2 rounded-full bg-accent-500" aria-hidden="true" />
                مجاني • يعمل بالكامل داخل متصفحك
              </span>
              <h1 className="mt-5 text-3xl leading-tight font-extrabold text-balance text-foreground sm:text-4xl lg:text-5xl">
                مشغّل IPTV في المتصفح
                <span className="block bg-gradient-to-l from-brand-600 to-accent-500 bg-clip-text text-transparent">
                  أضف قائمتك… وشاهد فوراً
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
                شغّل قوائم m3u/m3u8 من رابط أو ملف أو باللصق، وتصفّح القنوات والمجموعات، وأضف
                المفضلة — دون تثبيت أي برنامج، ودون رفع بياناتك إلى أي خادم.
              </p>
            </div>
          </Container>
        </section>

        <section className="pt-6 sm:pt-8">
          <Container>
            <IptvApp />
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
