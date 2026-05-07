"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { site } from "@/lib/site";
import { socialPlatforms } from "@/lib/social-platforms";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Use a valid email"),
  message: z.string().min(12, "Give me a bit more context"),
});

type FormValues = z.infer<typeof schema>;

export function ContactSection() {
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

      toast.success("Sent. I’ll read it.");
      form.reset();
    } catch {
      toast.error("Network error — try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-28 bg-paper py-14 md:py-24 lg:py-28">
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
                  {socialPlatforms.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="invert-hover flex items-center justify-center gap-2.5 border-2 border-ink px-4 py-4 font-mono text-caption font-semibold tracking-[0.14em] uppercase"
                      >
                        <SocialBrandIcon brand={s.brand} className="size-5 shrink-0" />
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Reveal delay={0.06}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="border-2 border-ink bg-paper p-8 shadow-[8px_8px_0_0_#0a0a0a] md:p-10"
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
                <Button type="submit" variant="accent" className="mt-10 w-full md:w-auto" disabled={pending}>
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
