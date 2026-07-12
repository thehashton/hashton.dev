import { eq } from "drizzle-orm";
import webpush from "web-push";

import { db } from "@/db";
import { profiles, pushSubscriptions } from "@/db/schema";

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:harry.ashton.uk@gmail.com";

  if (!publicKey || !privateKey) return false;

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function notifyOwnersOfSignup(email: string) {
  if (!configureWebPush()) return;

  const owners = await db.select().from(profiles).where(eq(profiles.role, "owner"));
  if (owners.length === 0) return;

  const ownerIds = new Set(owners.map((o) => o.userId));
  const subs = await db.select().from(pushSubscriptions);
  const payload = JSON.stringify({
    title: "New email signup",
    body: `${email} joined your list.`,
    url: "/dashboard/email-list",
  });

  await Promise.all(
    subs
      .filter((sub) => ownerIds.has(sub.userId))
      .map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            payload,
          );
        } catch {
          // Drop dead subscriptions quietly
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        }
      }),
  );
}
