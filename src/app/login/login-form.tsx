"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/lib/site";
import { signInWithEmail } from "./actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--palette-accent-100)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom,_var(--palette-muted)_0%,_transparent_50%)] opacity-70 dark:opacity-40"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-ink/10 bg-surface/90 shadow-card">
          <CardHeader className="space-y-3 text-center">
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className="mx-auto inline-flex items-center justify-center transition-opacity hover:opacity-90"
            >
              <Image
                src="/images/logos/hashton-logo.png"
                alt=""
                width={841}
                height={267}
                priority
                className="h-14 w-auto object-contain dark:invert sm:h-16"
              />
            </Link>
            <p className="caption-mono text-ink-500">Hashton HQ</p>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>Email and password access to your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="password" className="mb-0">
                    Password
                  </Label>
                  <Link
                    href="/login/forgot-password"
                    className="text-sm text-ink-500 underline-offset-4 hover:text-ink hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                />
              </div>
              {state?.error ? (
                <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-600">
                  {state.error}
                </p>
              ) : null}
              <Button type="submit" variant="accent" disabled={isPending} className="w-full">
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-ink-500">
              <Link href="/" className="underline-offset-4 hover:underline">
                Back to site
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
