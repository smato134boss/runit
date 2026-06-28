"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher({ scrolled }: { scrolled?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (newLocale: string) => {
    if (newLocale === locale) return;
    // Replace locale prefix: /en/... → /fr/... or vice versa
    const withoutLocale = pathname.replace(/^\/(en|fr)/, "") || "/";
    router.push(`/${newLocale}${withoutLocale}`);
  };

  const textColor = scrolled ? "#78716C" : "rgba(255,255,255,0.75)";
  const activeColor = scrolled ? "#C2410C" : "#F97316";

  return (
    <div className="flex items-center gap-0.5 text-sm font-semibold">
      {(["en", "fr"] as const).map((lng, i) => (
        <button
          key={lng}
          onClick={() => switchTo(lng)}
          className="px-2 py-1 rounded transition-colors duration-150 border-0 bg-transparent cursor-pointer uppercase text-xs tracking-widest font-bold"
          style={{
            color: locale === lng ? activeColor : textColor,
            opacity: locale === lng ? 1 : 0.7,
          }}
        >
          {lng}
          {i === 0 && (
            <span style={{ color: textColor, opacity: 0.4, marginLeft: 4 }}>|</span>
          )}
        </button>
      ))}
    </div>
  );
}
