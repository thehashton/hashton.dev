"use server";

import { desc, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import {
  emailSubscribers,
  goals,
  milestones,
  profiles,
  socialChannels,
  socialMetricSnapshots,
  type SocialChannel,
  type UserRole,
} from "@/db/schema";
import { actionError, actionOk, type ActionResult } from "@/lib/action-result";
import { auth } from "@/lib/auth/server";
import { canManageUsers, requireAppSession } from "@/lib/auth/session";
import {
  getGoalMetric,
  isGoalMetricKey,
  platformFromChannelKey,
  resolveMetricValue,
  type GoalMetricKey,
} from "@/lib/goal-metrics";
import { londonToday, nextFollowerFields, asDayString } from "@/lib/social-stats";
import {
  fetchYouTubeChannelStats,
  isYouTubeChannel,
  isYouTubeConfigured,
} from "@/lib/youtube";

async function recordMetricSnapshot(input: {
  channelId: string;
  followerCount: number;
  viewCount: number;
  videoCount: number;
  capturedOn?: string;
}) {
  const capturedOn = input.capturedOn ?? londonToday();
  await db
    .insert(socialMetricSnapshots)
    .values({
      channelId: input.channelId,
      capturedOn,
      followerCount: input.followerCount,
      viewCount: input.viewCount,
      videoCount: input.videoCount,
    })
    .onConflictDoUpdate({
      target: [socialMetricSnapshots.channelId, socialMetricSnapshots.capturedOn],
      set: {
        followerCount: input.followerCount,
        viewCount: input.viewCount,
        videoCount: input.videoCount,
      },
    });
}

async function syncLinkedGoals(channel: SocialChannel) {
  const linked = await db.select().from(goals).where(eq(goals.channelId, channel.id));
  if (linked.length === 0) return;

  const today = londonToday();
  const now = new Date();

  for (const goal of linked) {
    if (!goal.metricKey || !isGoalMetricKey(goal.metricKey)) continue;
    const currentValue = resolveMetricValue(channel, goal.metricKey, today);
    if (currentValue === goal.currentValue) continue;

    await db
      .update(goals)
      .set({ currentValue, updatedAt: now })
      .where(eq(goals.id, goal.id));

    const openMilestones = await db
      .select()
      .from(milestones)
      .where(eq(milestones.goalId, goal.id));

    for (const milestone of openMilestones) {
      if (milestone.reachedAt) continue;
      if (currentValue >= milestone.targetValue) {
        await db
          .update(milestones)
          .set({ reachedAt: now })
          .where(eq(milestones.id, milestone.id));
      }
    }
  }
}

async function syncYouTubeStats(channel: SocialChannel) {
  if (!channel.url) {
    throw new Error("Add a YouTube channel URL first, then refresh.");
  }

  const stats = await fetchYouTubeChannelStats(channel.url);
  if (stats.hiddenSubscriberCount) {
    throw new Error("This channel hides its subscriber count.");
  }

  const today = londonToday();
  const next = nextFollowerFields(channel, stats.subscriberCount, today, stats.viewCount);
  const [updated] = await db
    .update(socialChannels)
    .set({
      followerCount: next.followerCount,
      dayStartCount: next.dayStartCount,
      dayStartDate: next.dayStartDate,
      viewCount: next.viewCount,
      dayStartViewCount: next.dayStartViewCount,
      videoCount: stats.videoCount,
      externalId: stats.channelId,
      channelTitle: stats.title,
      thumbnailUrl: stats.thumbnailUrl,
      updatedAt: next.updatedAt,
    })
    .where(eq(socialChannels.id, channel.id))
    .returning();

  const saved = updated ?? {
    ...channel,
    followerCount: next.followerCount,
    dayStartCount: next.dayStartCount,
    dayStartDate: next.dayStartDate,
    viewCount: next.viewCount,
    dayStartViewCount: next.dayStartViewCount,
    videoCount: stats.videoCount,
  };

  await recordMetricSnapshot({
    channelId: saved.id,
    followerCount: next.followerCount,
    viewCount: next.viewCount,
    videoCount: stats.videoCount,
    capturedOn: today,
  });

  await syncLinkedGoals(saved);
  return saved;
}

export async function createGoal(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to create goals.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const channelId = String(formData.get("channelId") ?? "").trim();
  const metricKeyRaw = String(formData.get("metricKey") ?? "").trim();
  const targetValue = Number(formData.get("targetValue") ?? 0);
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!title) return actionError("Title is required.");
  if (!channelId) return actionError("Choose a social channel to track.");
  if (!isGoalMetricKey(metricKeyRaw)) return actionError("Choose a metric to track.");

  const metricKey: GoalMetricKey = metricKeyRaw;
  const metric = getGoalMetric(metricKey);
  if (!metric) return actionError("Choose a metric to track.");

  try {
    const [channel] = await db
      .select()
      .from(socialChannels)
      .where(eq(socialChannels.id, channelId))
      .limit(1);

    if (!channel) return actionError("Social channel not found.");

    const platform = platformFromChannelKey(channel.key);
    const allowed = metric.platforms.includes(platform);
    if (!allowed) {
      return actionError(`“${metric.label}” isn’t available for ${channel.label}.`);
    }

    const currentValue = resolveMetricValue(channel, metricKey);

    await db.insert(goals).values({
      title,
      platform,
      channelId: channel.id,
      metricKey,
      targetValue: Number.isFinite(targetValue) ? Math.max(0, Math.round(targetValue)) : 0,
      currentValue,
      notes,
      createdBy: session.user.id,
    });
  } catch {
    return actionError("Could not create goal.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard/social");
  return actionOk();
}

export async function updateGoalProgress(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to update goals.");
  }

  const id = String(formData.get("id") ?? "");
  const currentValue = Number(formData.get("currentValue") ?? 0);
  if (!id) return actionError("Goal is missing.");

  try {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id)).limit(1);
    if (!goal) return actionError("Goal not found.");
    if (goal.channelId && goal.metricKey) {
      return actionError("This goal syncs from social data — refresh the channel instead.");
    }

    await db
      .update(goals)
      .set({
        currentValue: Number.isFinite(currentValue) ? Math.max(0, Math.round(currentValue)) : 0,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, id));
  } catch {
    return actionError("Could not update goal.");
  }

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return actionOk();
}

