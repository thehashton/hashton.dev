import Image from "next/image";
import Link from "next/link";

import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { shellClass } from "@/lib/layout-shell";
import { getWorkMetaList } from "@/lib/work";
import { cn } from "@/lib/utils";

function workLogoFrameClass(slug: string) {
  return slug === "inkwarden" || slug === "lucid"
    ? "border-zinc-800/90 bg-zinc-950"
    : "border-ink/10 bg-paper";
}

function workLogoPaddingClass(slug: string) {
  return slug === "inkwarden" ? "rounded-xl p-2.5" : slug === "lucid" ? "rounded-xl p-1.5" : "rounded-xl p-2";
}

export async function WorkSection() {
  const items = getWorkMetaList();

  return (
    <section id="work" className="scroll-mt-28 w-full min-w-0 border-b border-ink/10 bg-paper pt-8 pb-10 md:pt-10 md:pb-16 lg:pt-10 lg:pb-16">
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="Selected work" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-sans text-[2.5rem] font-bold leading-none tracking-tight text-ink md:text-[3rem]">
              Proof in production.
            </h2>
            <p className="caption-mono max-w-md text-ink-600">
              Case studies are narrative wrappers around constraints — accessibility, architecture, and taste under
              pressure.
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:gap-7 md:mt-14 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {items.map((w, i) => (
            <li key={w.slug} className="min-w-0">
              <Reveal delay={i * 0.05} className="h-full">
                <article
                  className={cn(
                    "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card transition-shadow duration-200 hover:shadow-card-hover",
                  )}
                >
                  <Link
                    href={`/work/${w.slug}`}
                    aria-label={`Read case study: ${w.title}`}
                    className="relative z-0 block w-full shrink-0 border-b border-ink/10 bg-muted outline-none ring-offset-2 ring-offset-surface focus-visible:ring-2 focus-visible:ring-ink/30"
                  >
                    {w.preview ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={w.preview}
                          alt=""
                          role="presentation"
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>
                    ) : w.logo ? (
                      <div
                        className={cn(
                          "relative flex aspect-[16/10] items-center justify-center",
                          workLogoFrameClass(w.slug),
                        )}
                      >
                        <div className="relative h-[4.5rem] w-[5.5rem] overflow-hidden sm:h-20 sm:w-24">
                          <Image
                            src={w.logo}
                            alt=""
                            role="presentation"
                            fill
                            className={cn("object-contain", workLogoPaddingClass(w.slug))}
                            sizes="96px"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-muted" aria-hidden />
                    )}
                  </Link>

                  <div className="relative flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <p className="caption-mono shrink-0 text-ink-500">{w.year}</p>
                      <div className="flex min-w-0 flex-wrap justify-end gap-1">
                        {w.role.split(/,\s*/).map((raw, idx) => {
                          const part = raw.trim();
                          if (!part) return null;
                          return (
                            <span
                              key={`${w.slug}-role-${idx}`}
                              className="font-mono inline-flex max-w-full shrink-0 items-center whitespace-nowrap rounded-full border border-ink/10 bg-muted px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-ink"
                            >
                              {part}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <h3 className="mt-3 font-sans text-xl font-bold leading-tight tracking-tight text-ink sm:text-[1.375rem]">
                      <Link
                        href={`/work/${w.slug}`}
                        className="outline-none transition-colors hover:text-accent-600 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      >
                        {w.title}
                      </Link>
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {w.stack.split(/,\s*/).map((raw) => {
                        const tag = raw.trim();
                        if (!tag) return null;
                        return (
                          <span
                            key={`${w.slug}-${tag}`}
                            className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[9px] font-semibold uppercase leading-none tracking-[0.12em] text-accent sm:text-[10px]"
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    <p className="mt-4 flex-1 text-base leading-relaxed text-ink-800">{w.excerpt}</p>

                    <div className="relative mt-6 flex flex-col gap-2.5">
                      {w.cardHref ? (
                        <Link
                          href={w.cardHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-transparent bg-strong px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-on-strong shadow-sm transition-colors hover:bg-strong/90 sm:text-sm"
                        >
                          {w.cardLabel ?? "Visit site →"}
                        </Link>
                      ) : null}
                      <Link
                        href={`/work/${w.slug}`}
                        className={cn(
                          "font-mono inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition-colors sm:text-sm",
                          w.cardHref
                            ? "border-2 border-ink/15 bg-paper text-ink shadow-sm hover:border-accent/45 hover:bg-accent/10 hover:text-accent-600"
                            : "border border-transparent bg-accent text-accent-foreground shadow-md hover:bg-accent-600 hover:shadow-lg",
                        )}
                      >
                        Read case study →
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
