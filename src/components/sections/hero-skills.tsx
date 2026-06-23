"use client";

import {
  siCss,
  siFigma,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siReact,
  siStorybook,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const skills = [
  { icon: siReact, label: "React" },
  { icon: siTypescript, label: "TypeScript" },
  { icon: siNextdotjs, label: "Next.js" },
  { icon: siJavascript, label: "JavaScript" },
  { icon: siTailwindcss, label: "Tailwind CSS" },
  { icon: siHtml5, label: "HTML" },
  { icon: siCss, label: "CSS", color: "1572B6" },
  { icon: siStorybook, label: "Storybook" },
  { icon: siFigma, label: "Figma" },
] as const;

/** True for near-black brand marks (e.g. Next.js) that need a light fallback in dark mode. */
function needsLightBrandInDark(hex: string) {
  const normalized = hex.padStart(6, "0").slice(0, 6);
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  const [R, G, B] = [r, g, b].map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
  return luminance < 0.12;
}

export function HeroSkills() {
  return (
    <div className="border-t border-ink/10 pt-5 max-sm:pt-6 md:pt-6">
      <p className="caption-mono text-ink-600 max-sm:text-center sm:text-left">Stack</p>
      <ul className="mt-4 grid w-full grid-cols-3 gap-x-1 gap-y-1 max-sm:mt-5 sm:mt-4 sm:grid-cols-5 sm:gap-3 md:grid-cols-9">
        {skills.map((s) => {
          const brandHex = "color" in s ? s.color : s.icon.hex;
          const lightInDark = needsLightBrandInDark(brandHex);

          return (
            <li key={s.label} className="min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    style={{
                      ["--brand" as never]: `#${brandHex}`,
                      ...(lightInDark ? { ["--brand-dark" as never]: "var(--color-ink)" } : {}),
                    }}
                    className={cn(
                      "group inline-flex aspect-square w-full items-center justify-center rounded-lg border-0 bg-transparent p-0.5 shadow-none transition-[transform,box-shadow,border-color,background-color,color] duration-200 hover:scale-[1.02] hover:bg-ink/5 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:rounded-xl sm:border sm:border-ink/10 sm:bg-surface sm:p-[0.15rem] sm:shadow-sm sm:hover:scale-[1.04] sm:hover:bg-muted sm:hover:[border-color:var(--brand)] sm:hover:[box-shadow:0_14px_34px_-18px_var(--brand)] sm:active:scale-[1.01] md:p-[0.2rem] dark:sm:border-ink/25 dark:sm:bg-muted dark:sm:hover:bg-muted/80",
                      lightInDark
                        ? "text-[var(--brand)] dark:text-[var(--brand-dark)]"
                        : "text-[var(--brand)]",
                    )}
                    aria-label={s.label}
                  >
                    <svg
                      className="size-10 shrink-0 transition-transform duration-200 group-hover:rotate-[-4deg] sm:size-7 md:size-7"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path fill="currentColor" d={s.icon.path} />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>{s.label}</TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
