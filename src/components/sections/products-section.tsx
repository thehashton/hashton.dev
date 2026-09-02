import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { shellClass } from "@/lib/layout-shell";
import { cn } from "@/lib/utils";

const products = [
  {
    id: "codeprepped",
    name: "CodePrepped",
    href: "https://codeprepped.com",
    description: "Daily frontend interview prep — flashcards, questions, and real-world scenarios to help engineers land roles.",
    type: "Product",
  },
  {
    id: "hashton-agency",
    name: "Hashton Agency",
    href: "https://www.hashton.agency",
    description: "Websites, apps, and automation for East Midlands businesses — practical digital services that work.",
    type: "Studio",
  },
] as const;

export function ProductsSection() {
  return (
    <section
      id="products"
      className="scroll-mt-28 w-full min-w-0 border-b border-ink/10 bg-paper pt-8 pb-10 md:pt-10 md:pb-16 lg:pt-10 lg:pb-16"
    >
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="Products & Studio" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-sans text-[2.5rem] font-bold leading-none tracking-tight text-ink md:text-[3rem]">
              Building for the long term.
            </h2>
            <p className="caption-mono max-w-md text-secondary">
              Products and services I&apos;ve founded and run alongside contract work.
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-14 md:grid-cols-2">
          {products.map((product, i) => (
            <li key={product.id} className="min-w-0">
              <Reveal delay={i * 0.05} className="h-full">
                <article
                  className={cn(
                    "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card transition-shadow duration-200 hover:shadow-card-hover",
                  )}
                >
                  <div className="relative flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-sans text-xl font-bold leading-tight tracking-tight text-ink sm:text-[1.375rem]">
                        <Link
                          href={product.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="outline-none transition-colors hover:text-accent-600 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <span className="font-mono inline-flex max-w-full shrink-0 items-center whitespace-nowrap rounded-full border border-ink/10 bg-muted px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-ink">
                        {product.type}
                      </span>
                    </div>

                    <p className="mt-4 flex-1 text-base leading-relaxed text-ink-700">{product.description}</p>

                    <div className="mt-6">
                      <Link
                        href={product.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "font-mono inline-flex min-h-10 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase leading-none tracking-[0.1em] transition-colors sm:text-xs",
                          "border border-transparent bg-accent text-accent-foreground shadow-md hover:bg-accent-600 hover:shadow-lg",
                        )}
                      >
                        <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                        Visit site
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
