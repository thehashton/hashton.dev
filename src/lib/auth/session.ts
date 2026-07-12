import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { profiles, type Profile, type UserRole } from "@/db/schema";
import { auth } from "@/lib/auth/server";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};

export type AppSession = {
  user: SessionUser;
  profile: Profile;
};

export async function getSessionUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? session.user.email,
  } satisfies SessionUser;
}

export async function getAppSession(): Promise<AppSession | null> {
  const user = await getSessionUser();
  if (!user) return null;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  if (!profile) return null;

  return { user, profile };
}

export async function requireAppSession(roles?: UserRole[]): Promise<AppSession> {
  const session = await getAppSession();
  if (!session) redirect("/login");

  if (roles && !roles.includes(session.profile.role)) {
    redirect("/dashboard");
  }

  return session;
}

export function canManageUsers(role: UserRole) {
  return role === "owner" || role === "admin";
}
