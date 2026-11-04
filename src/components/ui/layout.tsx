import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={cn("card-surface p-6", className)}>{children}</article>;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "border-border-subtle bg-surface-raised text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-brand-600 dark:text-brand-300 text-sm font-bold tracking-wide">{eyebrow}</p>
      <h2 className="text-foreground mt-3 text-3xl font-bold text-balance sm:text-4xl">{title}</h2>
      <p className="text-muted mt-4 text-base leading-7">{description}</p>
    </div>
  );
}
