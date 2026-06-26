"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { ImageLightbox } from "@/components/mdx/image-lightbox";
import { cn } from "@/lib/utils";

type CaseStudyFigureProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspect?: "video" | "wide" | "auto";
};

const aspectClass = {
  video: "aspect-video",
  wide: "aspect-[16/10]",
  auto: "aspect-auto min-h-[12rem]",
} as const;

function isAnimatedSrc(src: string) {
  return /\.gif($|[?#])/i.test(src);
}

const figureImageClass = (aspect: CaseStudyFigureProps["aspect"]) =>
  cn(
    aspect === "auto"
      ? "h-auto w-full"
      : "h-full w-full object-contain object-center",
    "transition-transform duration-300 group-hover:scale-[1.01]",
  );

export function CaseStudyFigure({
  src,
  alt,
  caption,
  className,
  aspect = "wide",
}: CaseStudyFigureProps) {
  const [open, setOpen] = useState(false);
  const animated = isAnimatedSrc(src);

  return (
    <>
      <figure className={cn("not-prose my-10 sm:my-12", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-ink/10 bg-muted text-left shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
            aspectClass[aspect],
          )}
          aria-label={`View larger: ${alt}`}
        >
          {animated || aspect === "auto" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className={figureImageClass(aspect)} decoding="async" loading="lazy" />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              className={figureImageClass(aspect)}
              sizes="(max-width: 1100px) 100vw, 1100px"
              unoptimized
            />
          )}
          <span className="absolute inset-0 bg-ink/0 transition-colors duration-200 group-hover:bg-ink/10" aria-hidden />
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface/90 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink shadow-sm backdrop-blur-sm">
            <ZoomIn className="size-3.5" aria-hidden />
            Enlarge
          </span>
        </button>
      {(caption || alt) ? (
        <figcaption className="mt-3 w-full text-center text-[1rem] leading-relaxed text-ink-700 sm:text-[1.0625rem]">
          {caption || alt}
        </figcaption>
      ) : null}
      </figure>

      <ImageLightbox src={src} alt={alt} caption={caption ?? alt} open={open} onOpenChange={setOpen} />
    </>
  );
}
