"use client";

import type { SimpleIcon } from "simple-icons";

import { brandColorStyle, parseStackTags, type ResolvedStackTag } from "@/lib/stack-tags";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function BrandIcon({ icon, className }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}

function StackTagIconGlyph({ tag, className }: { tag: ResolvedStackTag; className?: string }) {
  if (tag.icon.type === "brand") {
    const color = brandColorStyle(tag.brandHex);
    return (
      <span className={cn("inline-flex shrink-0", color.className)} style={color.style}>
        <BrandIcon icon={tag.icon.icon} className={className} />
      </span>
    );
  }

  const Lucide = tag.icon.icon;
  const color = brandColorStyle(tag.icon.color);
  return (
    <span className={cn("inline-flex shrink-0", color.className)} style={color.style}>
      <Lucide className={className} aria-hidden />
    </span>
  );
}

type StackTagProps = {
  tag: ResolvedStackTag;
  size?: "sm" | "md";
  className?: string;
  iconOnly?: boolean;
};

export function StackTag({ tag, size = "sm", className, iconOnly = false }: StackTagProps) {
  const iconClass = iconOnly
    ? size === "sm"
      ? "size-4"
      : "size-5"
    : size === "sm"
      ? "size-3"
      : "size-3.5";
  const textClass =
    size === "sm"
      ? "text-[10px] tracking-[0.1em] sm:text-[11px]"
      : "text-[11px] tracking-[0.11em] sm:text-xs";

  if (iconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full border border-ink/15 bg-surface p-2 shadow-sm transition-all duration-200 hover:scale-110 hover:border-ink/25 hover:shadow-md",
              className,
            )}
            aria-label={tag.label}
          >
            <StackTagIconGlyph tag={tag} className={iconClass} />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <span>{tag.label}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-ink/15 bg-surface px-2.5 py-1 font-mono font-semibold uppercase leading-none text-ink shadow-sm",
        textClass,
        className,
      )}
    >
      <StackTagIconGlyph tag={tag} className={iconClass} />
      <span className="truncate">{tag.label}</span>
    </span>
  );
}

type StackTagListProps = {
  stack: string;
  size?: "sm" | "md";
  className?: string;
  iconOnly?: boolean;
};

export function StackTagList({ stack, size = "sm", className, iconOnly = false }: StackTagListProps) {
  const tags = parseStackTags(stack);

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <StackTag key={tag.label} tag={tag} size={size} iconOnly={iconOnly} />
      ))}
    </div>
  );
}
