import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { shellClass } from "@/lib/layout-shell";
import { site } from "@/lib/site";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-28 border-b-2 border-ink bg-paper py-14 md:py-24 lg:py-28">
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="About" />
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <h2 className="font-sans text-[2.5rem] font-bold leading-[1.05] tracking-tight text-ink md:text-[3rem]">
                Engineer first. Clarity under pressure.
              </h2>
              <p className="mt-8 max-w-2xl text-[1.125rem] leading-relaxed text-ink-800">
                I&apos;m a senior frontend engineer with a long arc from agency throughput to product leadership:
                {" "}
                <strong className="text-ink">design systems</strong>,{" "}
                <strong className="text-ink">accessibility engineering</strong>, and{" "}
                <strong className="text-ink">micro-frontends</strong>
                {" "}where teams need guardrails without slowing delivery.
              </p>
              <p className="mt-6 max-w-2xl text-[1.125rem] leading-relaxed text-ink-800">
                Today I&apos;m focused on{" "}
                <strong className="text-ink">contract and consulting frontend work</strong>
                {" "}— senior IC delivery, sensible architecture, and accessibility engineering teams can sustain.
                If you need someone who ships and explains trade-offs without theatre, we&apos;ll get along.
              </p>
            </div>

            <aside className="flex flex-col gap-6 border-2 border-ink bg-paper p-8 shadow-[8px_8px_0_0_#0a0a0a]">
              <Stat label="Years in frontend" value={`${site.stats.yearsExperience}`} />
              <Stat label="Engagement types" value="Contract · consulting · senior IC" />
              <Stat label="Latest leadership role" value="Lead Frontend, EO Charging" />
              <Stat label="Operating mode" value="UTC± remote, async-first" />
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-ink/15 pb-5 last:border-0 last:pb-0">
      <p className="caption-mono text-ink-500">{label}</p>
      <p className="mt-2 font-sans text-xl font-bold tracking-tight text-ink">{value}</p>
    </div>
  );
}
