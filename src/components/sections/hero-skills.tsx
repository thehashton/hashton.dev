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

const skills = [
  { icon: siReact, label: "React" },
  { icon: siTypescript, label: "TypeScript" },
  { icon: siNextdotjs, label: "Next.js" },
  { icon: siJavascript, label: "JavaScript" },
  { icon: siTailwindcss, label: "Tailwind CSS" },
  { icon: siHtml5, label: "HTML" },
  { icon: siCss, label: "CSS" },
  { icon: siStorybook, label: "Storybook" },
  { icon: siFigma, label: "Figma" },
] as const;

export function HeroSkills() {
  return (
    <div className="border-t border-ink/25 pt-6 md:pt-8">
      <p className="caption-mono text-ink-600">Stack</p>
      <ul className="mt-4 flex flex-wrap gap-3">
        {skills.map((s) => (
          <li key={s.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex size-12 items-center justify-center border-2 border-ink bg-paper text-ink shadow-[4px_4px_0_0_#0a0a0a] transition-colors hover:bg-ink hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={s.label}
                >
                  <svg className="size-6" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d={s.icon.path} />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>{s.label}</TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}
