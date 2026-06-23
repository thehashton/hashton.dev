import Link from "next/link";
import type { ComponentProps } from "react";

import { CaseStudyFigure } from "@/components/mdx/case-study-figure";
import { cn } from "@/lib/utils";

type MDXComponentMap = NonNullable<
  ComponentProps<(typeof import("@mdx-js/react"))["MDXProvider"]>["components"]
>;

export const mdxComponents: MDXComponentMap = {
  CaseStudyFigure,
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "font-sans text-[clamp(2.75rem,5vw,3.75rem)] leading-[1.05] mt-14 mb-6 border-b border-ink/10 pb-3 font-bold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "font-mono text-caption mt-10 mb-3 font-semibold tracking-[0.18em] text-ink-600 uppercase",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p className={cn("mb-5 max-w-prose text-[1.125rem] leading-relaxed text-ink-800", className)} {...props} />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mb-6 ml-1 max-w-prose list-none space-y-3 rounded-xl border border-ink/10 bg-surface p-6 shadow-card text-[1.125rem] leading-relaxed text-ink-800",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("relative pl-6 before:absolute before:left-0 before:font-mono before:text-accent before:content-['—']", className)} {...props} />
  ),
  a: ({ className, href, ...props }) => {
    const isExternal = href?.startsWith("http");
    const cnCls = cn(
      "font-semibold text-ink underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent-600",
      className,
    );
    if (href && !isExternal) {
      return <Link className={cnCls} href={href} {...props} />;
    }
    return (
      <a className={cnCls} href={href} target="_blank" rel="noreferrer noopener" {...props} />
    );
  },
  strong: ({ className, ...props }) => (
    <strong className={cn("font-bold text-ink", className)} {...props} />
  ),
};
