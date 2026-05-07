import Link from "next/link";

import { HeroSkills } from "@/components/sections/hero-skills";
import { HeroVideo } from "@/components/video/hero-video";
import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { shellClass } from "@/lib/layout-shell";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section id="hero" className="scroll-mt-28 overflow-x-clip border-b-2 border-ink bg-paper">
      <div
        className={cn(
          shellClass,
          "grid w-full grid-cols-1 gap-y-8 py-12 md:gap-y-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-12 lg:items-center lg:py-24",
        )}
      >
        <Reveal className="min-w-0">
          <SectionLabel label="Intro" />
          <div className="space-y-3">
            <h1 className="display-text max-w-[18ch] text-ink">Harry Ashton</h1>
            <p className="caption-mono text-ink-500">
              Online as <span className="font-semibold text-accent">{site.nickname}</span>
            </p>
          </div>
          <p className="mt-8 max-w-xl font-mono text-[0.8125rem] leading-relaxed text-ink-700 md:text-sm">
            Contract and consulting frontend work — design systems, accessibility, micro-frontends, and shipping with teams that need velocity without chaos.
          </p>
          <p className="mt-6 max-w-xl text-[1.125rem] leading-relaxed text-ink-800">{site.tagline}</p>

          <p className="caption-mono mt-8 border-y border-ink py-4 leading-relaxed text-ink-600 md:mt-10">
            {site.location}. {site.stats.yearsExperience} years shipping UI. Open to contract, consulting, or senior IC roles.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
            <Button variant="accent" asChild>
              <Link href="#contact">Hire me</Link>
            </Button>
            <Button asChild>
              <Link href="#contact">Contract & consulting</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#work">Selected work</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0">
          <div>
            <HeroVideo
              src={{ mp4: "/video/hero.mp4", webm: "/video/hero.webm" }}
              poster="/video/hero-poster.jpg"
              durationLabel="01:00"
              caption="A minute with Harry"
            />
            <HeroSkills />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
