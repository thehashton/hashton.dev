/**
 * Seeds the owner account + default social channels.
 * Run: pnpm seed
 */
import { config } from "dotenv";

config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../src/db/schema";

const OWNER_EMAIL = "harry.ashton.uk@gmail.com";
const OWNER_PASSWORD = "Password123";
const OWNER_NAME = "hashton";

async function main() {
  if (!process.env.DATABASE_URL || !process.env.NEON_AUTH_BASE_URL) {
    throw new Error("Missing DATABASE_URL or NEON_AUTH_BASE_URL");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });
  const authBase = process.env.NEON_AUTH_BASE_URL.replace(/\/$/, "");

  const signUpRes = await fetch(`${authBase}/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
    },
    body: JSON.stringify({
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD,
      name: OWNER_NAME,
      callbackURL: "http://localhost:3000/dashboard",
    }),
  });

  let userId: string | undefined;

  if (signUpRes.ok) {
    const data = (await signUpRes.json()) as { user?: { id?: string } };
    userId = data.user?.id;
    console.log("Created auth user");
  } else {
    const text = await signUpRes.text();
    console.log("Sign-up response:", signUpRes.status, text.slice(0, 200));
    const rows = (await sql`
      SELECT id FROM neon_auth."user" WHERE email = ${OWNER_EMAIL} LIMIT 1
    `) as Array<{ id: string }>;
    userId = rows[0]?.id;
    if (!userId) {
      throw new Error("Could not create or find owner user");
    }
    console.log("Found existing auth user");
  }

  if (!userId) {
    throw new Error("Could not create or find owner user");
  }

  const [existing] = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, userId))
    .limit(1);

  if (existing) {
    await db
      .update(schema.profiles)
      .set({
        role: "owner",
        displayName: OWNER_NAME,
        email: OWNER_EMAIL,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.userId, userId));
    console.log("Updated owner profile");
  } else {
    await db.insert(schema.profiles).values({
      userId,
      email: OWNER_EMAIL,
      displayName: OWNER_NAME,
      role: "owner",
    });
    console.log("Created owner profile");
  }

  const defaults = [
    { key: "youtube", label: "YouTube", url: "https://youtube.com/@hashton", followerCount: 0 },
    {
      key: "instagram",
      label: "Instagram",
      url: "https://instagram.com/hashton",
      followerCount: 0,
    },
    { key: "tiktok", label: "TikTok", url: "https://tiktok.com/@hashton", followerCount: 0 },
    { key: "twitter", label: "X / Twitter", url: "https://x.com/TheHashton", followerCount: 0 },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/hashton",
      followerCount: 0,
    },
  ];

  for (const channel of defaults) {
    const [found] = await db
      .select()
      .from(schema.socialChannels)
      .where(eq(schema.socialChannels.key, channel.key))
      .limit(1);
    if (!found) {
      await db.insert(schema.socialChannels).values(channel);
      console.log("Added channel", channel.key);
    }
  }

  console.log("Seed complete. Login with", OWNER_EMAIL);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
