"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { ImageLightbox } from "@/components/mdx/image-lightbox";

type CaseStudyPreviewProps = {
  src: string;
  title: string;
  caption?: string;
};

export function CaseStudyPreview({ src, title, caption }: CaseStudyPreviewProps) {
  const [open, setOpen] = useState(false);
  const alt = `Preview of ${title}`;
  const description = caption ?? alt;

  return (
    <figure className="not-prose mt-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[1024/590] w-full cursor-pointer overflow-hidden rounded-2xl border border-ink/10 bg-muted text-left shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        aria-label={`View larger: ${alt}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
          sizes="(max-width: 1100px) 100vw, 1100px"
          priority
        />
        <span className="absolute inset-0 bg-ink/0 transition-colors duration-200 group-hover:bg-ink/10" aria-hidden />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-surface/95 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink shadow-sm backdrop-blur-sm">
          <ZoomIn className="size-3.5" aria-hidden />
          Enlarge
        </span>
      </button>
      <figcaption className="mt-3 w-full text-center text-[1rem] leading-relaxed text-ink-700 sm:text-[1.0625rem]">
        {description}
      </figcaption>

      <ImageLightbox src={src} alt={alt} caption={description} open={open} onOpenChange={setOpen} />
    </figure>
  );
}
