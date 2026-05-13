"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { SectionLabel } from "@/components/sections/section-label";
import { Reveal } from "@/components/motion/reveal";
import { shellClass } from "@/lib/layout-shell";
import { SocialBrandIcon } from "@/components/social/social-brand-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { site } from "@/lib/site";
import { socialPlatforms } from "@/lib/social-platforms";
import { cn } from "@/lib/utils";

/** Brand-forward tiles for the contact “Social grid” (footer keeps neutral chips). */
const CONTACT_SOCIAL_TILE: Record<
  (typeof socialPlatforms)[number]["id"],
  string
> = {
  youtube:
    "border-transparent bg-[#FF0000] text-white shadow-sm hover:bg-[#e60000] hover:text-white focus-visible:outline-white/80",
  tiktok:
    "border-transparent bg-[#000000] text-white shadow-sm hover:bg-zinc-900 hover:text-white focus-visible:outline-white/80",
  instagram:
    "border-transparent bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F58529] text-white shadow-sm hover:opacity-95 hover:text-white focus-visible:outline-white/80",
  x: "border-transparent bg-[#000000] text-white shadow-sm hover:bg-zinc-900 hover:text-white focus-visible:outline-white/80",
  linkedin:
    "border-transparent bg-[#0A66C2] text-white shadow-sm hover:bg-[#084d94] hover:text-white focus-visible:outline-white/80",
  github:
    "border-transparent bg-[#24292f] text-white shadow-sm hover:bg-[#1a1e22] hover:text-white focus-visible:outline-white/80",
};

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Use a valid email"),
  message: z.string().min(12, "Give me a bit more context"),
});

type FormValues = z.infer<typeof schema>;

/** Matches `grid-cols-2 sm:grid-cols-3` so tooltip side follows the visual row. */
function useContactSocialGridColumns(): 2 | 3 {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => undefined;
      const mq = window.matchMedia("(min-width: 640px)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => (typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches ? 3 : 2),
    () => 2,
  );
}

export function ContactSection() {
  const gridCols = useContactSocialGridColumns();
  const [pending, setPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok?: boolean; fallback?: boolean };

      if (!res.ok) {
        toast.error("Something broke — try email instead.");
        return;
      }

      if (data.fallback) {
        toast.message("Email isn’t wired yet — opening your mail client.", {
          description: "Add RESEND_API_KEY + CONTACT_EMAIL for API delivery.",
        });
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Portfolio: ${values.name}`)}&body=${encodeURIComponent(`${values.message}\n\n— ${values.email}`)}`;
        return;
      }

      toast.success("Message received! I really appreciate you reaching out.");
      form.reset();
    } catch {
      toast.error("Network error — try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-28 w-full min-w-0 bg-paper pt-8 pb-14 md:pt-10 md:pb-24 lg:pt-10 lg:pb-28">
      <div className={shellClass}>
        <Reveal>
          <SectionLabel label="Contact" />
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="font-sans text-[2.5rem] font-bold tracking-tight text-ink md:text-[3rem]">
                Say hello — roles, contracts, or consulting.
              </h2>
              <p className="mt-6 max-w-lg text-[1.125rem] leading-relaxed text-ink-800">
                Tell me what you&apos;re building, the role or engagement type, and your timeline.
                Short briefs beat polished vagueness.
              </p>

              <div className="mt-10">
                <p className="caption-mono text-ink-600">Social grid</p>
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {socialPlatforms.map((s, index) => {
                    const row = Math.floor(index / gridCols);
                    const tooltipSide = row % 2 === 0 ? "top" : "bottom";
                    return (
                      <li key={s.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={s.label ? `${s.label} — ${s.channelName}` : `X — ${s.channelName}`}
                              className={cn(
                                "flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border px-4 py-3 font-mono text-caption font-semibold tracking-[0.14em] uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                                CONTACT_SOCIAL_TILE[s.id],
                              )}
                            >
                              <SocialBrandIcon brand={s.brand} className="size-5 shrink-0" />
                              {s.label ? <span>{s.label}</span> : null}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            side={tooltipSide}
                            sideOffset={8}
                            className="max-w-[min(100vw-1rem,20rem)] text-left font-sans text-[11px] font-medium normal-case tracking-normal"
                          >
                            {s.channelName}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <Reveal delay={0.06}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-2xl border border-ink/10 bg-surface p-8 shadow-card md:p-10"
              >
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" autoComplete="name" {...form.register("name")} />
                    {form.formState.errors.name ? (
                      <p className="caption-mono mt-2 text-accent">{form.formState.errors.name.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
                    {form.formState.errors.email ? (
                      <p className="caption-mono mt-2 text-accent">{form.formState.errors.email.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={6} {...form.register("message")} />
                    {form.formState.errors.message ? (
                      <p className="caption-mono mt-2 text-accent">{form.formState.errors.message.message}</p>
                    ) : null}
                  </div>
                </div>
                <Button type="submit" variant="accent" className="mt-10 min-h-14 w-full px-10 md:w-auto md:px-12" disabled={pending}>
                  {pending ? "Sending…" : "Send message"}
                </Button>
              </form>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
