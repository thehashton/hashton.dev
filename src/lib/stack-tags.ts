import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Accessibility, Bot, Code2, Terminal, TestTube2 } from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import {
  siCss,
  siFigma,
  siFramer,
  siGithub,
  siGithubactions,
  siGraphql,
  siHtml5,
  siJavascript,
  siJest,
  siMdx,
  siMui,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siPostgresql,
  siReact,
  siStorybook,
  siTailwindcss,
  siTestinglibrary,
  siTypescript,
  siVercel,
  siWebpack,
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
  "github api": { label: "GitHub API", brandHex: siGithub.hex, icon: { type: "brand", icon: siGithub } },
  ci: { label: "CI", brandHex: siGithubactions.hex, icon: { type: "brand", icon: siGithubactions } },
  "node js": { label: "Node.js", brandHex: siNodedotjs.hex, icon: { type: "brand", icon: siNodedotjs } },
  nodejs: { label: "Node.js", brandHex: siNodedotjs.hex, icon: { type: "brand", icon: siNodedotjs } },
  postgresql: { label: "PostgreSQL", brandHex: siPostgresql.hex, icon: { type: "brand", icon: siPostgresql } },
  postgres: { label: "PostgreSQL", brandHex: siPostgresql.hex, icon: { type: "brand", icon: siPostgresql } },
  webpack: { label: "Webpack", brandHex: siWebpack.hex, icon: { type: "brand", icon: siWebpack } },
  jest: { label: "Jest", brandHex: siJest.hex, icon: { type: "brand", icon: siJest } },
  graphql: { label: "GraphQL", brandHex: siGraphql.hex, icon: { type: "brand", icon: siGraphql } },
  openai: { label: "OpenAI", brandHex: "10A37F", icon: { type: "lucide", icon: Bot, color: "10A37F" } },
  "react testing library": { label: "Testing Library", brandHex: siTestinglibrary.hex, icon: { type: "brand", icon: siTestinglibrary } },
  vercel: { label: "Vercel", brandHex: siVercel.hex, icon: { type: "brand", icon: siVercel } },
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