export async function updateGoalTarget(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to update goals.");
  }

  const id = String(formData.get("id") ?? "");
  const targetValue = Number(formData.get("targetValue") ?? 0);
  if (!id) return actionError("Goal is missing.");

  try {
    await db
      .update(goals)
      .set({
        targetValue: Number.isFinite(targetValue) ? Math.max(0, Math.round(targetValue)) : 0,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, id));
  } catch {
    return actionError("Could not update target.");
  }

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return actionOk();
}

export async function deleteGoal(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to delete goals.");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("Goal is missing.");

  try {
    await db.delete(goals).where(eq(goals.id, id));
  } catch {
    return actionError("Could not delete goal.");
  }

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
  return actionOk();
}

export async function addMilestone(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to add milestones.");
  }

  const goalId = String(formData.get("goalId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const targetValue = Number(formData.get("targetValue") ?? 0);

  if (!goalId || !label) return actionError("Milestone label is required.");

  try {
    await db.insert(milestones).values({
      goalId,
      label,
      targetValue: Number.isFinite(targetValue) ? targetValue : 0,
    });
  } catch {
    return actionError("Could not add milestone.");
  }

  revalidatePath("/dashboard/goals");
  return actionOk();
}

export async function updateSocialChannel(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to update channels.");
  }

  const id = String(formData.get("id") ?? "");
  const url = String(formData.get("url") ?? "").trim() || null;

  if (!id) return actionError("Channel is missing.");

  const [channel] = await db
    .select()
    .from(socialChannels)
    .where(eq(socialChannels.id, id))
    .limit(1);
  if (!channel) return actionError("Channel not found.");

  try {
    await db
      .update(socialChannels)
      .set({
        url,
        updatedAt: new Date(),
      })
      .where(eq(socialChannels.id, id));
  } catch {
    return actionError("Could not update channel.");
  }

  const nextChannel = { ...channel, url };
  if (isYouTubeChannel(nextChannel) && url) {
    if (!isYouTubeConfigured()) {
      return actionError("Add YOUTUBE_DATA_API_KEY to .env.local, then restart the dev server.");
    }
    try {
      await syncYouTubeStats(nextChannel);
    } catch (error) {
      return actionError(
        error instanceof Error ? error.message : "URL saved, but YouTube sync failed.",
      );
    }
  }

  revalidatePath("/dashboard/social");
  revalidatePath(`/dashboard/social/${id}`);
  revalidatePath("/dashboard");
  return actionOk();
}

