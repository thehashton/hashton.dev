import Link from "next/link";
import { ArrowRight, Briefcase, Mail } from "lucide-react";

import { HeroSkills } from "@/components/sections/hero-skills";
import { HeroVideo } from "@/components/video/hero-video";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { shellClass } from "@/lib/layout-shell";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section id="hero" className="scroll-mt-28 w-full min-w-0 overflow-x-clip border-b border-ink/10 bg-paper">
      <div
        className={cn(
          shellClass,
          "grid w-full grid-cols-1 gap-y-8 py-12 md:gap-y-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-12 lg:gap-y-12 lg:items-center lg:py-24",
        )}
      >
        <Reveal className="min-w-0">
          <div className="space-y-3">
            <h1 className="display-text max-w-[18ch] text-ink lg:text-[5rem] lg:leading-[0.98]">Harry Ashton</h1>
            <p className="caption-mono text-ink-500">
              Online as <span className="font-semibold text-accent">HASHTON</span>
            </p>
          </div>
          <p className="mt-8 max-w-xl text-[1.125rem] leading-relaxed text-ink/70 md:text-[1.25rem]">
            Contract and consulting frontend work — design systems, component architecture, and production UI for teams that need senior judgment without the overhead. Founder of Frontend Now.
          </p>

          <p className="caption-mono mt-8 border-y border-ink/10 py-4 text-[0.8125rem] leading-relaxed text-ink-600 md:mt-10 md:text-caption">
            {site.location}. {site.stats.yearsExperience} years shipping ui. Open to contract, consulting, or senior IC roles.
          </p>

          <div className="mt-8 md:mt-10">
            <div
              className={cn(
                "flex max-w-full flex-col gap-2 rounded-2xl border border-ink/10 bg-muted p-2",
                "md:w-max md:flex-row md:flex-nowrap md:items-stretch md:gap-2",
              )}
            >
              <Button variant="accent" className="w-full shrink-0 rounded-xl md:w-auto" asChild>
                <Link href="#contact" className="inline-flex items-center justify-center gap-2">
                  <Mail className="size-4" aria-hidden />
                  Hire me
                </Link>
              </Button>
              <Button className="w-full shrink-0 rounded-xl md:w-auto" asChild>
                <Link href="#contact" className="inline-flex items-center justify-center gap-2">
                  <Briefcase className="size-4" aria-hidden />
                  Contract & consulting
                </Link>
              </Button>
              <Button variant="ghost" className="w-full shrink-0 rounded-xl md:w-auto" asChild>
                <Link href="#work" className="inline-flex items-center justify-center gap-2">
                  <ArrowRight className="size-4" aria-hidden />
                  See my work
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0">
          <div>
            <HeroVideo
              kind="mux"
              playbackId="KuB2l83CxQCAaUCp9F8H00vhNtrTX011d8K3WiPzpfmjs"
              thumbnailTime={1}
              caption="A minute with Harry"
              durationLabel="01:00"
            />
            <HeroSkills />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
