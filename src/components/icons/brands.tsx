import { siInstagram, siX, siYoutube } from "simple-icons";

import { cn } from "@/lib/utils";

export type BrandName = "x" | "github" | "linkedin" | "instagram" | "youtube";

const svgBase = "block size-full origin-center";

/** Subtle per-mark optical tuning inside a fixed icon box. */
export const brandOpticalClass: Record<BrandName, string> = {
  x: "scale-[0.98]",
  github: "scale-[1.04]",
  linkedin: "scale-[1.06]",
  instagram: "scale-[0.96]",
  youtube: "scale-[1.08]",
};

export function BrandIcon({
  name,
  size = "md",
  className,
  title,
}: {
  name: BrandName;
  size?: "sm" | "md";
  className?: string;
  title?: string;
}) {
  const boxClass = size === "md" ? "size-6" : "size-4";
  const glyphClass =
    name === "youtube"
      ? size === "md"
        ? "size-[1.45rem]"
        : "size-[0.95rem]"
      : size === "md"
        ? "size-[1.35rem]"
        : "size-3.5";

  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", boxClass, className)}
      aria-hidden={title ? undefined : true}
    >
      <span className={cn("inline-flex items-center justify-center", glyphClass, brandOpticalClass[name])}>
        {name === "x" ? <IconX title={title} /> : null}
        {name === "github" ? <IconGithub title={title} /> : null}
        {name === "linkedin" ? <IconLinkedIn title={title} /> : null}
        {name === "instagram" ? <IconInstagram title={title} /> : null}
        {name === "youtube" ? <IconYoutube title={title} /> : null}
      </span>
    </span>
  );
}

export function IconX({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg className={cn(svgBase, className)} viewBox="0 0 24 24" aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path fill="currentColor" d={siX.path} />
    </svg>
  );
}

export function IconInstagram({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg className={cn(svgBase, className)} viewBox="0 0 24 24" aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path fill="currentColor" d={siInstagram.path} />
    </svg>
  );
}

export function IconYoutube({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg className={cn(svgBase, className)} viewBox="0 0 24 24" aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path fill="currentColor" d={siYoutube.path} />
    </svg>
  );
}

export function IconGithub({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg className={cn(svgBase, className)} viewBox="0 0 24 24" aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.57.1.78-.25.78-.55 0-.27-.01-1.16-.01-2.1-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.69 0-1.26.45-2.29 1.2-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.75.8 1.2 1.83 1.2 3.09 0 4.42-2.7 5.39-5.28 5.67.42.36.8 1.08.8 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  );
}

export function IconLinkedIn({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg className={cn(svgBase, className)} viewBox="0 0 24 24" aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}