export async function createSocialChannel(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to add channels.");
  }

  const key = String(formData.get("key") ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim() || null;
  const today = londonToday();

  if (!key || !label) return actionError("Key and label are required.");

  let insertedId: string | null = null;

  try {
    const [inserted] = await db
      .insert(socialChannels)
      .values({
        key,
        label,
        url,
        followerCount: 0,
        dayStartCount: 0,
        dayStartDate: today,
      })
      .returning();
    insertedId = inserted?.id ?? null;
  } catch {
    return actionError("Could not add channel.");
  }

  if (insertedId && url && (key === "youtube" || /youtube\.com|youtu\.be/i.test(url))) {
    if (!isYouTubeConfigured()) {
      return actionError("Channel created. Add YOUTUBE_DATA_API_KEY to sync subscriber stats.");
    }
    const [created] = await db
      .select()
      .from(socialChannels)
      .where(eq(socialChannels.id, insertedId))
      .limit(1);
    if (created) {
      try {
        await syncYouTubeStats(created);
      } catch (error) {
        return actionError(
          error instanceof Error
            ? `Channel created, but YouTube sync failed: ${error.message}`
            : "Channel created, but YouTube sync failed.",
        );
      }
    }
  }

  revalidatePath("/dashboard/social");
  revalidatePath("/dashboard");
  return actionOk();
}

export async function deleteSocialChannel(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to delete channels.");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("Channel is missing.");

  try {
    await db.delete(socialChannels).where(eq(socialChannels.id, id));
  } catch {
    return actionError("Could not delete channel.");
  }

  revalidatePath("/dashboard/social");
  revalidatePath("/dashboard");
  redirect("/dashboard/social");
}

export async function refreshYouTubeChannel(formData: FormData): Promise<ActionResult> {
  const session = await requireAppSession();
  if (session.profile.role === "viewer") {
    return actionError("You do not have permission to refresh channels.");
  }
  if (!isYouTubeConfigured()) {
    return actionError("Add YOUTUBE_DATA_API_KEY to .env.local, then restart the dev server.");
  }

  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("Channel is missing.");

  const [channel] = await db
    .select()
    .from(socialChannels)
    .where(eq(socialChannels.id, id))
    .limit(1);

  if (!channel) return actionError("Channel not found.");
  if (!isYouTubeChannel(channel)) {
    return actionError("Refresh is only available for YouTube channels.");
  }

  try {
    await syncYouTubeStats(channel);
  } catch (error) {
    return actionError(
      error instanceof Error ? error.message : "Could not refresh YouTube stats.",
    );
  }

  revalidatePath("/dashboard/social");
  revalidatePath(`/dashboard/social/${id}`);
  revalidatePath("/dashboard");
  return actionOk();
}

export async function unsubscribeEmail(formData: FormData): Promise<ActionResult> {
  await requireAppSession(["owner", "admin"]);
  const id = String(formData.get("id") ?? "");
  if (!id) return actionError("Subscriber is missing.");

  try {
    await db
      .update(emailSubscribers)
      .set({ status: "unsubscribed", unsubscribedAt: new Date() })
      .where(eq(emailSubscribers.id, id));
  } catch {
    return actionError("Could not unsubscribe.");
  }

  revalidatePath("/dashboard/email-list");
  revalidatePath("/dashboard");
  return actionOk();
}

export async function changePasswordAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAppSession();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");

  if (!currentPassword || !newPassword) {
    return actionError("Both passwords are required.");
  }
  if (newPassword.length < 8) {
    return actionError("New password must be at least 8 characters.");
  }

  const { error } = await auth.changePassword({
    currentPassword,
    newPassword,
  });

  if (error) {
    return actionError(error.message || "Could not change password.");
  }

  return actionOk();
}

