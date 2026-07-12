import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | undefined;

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Project → Settings → Environment Variables (Production + Preview), including Build if you need it at build time.",
    );
  }
  return drizzle(neon(url), { schema });
}

/** Lazily created so Next.js can import routes during build without DATABASE_URL. */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    cached ??= createDb();
    const value = Reflect.get(cached, prop, receiver);
    return typeof value === "function" ? value.bind(cached) : value;
  },
});
