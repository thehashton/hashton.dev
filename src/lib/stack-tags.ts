import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  BookOpen,
  Bot,
  Boxes,
  Briefcase,
  Code2,
  LayoutDashboard,
  Map,
  PenLine,
  Puzzle,
  Terminal,
  TestTube2,
  Users,
} from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import {
  siCss,
  siFigma,
  siFramer,
  siGithub,
  siGithubactions,
  siHtml5,
  siJavascript,
  siMdx,
  siMui,
  siNextdotjs,
  siNpm,
  siReact,
  siStorybook,
  siTailwindcss,
  siTypescript,
  siVercel,
} from "simple-icons";

export type StackTagIcon =
  | { type: "brand"; icon: SimpleIcon; color?: string }
  | { type: "lucide"; icon: LucideIcon; color: string };

export type ResolvedStackTag = {
  label: string;
  brandHex: string;
  icon: StackTagIcon;
};

const CSS_BLUE = "1572B6";

/** Normalize stack tag strings from frontmatter for lookup. */
function normalizeTagKey(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+v\d+(\.\d+)*$/i, "")
    .replace(/\.js$/i, " js")
    .replace(/next\.js/gi, "nextjs")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const TAG_LOOKUP: Record<string, ResolvedStackTag> = {
  react: { label: "React", brandHex: siReact.hex, icon: { type: "brand", icon: siReact } },
  typescript: { label: "TypeScript", brandHex: siTypescript.hex, icon: { type: "brand", icon: siTypescript } },
  nextjs: { label: "Next.js", brandHex: siNextdotjs.hex, icon: { type: "brand", icon: siNextdotjs } },
  "next js": { label: "Next.js", brandHex: siNextdotjs.hex, icon: { type: "brand", icon: siNextdotjs } },
  "next js ecosystem": {
    label: "Next.js",
    brandHex: siNextdotjs.hex,
    icon: { type: "brand", icon: siNextdotjs },
  },
  javascript: { label: "JavaScript", brandHex: siJavascript.hex, icon: { type: "brand", icon: siJavascript } },
  "tailwind css": { label: "Tailwind CSS", brandHex: siTailwindcss.hex, icon: { type: "brand", icon: siTailwindcss } },
  html: { label: "HTML", brandHex: siHtml5.hex, icon: { type: "brand", icon: siHtml5 } },
  html5: { label: "HTML", brandHex: siHtml5.hex, icon: { type: "brand", icon: siHtml5 } },
  css: { label: "CSS", brandHex: CSS_BLUE, icon: { type: "brand", icon: siCss, color: CSS_BLUE } },
  storybook: { label: "Storybook", brandHex: siStorybook.hex, icon: { type: "brand", icon: siStorybook } },
  figma: { label: "Figma", brandHex: siFigma.hex, icon: { type: "brand", icon: siFigma } },
  mui: { label: "MUI", brandHex: siMui.hex, icon: { type: "brand", icon: siMui } },
  "framer motion": { label: "Framer Motion", brandHex: siFramer.hex, icon: { type: "brand", icon: siFramer } },
  mdx: { label: "MDX", brandHex: siMdx.hex, icon: { type: "brand", icon: siMdx } },
  npm: { label: "npm", brandHex: siNpm.hex, icon: { type: "brand", icon: siNpm } },
  github: { label: "GitHub", brandHex: siGithub.hex, icon: { type: "brand", icon: siGithub } },
  "github issues": { label: "GitHub Issues", brandHex: siGithub.hex, icon: { type: "brand", icon: siGithub } },
  ci: { label: "CI", brandHex: siGithubactions.hex, icon: { type: "brand", icon: siGithubactions } },
  playwright: {
    label: "Playwright",
    brandHex: "2EAD33",
    icon: { type: "lucide", icon: TestTube2, color: "2EAD33" },
  },
  "axe core": {
    label: "axe-core",
    brandHex: "0077C8",
    icon: { type: "lucide", icon: Accessibility, color: "0077C8" },
  },
  cli: { label: "CLI", brandHex: "64748B", icon: { type: "lucide", icon: Terminal, color: "64748B" } },
  "micro frontends": {
    label: "Micro-frontends",
    brandHex: "8B5CF6",
    icon: { type: "lucide", icon: Puzzle, color: "8B5CF6" },
  },
  maps: { label: "Maps", brandHex: "4285F4", icon: { type: "lucide", icon: Map, color: "4285F4" } },
  dashboards: {
    label: "Dashboards",
    brandHex: "0EA5E9",
    icon: { type: "lucide", icon: LayoutDashboard, color: "0EA5E9" },
  },
  "accessibility tooling": {
    label: "Accessibility",
    brandHex: "0077C8",
    icon: { type: "lucide", icon: Accessibility, color: "0077C8" },
  },
  accessibility: {
    label: "Accessibility",
    brandHex: "0077C8",
    icon: { type: "lucide", icon: Accessibility, color: "0077C8" },
  },
  "design systems": {
    label: "Design systems",
    brandHex: "EC4899",
    icon: { type: "lucide", icon: Boxes, color: "EC4899" },
  },
  testing: { label: "Testing", brandHex: "16A34A", icon: { type: "lucide", icon: TestTube2, color: "16A34A" } },
  ai: { label: "AI", brandHex: "10A37F", icon: { type: "lucide", icon: Bot, color: "10A37F" } },
  "writing tools": {
    label: "Writing tools",
    brandHex: "D97706",
    icon: { type: "lucide", icon: PenLine, color: "D97706" },
  },
  "lore worldbuilding": {
    label: "Worldbuilding",
    brandHex: "7C3AED",
    icon: { type: "lucide", icon: BookOpen, color: "7C3AED" },
  },
  curriculum: {
    label: "Curriculum",
    brandHex: "2563EB",
    icon: { type: "lucide", icon: BookOpen, color: "2563EB" },
  },
  community: { label: "Community", brandHex: "0891B2", icon: { type: "lucide", icon: Users, color: "0891B2" } },
  "career systems": {
    label: "Career systems",
    brandHex: "CA8A04",
    icon: { type: "lucide", icon: Briefcase, color: "CA8A04" },
  },
  "content architecture": {
    label: "Content",
    brandHex: siMdx.hex,
    icon: { type: "brand", icon: siMdx },
  },
  vercel: { label: "Vercel", brandHex: siVercel.hex, icon: { type: "brand", icon: siVercel } },
};

export function resolveStackTag(raw: string): ResolvedStackTag {
  const label = raw.trim();
  const key = normalizeTagKey(label);
  const hit = TAG_LOOKUP[key];
  if (hit) return hit;

  return {
    label,
    brandHex: "64748B",
    icon: { type: "lucide", icon: Code2, color: "64748B" },
  };
}

export function parseStackTags(stack: string): ResolvedStackTag[] {
  return stack
    .split(/,\s*/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map(resolveStackTag);
}

/** Brand marks darker than this need a lighter icon tint in dark mode. */
export function needsLightBrandInDark(hex: string) {
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

export function brandColorStyle(hex: string) {
  const lightInDark = needsLightBrandInDark(hex);
  return {
    style: {
      ["--brand" as never]: `#${hex}`,
      ...(lightInDark ? { ["--brand-dark" as never]: "var(--color-ink)" } : {}),
    } as CSSProperties,
    className: lightInDark ? "text-[var(--brand)] dark:text-[var(--brand-dark)]" : "text-[var(--brand)]",
  };
}
