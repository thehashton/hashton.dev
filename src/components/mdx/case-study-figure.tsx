import Image from "next/image";

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

export function CaseStudyFigure({
  src,
  alt,
  caption,
  className,
  aspect = "wide",
}: CaseStudyFigureProps) {
  return (
    <figure className={cn("my-10", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-ink/10 bg-muted shadow-card",
          aspectClass[aspect],
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill={aspect !== "auto"}
          width={aspect === "auto" ? 1800 : undefined}
          height={aspect === "auto" ? 1000 : undefined}
          className={cn(aspect === "auto" ? "h-auto w-full" : "object-cover object-top")}
          sizes="(max-width: 900px) 100vw, 900px"
        />
      </div>
      {caption ? (
        <figcaption className="caption-mono mt-3 text-center text-ink-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
