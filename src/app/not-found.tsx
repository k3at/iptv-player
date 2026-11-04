import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Container } from "@/components/ui/layout";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="grid flex-1 place-items-center py-24">
        <Container className="text-center">
          <p className="text-brand-600 text-sm font-bold">خطأ 404</p>
          <h1 className="text-foreground mt-3 text-4xl font-extrabold">لم نجد هذه الصفحة</h1>
          <p className="text-muted mx-auto mt-4 max-w-md leading-7">
            قد يكون الرابط قديماً أو تم نقل الصفحة. يمكنك العودة إلى الصفحة الرئيسية والمتابعة من هناك.
          </p>
          <Link href="/" className={buttonClass("primary", "lg", "mt-8")}>
            العودة للرئيسية
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
