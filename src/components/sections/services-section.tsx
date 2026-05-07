import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { shellClass } from "@/lib/layout-shell";

const pillars = [
  {
    title: "Engineering",
    body: "Design systems, accessibility programs, micro-frontends, performance pragmatism — the boring infrastructure that keeps velocity honest.",
  },
  {
    title: "Contract delivery",
    body: "Embedded IC work for defined scopes — shipping production UI, stabilizing patterns, and handing off code teams can own without a rewrite fantasy.",
  },
  {
    title: "Consulting",
    body: "Frontend audits, UI architecture decisions, and pragmatic standards — plus stakeholder-ready clarity when you need a decision, not a slide deck.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-28 border-b-2 border-ink bg-paper py-14 md:py-24 lg:py-28">
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="What I do" />
          <h2 className="font-sans text-[2.5rem] font-bold tracking-tight text-ink md:text-[3rem]">
            Three lanes. One bar for craft.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <article className="flex h-full flex-col border-2 border-ink bg-paper p-8 shadow-[8px_8px_0_0_#0a0a0a]">
                <p className="caption-mono text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-sans text-3xl font-bold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-6 text-[1.125rem] leading-relaxed text-ink-800">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
