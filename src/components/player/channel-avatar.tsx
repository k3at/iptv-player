"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** شعار القناة مع بديل تلقائي (الحرف الأول) عند غياب الشعار أو فشل تحميله. */
export function ChannelAvatar({
  name,
  logo,
  className,
}: {
  name: string;
  logo: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0) || "•";

  if (logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- شعارات القنوات روابط خارجية عشوائية لا يمكن تمريرها لـ next/image
      <img
        src={logo}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn(
          "size-10 shrink-0 rounded-lg border border-border-subtle bg-surface-raised object-contain",
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200",
        className,
      )}
    >
      {initial}
    </span>
  );
}
