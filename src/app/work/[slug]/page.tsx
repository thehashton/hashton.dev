import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { shellProseClass } from "@/lib/layout-shell";
import { getWorkBySlug, getWorkSlugs } from "@/lib/work";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

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
      <Link href="/#work" className="caption-mono text-ink-600 hover:bg-ink hover:text-paper">
        ← Back to selected work
      </Link>

      <header className="mt-10 border-b-2 border-ink pb-10">
        <p className="caption-mono text-accent">{page.frontmatter.year}</p>
        <h1 className="mt-4 font-sans text-[2.75rem] font-bold leading-[1.05] tracking-tight text-ink md:text-[3.5rem]">
          {page.frontmatter.title}
        </h1>
        <div className="caption-mono mt-8 leading-relaxed text-ink-700">
          {page.frontmatter.role} — {page.frontmatter.stack}
        </div>
        <p className="mt-8 max-w-2xl text-[1.2rem] leading-relaxed text-ink-800">{page.frontmatter.excerpt}</p>
      </header>

      <div className="mt-14">{page.content}</div>
    </article>
  );
}
