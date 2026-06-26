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
import { brandColorStyle } from "@/lib/stack-tags";
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

export function HeroSkills() {
  return (
    <div className="border-t border-ink/10 pt-5 max-sm:pt-6 md:pt-6">
      <p className="caption-mono text-secondary max-sm:text-center sm:text-left">Stack</p>
      <ul className="mt-4 grid w-full grid-cols-3 gap-2 max-sm:mt-5 sm:grid-cols-5 sm:gap-3 md:grid-cols-9">
        {skills.map((s) => {
          const brandHex = "color" in s ? s.color : s.icon.hex;
          const color = brandColorStyle(brandHex);

          return (
            <li key={s.label} className="min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    style={color.style}
                    aria-label={s.label}
                    className={cn(
                      "group flex aspect-square w-full cursor-default items-center justify-center rounded-xl border border-ink/15 bg-surface p-2 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out sm:p-2.5",
                      "hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-md",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      "active:translate-y-0 active:scale-[0.98]",
                      color.className,
                    )}
                  >
                    <svg
                      className="size-7 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110 sm:size-8"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path fill="currentColor" d={s.icon.path} />
                    </svg>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={10}>
                  {s.label}
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