export async function createUserAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAppSession();
  if (!canManageUsers(session.profile.role)) {
    return actionError("You do not have permission to create users.");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "viewer") as UserRole;

  if (!email || !name || !password) {
    return actionError("Name, email, and password are required.");
  }
  if (!["owner", "admin", "viewer"].includes(role)) {
    return actionError("Invalid role.");
  }
  if (role === "owner" && session.profile.role !== "owner") {
    return actionError("Only owners can create other owners.");
  }

  const { data, error } = await auth.signUp.email({
    email,
    name,
    password,
  });

  if (error) {
    return actionError(error.message || "Failed to create user.");
  }

  const userId = data?.user?.id;
  if (!userId) {
    return actionError("User created but id was missing.");
  }

  try {
    await db.insert(profiles).values({
      userId,
      email,
      displayName: name,
      role,
    });
  } catch {
    return actionError("User signed up but profile could not be saved.");
  }

  revalidatePath("/dashboard/settings");
  return actionOk();
}

export async function listSubscribers(query?: string) {
  await requireAppSession();
  const q = query?.trim();

  if (!q) {
    return db.select().from(emailSubscribers).orderBy(desc(emailSubscribers.subscribedAt));
  }

  return db
    .select()
    .from(emailSubscribers)
    .where(
      or(
        ilike(emailSubscribers.email, `%${q}%`),
        ilike(emailSubscribers.name, `%${q}%`),
      ),
    )
    .orderBy(desc(emailSubscribers.subscribedAt));
}

export async function getDashboardStats() {
  await requireAppSession();
  const [subscriberRows, channelRows, profileRows] = await Promise.all([
    db
      .select()
      .from(emailSubscribers)
      .where(eq(emailSubscribers.status, "active")),
    db.select().from(socialChannels).orderBy(socialChannels.label),
    db.select().from(profiles).orderBy(profiles.createdAt),
  ]);

  const today = londonToday();
  const staleMs = 30 * 60 * 1000;
  const now = Date.now();

  const channels = await Promise.all(
    channelRows.map(async (channel) => {
      let current = channel;

      // After adding day-start columns, existing rows default to 0 — seed from the
      // current count once so the overview doesn't show a fake +N spike.
      if (current.dayStartCount === 0 && current.followerCount > 0) {
        const [seeded] = await db
          .update(socialChannels)
          .set({
            dayStartCount: current.followerCount,
            dayStartDate: today,
          })
          .where(eq(socialChannels.id, current.id))
          .returning();
        if (seeded) current = seeded;
      }

      // Roll the daily baseline forward at midnight without requiring an edit.
      if (asDayString(current.dayStartDate) !== today) {
        const [rolled] = await db
          .update(socialChannels)
          .set({
            dayStartCount: current.followerCount,
            dayStartViewCount: current.viewCount,
            dayStartDate: today,
          })
          .where(eq(socialChannels.id, current.id))
          .returning();
        if (rolled) current = rolled;
      }

      const looksLikeYouTube =
        current.key.toLowerCase() === "youtube" ||
        /youtube\.com|youtu\.be/i.test(current.url ?? "");

      if (
        looksLikeYouTube &&
        current.url &&
        isYouTubeConfigured() &&
        now - current.updatedAt.getTime() > staleMs
      ) {
        try {
          current = await syncYouTubeStats(current);
        } catch {
          // Keep the last known count if YouTube is unavailable.
        }
      }

      return {
        ...current,
        dailyDelta: current.followerCount - current.dayStartCount,
        dailyViewDelta: current.viewCount - current.dayStartViewCount,
      };
    }),
  );

  // Refresh goal progress from the latest channel rows (covers non-YouTube too).
  await Promise.all(channels.map((channel) => syncLinkedGoals(channel)));

  const refreshedGoals = await db.select().from(goals).orderBy(desc(goals.updatedAt));

  return {
    goals: refreshedGoals,
    activeSubscribers: subscriberRows.length,
    channels,
    users: profileRows,
  };
}
