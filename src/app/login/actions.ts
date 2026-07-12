"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { auth } from "@/lib/auth/server";

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const { error } = await auth.signIn.email({ email, password });

  if (error) {
    return { error: error.message || "Failed to sign in. Try again." };
  }

  const { data: session } = await auth.getSession();
  if (session?.user) {
    const [existing] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, session.user.id))
      .limit(1);

    if (!existing) {
      await db.insert(profiles).values({
        userId: session.user.id,
        email: session.user.email,
        displayName: session.user.name || "User",
        role: "viewer",
      });
    }
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  await auth.signOut();
  redirect("/login");
}

export async function requestPasswordResetAction(
  _prevState: { error?: string; ok?: boolean } | null,
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return { error: "Email is required." };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

  const { error } = await auth.requestPasswordReset({
    email,
    redirectTo: `${siteUrl}/login/reset-password`,
  });

  if (error) {
    return { error: error.message || "Could not send reset email. Try again." };
  }

  // Always show success to avoid email enumeration
  return { ok: true };
}

export async function resetPasswordAction(
  _prevState: { error?: string; ok?: boolean } | null,
  formData: FormData,
) {
  const token = String(formData.get("token") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!token) {
    return { error: "Reset link is missing or invalid. Request a new one." };
  }
  if (!newPassword || newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const { error } = await auth.resetPassword({
    newPassword,
    token,
  });

  if (error) {
    return {
      error: error.message || "Could not reset password. The link may have expired.",
    };
  }

  return { ok: true };
}
