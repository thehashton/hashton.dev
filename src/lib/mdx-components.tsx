import Link from "next/link";
import type { ComponentProps } from "react";

import { CaseStudyFigure } from "@/components/mdx/case-study-figure";
import { MdxInlineCode, MdxPre } from "@/components/mdx/mdx-pre";
import { cn } from "@/lib/utils";

type MDXComponentMap = NonNullable<
  ComponentProps<(typeof import("@mdx-js/react"))["MDXProvider"]>["components"]
>;

export const mdxComponents: MDXComponentMap = {
  CaseStudyFigure,
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "mt-14 mb-5 border-b border-ink/10 pb-3 font-sans text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-tight tracking-tight text-ink first:mt-0 sm:mt-16",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "caption-mono mt-8 mb-3 font-semibold tracking-[0.16em] text-secondary",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "mb-6 w-full text-[1.0625rem] leading-[1.75] text-ink-700 sm:text-[1.125rem]",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "mb-8 w-full list-none space-y-3 rounded-xl border border-ink/10 bg-surface/80 p-5 text-[1.0625rem] leading-[1.7] text-ink-700 shadow-sm sm:p-6 sm:text-[1.125rem]",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li
      className={cn(
        "relative pl-6 before:absolute before:left-0 before:font-mono before:text-accent before:content-['—']",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, href, ...props }) => {
    const isExternal = href?.startsWith("http");
    const cnCls = cn(
      "font-semibold text-ink underline decoration-accent underline-offset-4 transition-colors hover:text-ink",
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
    <strong className={cn("font-semibold text-ink", className)} {...props} />
  ),
  pre: (props) => <MdxPre {...props} />,
  code: (props) => <MdxInlineCode {...props} />,
};
