import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { shellProseClass } from "@/lib/layout-shell";
import { getWorkBySlug, getWorkSlugs } from "@/lib/work";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function workLogoFrameClass(slug: string) {
  return slug === "inkwarden" || slug === "lucid"
    ? "border-zinc-800/90 bg-zinc-950"
    : "border-ink/10 bg-paper";
}

function workLogoPaddingClass(slug: string) {
  return slug === "inkwarden" ? "rounded-xl p-2.5" : slug === "lucid" ? "rounded-xl p-1.5" : "rounded-xl p-2";
}

export async function generateStaticParams() {
  return getWorkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { frontmatter } = await getWorkBySlug(slug);
    return {
      title: `${frontmatter.title} — Harry Ashton`,
      description: frontmatter.excerpt,
      openGraph: {
        title: `${frontmatter.title} — Harry Ashton`,
        description: frontmatter.excerpt,
        url: `${site.url}/work/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function WorkCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let page;
  try {
    page = await getWorkBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className={cn(shellProseClass, "py-14 md:py-20 lg:py-24")}>
      <Link href="/work" className="caption-mono text-ink-600 transition-colors hover:text-accent-600">
        ← Back to selected work
      </Link>

      <header className="mt-10 border-b border-ink/10 pb-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          {page.frontmatter.logo ? (
            <div
              className={cn(
                "relative mx-auto h-24 w-28 shrink-0 overflow-hidden rounded-xl border shadow-sm sm:mx-0 sm:h-[6.25rem] sm:w-[7.25rem] md:h-28 md:w-32",
                workLogoFrameClass(page.slug),
              )}
            >
              <Image
                src={page.frontmatter.logo}
                alt={`Logo for ${page.frontmatter.title}`}
                fill
                className={cn("object-contain", workLogoPaddingClass(page.slug))}
                sizes="128px"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="caption-mono text-accent">{page.frontmatter.year}</p>
            <h1 className="mt-4 font-sans text-[2.75rem] font-bold leading-[1.05] tracking-tight text-ink md:text-[3.5rem]">
              {page.frontmatter.title}
            </h1>
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {page.frontmatter.role.split(/,\s*/).map((raw, idx) => {
                  const part = raw.trim();
                  if (!part) return null;
                  return (
                    <span
                      key={`role-${idx}`}
                      className="caption-mono inline-flex items-center rounded-full border border-ink/10 bg-muted px-2.5 py-1 text-ink"
                    >
                      {part}
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                {page.frontmatter.stack.split(/,\s*/).map((raw, idx) => {
                  const tag = raw.trim();
                  if (!tag) return null;
                  return (
                    <span
                      key={`stack-${idx}`}
                      className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1.5 font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.14em] text-accent sm:px-3 sm:text-[11px]"
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
            <p className="mt-8 max-w-2xl text-[1.2rem] leading-relaxed text-ink-800">{page.frontmatter.excerpt}</p>
            {page.frontmatter.cardHref ? (
              <a
                href={page.frontmatter.cardHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-transparent bg-strong px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-on-strong shadow-sm transition-colors hover:bg-strong/90"
              >
                {page.frontmatter.cardLabel ?? "Visit site →"}
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {page.frontmatter.preview ? (
        <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-ink/10 bg-muted shadow-card">
          <Image
            src={page.frontmatter.preview}
            alt={`Preview of ${page.frontmatter.title}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
      ) : null}

      <div className="mt-14">{page.content}</div>
    </article>
  );
}
