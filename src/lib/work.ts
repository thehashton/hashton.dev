import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/lib/mdx-components";

export type WorkFrontmatter = {
  title: string;
  year: string;
  role: string;
  stack: string;
  excerpt: string;
  order: number;
  /** Square mark on the work list (public path). */
  logo?: string;
  /** Wide screenshot or product preview on work cards (public path). */
  preview?: string;
  /** When set, the primary card button opens this URL (e.g. live product). */
  cardHref?: string;
  /** Label for `cardHref` (defaults to “Visit site →”). */
  cardLabel?: string;
};

const WORK_DIR = path.join(process.cwd(), "src/content/work");

export function getWorkSlugs(): string[] {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs
    .readdirSync(WORK_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getWorkMetaList(): (WorkFrontmatter & { slug: string })[] {
  const slugs = getWorkSlugs();
  return slugs
    .map((slug) => {
      const raw = fs.readFileSync(path.join(WORK_DIR, `${slug}.mdx`), "utf8");
      const { data } = matter(raw);
      return { ...(data as WorkFrontmatter), slug };
    })
    .sort((a, b) => a.order - b.order);
}

export async function getWorkBySlug(slug: string) {
  const fullPath = path.join(WORK_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { content, frontmatter } = await compileMDX({
    source: raw,
    options: { parseFrontmatter: true },
    components: mdxComponents,
  });
  return {
    content,
    frontmatter: frontmatter as WorkFrontmatter,
    slug,
  };
}
