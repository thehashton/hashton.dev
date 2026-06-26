import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { CaseStudyPreview } from "@/components/work/case-study-preview";
import { ExternalProjectLink } from "@/components/work/external-project-link";
import { StackTagList } from "@/components/ui/stack-tag";
import { shellCaseStudyClass } from "@/lib/layout-shell";
import { getWorkBySlug, getWorkSlugs } from "@/lib/work";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function workLogoContainerClass(slug: string) {
  if (slug === "lucid") return "border-0 bg-transparent shadow-none";
  if (slug === "inkwarden") return "border border-zinc-800/90 bg-zinc-950 shadow-sm";
  return "border border-ink/10 bg-paper shadow-sm";
}

function workLogoSizeClass(slug: string) {
  if (slug === "lucid") return "h-20 w-52 sm:h-24 sm:w-60 md:h-28 md:w-72";
  return "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28";
}

function workLogoPaddingClass(slug: string) {
  if (slug === "lucid") return "";
  if (slug === "inkwarden") return "rounded-xl p-2.5";
  return "rounded-xl p-2";
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
    <article className={cn(shellCaseStudyClass, "py-8 md:py-12 lg:py-14")}>
      <header className="border-b border-ink/10 pb-8 text-center md:pb-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center justify-between gap-3 border-b border-ink/10 pb-4 sm:mb-7"
        >
          <Link
            href="/work"
            className="font-mono inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-semibold leading-none text-ink transition-colors hover:text-accent-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:text-[0.8125rem]"
          >
            <ArrowLeft className="size-3.5 shrink-0" aria-hidden />
            All work
          </Link>
          <p className="font-mono shrink-0 text-xs font-bold leading-none tracking-normal text-ink-600 sm:text-[0.8125rem]">
            {page.frontmatter.year}
          </p>
        </nav>

        {page.frontmatter.logo ? (
          <div className="flex justify-center">
            <div
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl",
                workLogoSizeClass(page.slug),
                workLogoContainerClass(page.slug),
              )}
            >
              <Image
                src={page.frontmatter.logo}
                alt={`Logo for ${page.frontmatter.title}`}
                fill
                className={cn("object-contain", workLogoPaddingClass(page.slug))}
                sizes="(max-width: 768px) 240px, 288px"
              />
            </div>
          </div>
        ) : null}

        <div className={cn("w-full", page.frontmatter.logo ? "mt-5 md:mt-6" : "")}>
          <h1 className="font-sans text-[clamp(2rem,4.5vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-ink">
            {page.frontmatter.title}
          </h1>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:mt-5">
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

          <StackTagList stack={page.frontmatter.stack} size="md" className="mt-3 justify-center" />

          <p className="mx-auto mt-4 w-full max-w-none text-lg leading-relaxed text-ink-700 sm:mt-5 md:text-[1.125rem] md:leading-[1.75]">
            {page.frontmatter.excerpt}
          </p>

          {page.frontmatter.cardHref ? (
            <div className="mt-6 flex justify-center">
              <ExternalProjectLink
                href={page.frontmatter.cardHref}
                label={page.frontmatter.cardLabel ?? "Visit site →"}
                className="sm:w-auto sm:min-w-[14rem]"
              />
            </div>
          ) : null}
        </div>
      </header>

      {page.frontmatter.preview ? (
        <CaseStudyPreview
          src={page.frontmatter.preview}
          title={page.frontmatter.title}
          caption={page.frontmatter.previewCaption}
        />
      ) : null}

      <div className="case-study-body mt-12 md:mt-14">{page.content}</div>
    </article>
  );
}
