"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/lib/site";
import { resetPasswordAction } from "../actions";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, isPending] = useActionState(resetPasswordAction, null);

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
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>Choose a new password for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {!token && !state?.ok ? (
              <div className="space-y-4 text-center">
                <p className="rounded-lg bg-accent/10 px-3 py-3 text-sm text-accent-600">
                  This reset link is missing a token. Request a new one from the forgot password
                  page.
                </p>
                <Link
                  href="/login/forgot-password"
                  className="inline-flex text-sm text-ink-500 underline-offset-4 hover:text-ink hover:underline"
                >
                  Request a new link
                </Link>
              </div>
            ) : state?.ok ? (
              <div className="space-y-4 text-center">
                <p className="rounded-lg bg-ink/5 px-3 py-3 text-sm text-ink-600">
                  Password updated. You can sign in with your new password.
                </p>
                <Link
                  href="/login"
                  className="inline-flex text-sm font-medium text-accent-600 underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-4">
                <input type="hidden" name="token" value={token} />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                  />
                </div>
                {state?.error ? (
                  <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent-600">
                    {state.error}
                  </p>
                ) : null}
                <Button type="submit" variant="accent" disabled={isPending} className="w-full">
                  {isPending ? "Saving…" : "Update password"}
                </Button>
                <p className="text-center text-sm text-ink-500">
                  <Link href="/login" className="underline-offset-4 hover:underline">
                    Back to sign in
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
