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
        "inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-raised px-3 py-1 text-xs font-medium text-muted",
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
      <p className="text-sm font-bold tracking-wide text-brand-600 dark:text-brand-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold text-balance text-foreground sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-muted">{description}</p>
    </div>
  );
}
