import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge, Card, Container, SectionHeading } from "@/components/ui/layout";
import { buttonClass } from "@/components/ui/button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
};

const features = [
  {
    title: "عربي أولاً (RTL)",
    body: "اتجاه صحيح من الجذر، خطوط عربية محسّنة، ونصوص متوازنة على كل المقاسات.",
    icon: "M4 6h16M4 12h10M4 18h16",
  },
  {
    title: "نظام تصميم موحّد",
    body: "ألوان وخطوط وحواف ومساحات معرّفة كـ tokens في Tailwind، مع مكوّنات قابلة لإعادة الاستخدام.",
    icon: "M12 3v18M3 12h18",
  },
  {
    title: "وضع داكن حقيقي",
    body: "تبديل فوري مع حفظ الاختيار واحترام إعدادات النظام، بدون وميض عند التحميل.",
    icon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z",
  },
  {
    title: "أداء وإتاحة",
    body: "مكوّنات خادم افتراضياً، صور محسّنة، وتباين ونقاط تركيز تلبي معايير WCAG.",
    icon: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z",
  },
  {
    title: "اختبارات جاهزة",
    body: "Playwright يغطي الصفحة الرئيسية والاتجاه وواجهة JSON وتبديل الوضع الداكن.",
    icon: "m9 12 2 2 4-4M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
  },
  {
    title: "نشر مجاني بضغطة",
    body: "إعداد جاهز لـ Cloudflare Workers وGitHub Pages مع سير عمل آلي عبر GitHub Actions.",
    icon: "M12 16V4m0 0L7 9m5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  },
] as const;

const steps = [
  {
    title: "ابدأ من القالب",
    body: "شغّل سكربت إنشاء المشروع، وسيُنسخ القالب باسمك وتُثبّت الحزم ويُهيّأ Git تلقائياً.",
  },
  {
    title: "ابنِ صفحتك",
    body: "عدّل src/app/page.tsx وأضف صفحاتك ومكوّناتك. القواعد والأدوات جاهزة في AGENTS.md.",
  },
  {
    title: "اختبر ثم انشر",
    body: "شغّل pnpm test وpnpm build، ثم انشر مجاناً على Cloudflare أو GitHub Pages.",
  },
] as const;

const faqs = [
  {
    q: "هل يعمل على استضافة مجانية بالكامل؟",
    a: "نعم. Cloudflare Workers تمنح 100 ألف طلب يومياً مجاناً، وGitHub Pages مجاني للمواقع الثابتة. لا تحتاج بطاقة ائتمان للتجربة.",
  },
  {
    q: "هل يمكن إضافة قاعدة بيانات؟",
    a: "نعم، Cloudflare D1 (SQLite) أو KV أو R2 متاحة بخطة مجانية سخية، وتُربط بالمشروع عبر wrangler.jsonc.",
  },
  {
    q: "ماذا لو احتجت APIs وخادماً؟",
    a: "استخدم نشر Cloudflare (OpenNext) فهو يدعم Route Handlers وServer Actions. أما GitHub Pages فهو للمحتوى الثابت فقط.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="relative overflow-hidden">
          <div className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div
            className="from-brand-200/40 to-accent-400/30 pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br blur-3xl"
            aria-hidden="true"
          />

          <Container className="relative py-20 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge>
                <span className="bg-accent-500 size-2 rounded-full" aria-hidden="true" />
                جاهز للإنتاج · Next.js 16 · Tailwind 4
              </Badge>

              <h1 className="text-foreground mt-6 text-4xl leading-tight font-extrabold text-balance sm:text-5xl lg:text-6xl">
                ابنِ واجهتك العربية
                <span className="from-brand-600 to-accent-500 block bg-gradient-to-l bg-clip-text text-transparent">
                  بسرعة، وبمعايير احترافية
                </span>
              </h1>

              <p className="text-muted mx-auto mt-6 max-w-2xl text-lg leading-8">
                قالب كامل بالعربية: تصميم متجاوب، وضع داكن، مكوّنات، اختبارات، ونشر مجاني. كل ما تحتاجه
                لتطلق فكرتك اليوم بدل إعداد الأدوات.
              </p>

              <div id="start" className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a href="#features" className={buttonClass("primary", "lg")}>
                  استكشف المزايا
                </a>
                <a href={site.links.docs} className={buttonClass("secondary", "lg")}>
                  اقرأ التوثيق
                </a>
              </div>

              <dl className="mt-14 grid grid-cols-3 gap-4 sm:gap-8">
                {[
                  { label: "زمن التحميل", value: "< 1s" },
                  { label: "تقييم الإتاحة", value: "100" },
                  { label: "تكلفة النشر", value: "0 ر.س" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <dt className="text-muted text-xs sm:text-sm">{stat.label}</dt>
                    <dd className="text-foreground mt-1 text-2xl font-extrabold sm:text-3xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        <section id="features" className="scroll-mt-24 py-20">
          <Container>
            <SectionHeading
              eyebrow="المزايا"
              title="أساس متين لكل مشروع"
              description="كل ميزة هنا مختبرة وتعمل، وليست مجرد كود نموذجي. انسخ الأساس وابنِ فوقه."
            />

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group transition-colors hover:border-brand-300">
                  <span className="bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 grid size-11 place-items-center rounded-xl">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
                      <path
                        d={feature.icon}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="text-foreground mt-5 text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted mt-2 text-sm leading-7">{feature.body}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <section id="steps" className="border-border-subtle scroll-mt-24 border-y py-20">
          <Container>
            <SectionHeading
              eyebrow="كيف تبدأ"
              title="ثلاث خطوات فقط"
              description="من الفكرة إلى رابط يعمل ومشاركته مع العالم، دون تعقيد."
            />

            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <Card className="h-full">
                    <span className="text-brand-600 dark:text-brand-300 text-sm font-extrabold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-foreground mt-3 text-lg font-bold">{step.title}</h3>
                    <p className="text-muted mt-2 text-sm leading-7">{step.body}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section id="faq" className="scroll-mt-24 py-20">
          <Container className="max-w-3xl">
            <SectionHeading eyebrow="الأسئلة الشائعة" title="إجابات سريعة" description="أهم ما يُسأل قبل الانطلاق." />

            <div className="divide-border-subtle card-surface mt-10 divide-y overflow-hidden">
              {faqs.map((faq) => (
                <details key={faq.q} className="group px-6 py-4">
                  <summary className="text-foreground flex cursor-pointer items-center justify-between gap-4 font-semibold">
                    {faq.q}
                    <span className="text-brand-600 transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="text-muted mt-3 text-sm leading-7">{faq.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>

        <section className="pb-20">
          <Container>
            <div className="from-brand-700 to-brand-900 relative overflow-hidden rounded-3xl bg-gradient-to-l px-6 py-14 text-center text-white">
              <div className="bg-grid absolute inset-0 opacity-30" aria-hidden="true" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-extrabold text-balance sm:text-4xl">جاهز لتبدأ مشروعك؟</h2>
                <p className="mt-4 text-base leading-7 text-indigo-100">
                  كل الأدوات مثبّتة، والقالب جاهز. أنشئ مشروعك الأول الآن وانشره مجاناً.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <a
                    href="#start"
                    className="text-brand-700 inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 font-semibold transition-colors hover:bg-indigo-50"
                  >
                    ابدأ الآن
                  </a>
                  <a
                    href={site.links.github}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/30 px-6 font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    شاهد على GitHub
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
