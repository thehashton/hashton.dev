import Image from "next/image";
import Link from "next/link";

import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { experience } from "@/lib/experience";
import { shellClass } from "@/lib/layout-shell";
import { site } from "@/lib/site";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 w-full min-w-0 border-b border-ink/10 bg-paper pt-8 pb-10 md:pt-12 md:pb-16 lg:pt-10 lg:pb-16">
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="About" />
          <div className="grid min-w-0 gap-10 sm:gap-12 lg:grid-cols-[1fr_minmax(17rem,22rem)] lg:items-stretch lg:gap-14 xl:gap-16">
            <div className="flex min-w-0 flex-col gap-14 md:gap-16 lg:gap-20">
              <div className="max-w-3xl">
                <h2 className="font-sans text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.06] tracking-tight text-ink">
                  Engineer first.
                </h2>
                <p className="mt-4 font-sans text-2xl font-semibold leading-snug tracking-tight text-ink-700 md:mt-5 md:text-3xl">
                  Clarity under pressure.
                </p>
                <p className="mt-8 text-[1.125rem] leading-relaxed text-ink-800">
                  I&apos;m a senior frontend engineer with a long arc from agency throughput to product leadership:
                  {" "}
                  <strong className="text-ink">design systems</strong>,{" "}
                  <strong className="text-ink">accessibility engineering</strong>, and{" "}
                  <strong className="text-ink">micro-frontends</strong>
                  {" "}where teams need guardrails without slowing delivery.
                </p>
                <p className="mt-6 text-[1.125rem] leading-relaxed text-ink-800">
                  Today I&apos;m focused on{" "}
                  <strong className="text-ink">contract and consulting frontend work</strong>
                  {" "}
                  — delivery as a{" "}
                  <strong className="text-ink">senior individual contributor</strong>, sensible architecture, and
                  accessibility engineering teams can sustain. If you need someone who ships and explains trade-offs
                  without theatre, we&apos;ll get along.
                </p>
              </div>

              <div className="min-w-0">
                <p className="caption-mono mb-8 text-ink-500">Where I&apos;ve worked</p>
                <ul className="flex flex-col">
                  {experience.map((job, i) => (
                    <li key={job.id} className="flex gap-5 md:gap-6">
                      <div className="flex w-9 shrink-0 flex-col items-center self-stretch sm:w-10">
                        <div className="flex justify-center pt-2.5">
                          <span className="size-2.5 shrink-0 rounded-full border-2 border-ink/20 bg-accent shadow-[0_0_0_3px_var(--color-paper)]" />
                        </div>
                        {i < experience.length - 1 ? (
                          <div className="mx-auto mt-2 min-h-6 w-0 flex-1 border-l border-dashed border-ink/25" />
                        ) : null}
                      </div>
                      <article
                        className={`flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-ink/10 bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:gap-5 md:p-6 ${
                          i < experience.length - 1 ? "mb-5 md:mb-6" : ""
                        }`}
                      >
                        {job.logo ? (
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-sm sm:size-[3.75rem] md:size-16">
                            <Image
                              src={job.logo}
                              alt={`${job.company} logo`}
                              fill
                              className="rounded-xl object-contain p-1.5"
                              sizes="(min-width: 768px) 4rem, 3.5rem"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0 flex-1 text-left">
                          <h3 className="font-sans text-lg font-bold tracking-tight text-ink md:text-xl">{job.role}</h3>
                          {job.workSlug ? (
                            <Link
                              href={`/work/${job.workSlug}`}
                              className="mt-1.5 inline-block font-mono text-sm font-semibold tracking-wide text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent-600"
                            >
                              {job.company}
                            </Link>
                          ) : job.href ? (
                            <Link
                              href={job.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-block font-mono text-sm font-semibold tracking-wide text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent-600"
                            >
                              {job.company}
                            </Link>
                          ) : (
                            <span className="mt-1.5 block font-mono text-sm font-semibold tracking-wide">
                              {job.company}
                            </span>
                          )}
                          <p className="caption-mono mt-3 text-ink-600">{job.period}</p>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="min-w-0 lg:flex lg:flex-col">
              <aside className="flex w-full flex-col gap-8 rounded-2xl border border-ink/10 bg-surface p-7 shadow-card sm:gap-10 sm:p-8 lg:sticky lg:top-28">
                <div className="flex justify-center lg:justify-start">
                  <Image
                    src="/images/about-profile.png"
                    alt={`${site.name}, profile photo`}
                    width={336}
                    height={336}
                    className="aspect-square w-full max-w-[14rem] rounded-full border border-ink/10 object-cover shadow-md sm:max-w-[16rem] md:max-w-[17.5rem] lg:max-w-none"
                    sizes="(min-width: 1024px) 280px, (min-width: 768px) 280px, 224px"
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <Stat label="Years in frontend" value={`${site.stats.yearsExperience}`} />
                  <Stat
                    label="Roles considered"
                    value="Full-time · contract · consulting · senior individual contributor"
                  />
                  <Stat label="Latest leadership role" value="Lead Frontend, EO Charging" />
                  <Stat
                    label="How I work"
                    value="UK-based, remote, and flexible between synchronous collaboration and asynchronous work."
                    valueClassName="text-lg leading-snug"
                  />
                </div>
              </aside>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="border-b border-ink/10 pb-5 last:border-0 last:pb-0">
      <p className="caption-mono text-ink-500">{label}</p>
      <p
        className={`mt-2 font-sans text-xl font-bold tracking-tight text-ink ${valueClassName ?? ""}`.trim()}
      >
        {value}
      </p>
    </div>
  );
}
