import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { emailSubscribers } from "@/db/schema";
import { notifyOwnersOfSignup } from "@/lib/push";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email().max(320),
  name: z.string().max(160).optional(),
  website: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    // Honeypot — bots fill this; humans leave it empty
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const name = parsed.data.name?.trim() || null;

    const [existing] = await db
      .select()
      .from(emailSubscribers)
      .where(eq(emailSubscribers.email, email))
      .limit(1);

    if (existing) {
      if (existing.status === "unsubscribed") {
        await db
          .update(emailSubscribers)
          .set({
            status: "active",
            name: name ?? existing.name,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          })
          .where(eq(emailSubscribers.id, existing.id));
      }
      return NextResponse.json({ ok: true, existing: true });
    }

    await db.insert(emailSubscribers).values({
      email,
      name,
      source: "website",
      status: "active",
    });

    await notifyOwnersOfSignup(email).catch(() => undefined);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
