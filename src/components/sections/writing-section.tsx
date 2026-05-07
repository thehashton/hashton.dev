import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { shellClass } from "@/lib/layout-shell";
import { writingLinks } from "@/lib/writing";

export function WritingSection() {
  return (
    <section id="writing" className="scroll-mt-28 border-b-2 border-ink bg-paper py-14 md:py-24 lg:py-28">
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="Writing" />
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-sans text-[2.5rem] font-bold tracking-tight text-ink md:text-[3rem]">
              LinkedIn essays.
            </h2>
            <p className="caption-mono max-w-md text-ink-600">
              Long-form posts where I talk hiring, craft, and what teams actually optimize for. MDX blog route can land here later.
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {writingLinks.map((post, i) => (
            <Reveal key={post.href} delay={i * 0.05}>
              <li>
                <Link
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col justify-between border-2 border-ink bg-paper p-6 shadow-[8px_8px_0_0_#0a0a0a] transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-ink hover:text-paper hover:shadow-[12px_12px_0_0_#f4f1ea]"
                >
                  <div>
                    <p className="caption-mono text-accent group-hover:text-paper">{post.topic}</p>
                    <p className="mt-4 font-sans text-xl font-bold tracking-tight">{post.title}</p>
                  </div>
                  <span className="caption-mono mt-8 inline-flex items-center gap-2 border border-current px-3 py-2">
                    Read on LinkedIn
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
