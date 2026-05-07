import Link from "next/link";

import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { experience } from "@/lib/experience";
import { shellClass } from "@/lib/layout-shell";

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-28 border-b-2 border-ink bg-paper py-14 md:py-24 lg:py-28">
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="Experience" />
          <h2 className="font-sans text-[2.5rem] font-bold tracking-tight text-ink md:text-[3rem]">
            Roles that compound.
          </h2>
          <p className="caption-mono mt-6 max-w-2xl text-ink-600">
            From agency breadth → product depth → leadership tooling → founder-led product — without pretending each era was the same job.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col">
          {experience.map((job, i) => (
            <Reveal key={job.id} delay={i * 0.04}>
              <div className="flex gap-6 md:gap-10">
                <div className="flex w-11 shrink-0 flex-col items-center md:w-14">
                  <span className="caption-mono flex size-9 shrink-0 items-center justify-center border-2 border-ink bg-accent text-[10px] font-bold text-paper">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  {i < experience.length - 1 ? (
                    <div className="my-1 min-h-14 w-0 flex-1 border-l-2 border-dashed border-ink/40" />
                  ) : null}
                </div>

                <article className={i < experience.length - 1 ? "pb-16" : ""}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                    <h3 className="font-sans text-2xl font-bold tracking-tight text-ink">{job.role}</h3>
                    {job.href ? (
                      <Link
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm font-semibold tracking-wide text-ink underline decoration-accent underline-offset-4 hover:bg-ink hover:text-paper"
                      >
                        {job.company}
                      </Link>
                    ) : (
                      <span className="font-mono text-sm font-semibold tracking-wide">{job.company}</span>
                    )}
                  </div>
                  <p className="caption-mono mt-2 text-ink-600">
                    {job.period}, {job.location}
                  </p>
                  <p className="mt-4 max-w-3xl text-[1.125rem] leading-relaxed text-ink-800">{job.summary}</p>
                </article>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
