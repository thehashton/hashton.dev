import Link from "next/link";

import { SocialBrandIcon } from "@/components/social/social-brand-icon";
import { shellClass } from "@/lib/layout-shell";
import { sectionNav } from "@/lib/nav";
import { socialPlatforms } from "@/lib/social-platforms";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <div className={cn(shellClass, "grid gap-10 py-12 md:gap-12 md:py-16 md:grid-cols-[1.2fr_1fr]")}>
        <div>
          <p className="caption-mono text-ink-600">© {new Date().getFullYear()} Harry Ashton</p>
          <p className="mt-4 max-w-md font-sans text-[2rem] font-bold leading-none tracking-tight text-ink">
            Frontend leadership. Systems thinking. Delivery you can ship and measure.
          </p>
          <p className="caption-mono mt-6 text-ink-500">
            Built with Next.js 15 + Tailwind CSS v4 — brutalist by intent.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="caption-mono mb-4 text-ink-600">Sitemap</p>
            <ul className="space-y-2 font-mono text-caption tracking-[0.14em] text-ink uppercase">
              {sectionNav.map((item) => (
                <li key={item.id}>
                  <Link href={`#${item.id}`} className="hover:bg-ink hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="caption-mono mb-4 text-ink-600">Elsewhere</p>
            <ul className="grid gap-2 font-mono text-caption tracking-[0.14em] uppercase">
              {socialPlatforms.map((s) => (
                <li key={s.id}>
                  <Link
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="invert-hover inline-flex min-w-[11rem] items-center gap-3 border-2 border-ink px-3 py-2 sm:min-w-[12rem]"
                  >
                    <SocialBrandIcon brand={s.brand} className="size-4 shrink-0" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
